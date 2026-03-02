# Common Pitfalls: WordPress to Sanity/Astro/Vercel Migration

## Vercel Routing (Static Sites)

### vercel.json `has: host` redirects do not work

Vercel's routing pipeline for static sites puts `"handle": "filesystem"` before redirect
evaluation. When a request comes in for `blog.example.com/`, Vercel finds `index.html` in
the filesystem and serves it immediately, never reaching the redirect rules. The page renders
with the wrong domain's assets, appearing broken.

**Fix:** Use Vercel Routing Middleware (root `middleware.ts`) instead.

### Astro `src/middleware.ts` does not run for static pages

With `output: 'static'`, Astro only generates a serverless function for SSR routes (e.g.,
API endpoints like `/api/contact`). The `.vercel/output/config.json` only routes SSR paths
to the function handler. Prerendered static pages are served directly from the filesystem.

**Fix:** Use root `middleware.ts` (Vercel Routing Middleware), not Astro middleware.

### `edgeMiddleware: true` does not help

Setting `edgeMiddleware: true` on `@astrojs/vercel` adapter only renames the serverless
handler from `_render` to `_middleware`. It does NOT add a catch-all route before the
filesystem handler in Vercel's output config. Static pages are still served before the
middleware runs.

**Fix:** Use root `middleware.ts` without any adapter options. Set adapter to `vercel()`
with no arguments.

### Root middleware.ts placement

The file must be at the project root (same level as `package.json`), NOT inside `src/`.
It must use the Web API `Request`/`Response` (no framework imports needed). Return
`undefined` (or nothing) to pass through to normal routing.

## Sanity + Astro Integration

### `@sanity/astro` with `output: 'static'` requires hash routing

The Sanity Studio's default browser router requires SSR (`output: 'server'`). For static
sites, set `studioRouterHistory: 'hash'` in the sanity integration config:

```javascript
sanity({
  projectId: '...',
  dataset: 'production',
  studioBasePath: '/studio',
  studioRouterHistory: 'hash',  // Required for output: 'static'
})
```

### `sanity:client` virtual module fails in Vercel SSR

The `sanity:client` virtual module provided by `@sanity/astro` can fail to inline
environment variables in Vercel's serverless output. Import `@sanity/client` directly
and configure it manually instead.

### `@sanity/image-url` deprecation

The default export of `@sanity/image-url` is deprecated. Use the named export:

```typescript
import { createImageUrlBuilder } from '@sanity/image-url';
```

## Vite / Environment Variables

### Inline comments in `.env` files

Vite's `loadEnv` does not handle inline comments correctly:

```env
# BAD - inline comment causes issues
KEY=value # this is a comment

# GOOD - separate line
# this is a comment
KEY=value
```

### `.env.local` overrides `.env`

When debugging missing env vars, check both files. `.env.local` takes precedence.

### Loading non-prefixed env vars

By default, Vite only loads `PUBLIC_` (Astro) or `VITE_` prefixed variables on the client.
For server-side scripts, use `loadEnv(mode, cwd, '')` with an empty prefix string to load
all variables, or read `.env.local` directly in Node scripts.

## WordPress XML Parsing

### Attachment pages vs real posts

WordPress exports include "attachment" post types for uploaded media. These have short
slugs (e.g., `bison`, `coldplay`) that look like blog posts but are actually image pages.
Always filter by `wp:post_type === 'post'` AND `wp:status === 'publish'`.

### CDATA handling

WordPress XML wraps most content in CDATA sections. The `fast-xml-parser` config must
include `cdataPropName: '__cdata'` to properly extract CDATA content. Without it, content
fields may be empty or contain raw CDATA markers.

### `isArray` configuration

Elements like `category`, `wp:postmeta`, and `item` may appear once or multiple times.
Without the `isArray` callback, single-element cases parse as plain objects instead of
arrays, causing `.filter()` and `.map()` to fail silently.

### Gutenberg HTML comments

WordPress Gutenberg editor wraps blocks in HTML comments like `<!-- wp:paragraph -->`.
These must be stripped before HTML-to-Portable-Text conversion or they will appear as
text content in the migrated posts.

### HTML entities

WordPress content commonly uses HTML entities for typographic characters. Explicit
decoding is needed for: curly/smart quotes (`&#8216;`, `&#8217;`, `&#8220;`, `&#8221;`),
en/em dashes (`&#8211;`, `&#8212;`), ellipsis (`&#8230;`), and non-breaking spaces
(`&nbsp;`, `&#160;`).

## Astro Build

### `output: 'hybrid'` removed in Astro 5

Astro 5 removed `output: 'hybrid'`. Use `output: 'static'` which now supports per-route
SSR opt-out via `export const prerender = false` on individual pages.

### Tailwind CSS v4 in Astro

Tailwind CSS v4 uses `@tailwindcss/vite` as a Vite plugin, NOT `@astrojs/tailwind`.
Configure it in the Vite plugins array:

```javascript
vite: {
  plugins: [tailwindcss()],
}
```

## SEO and Redirects

### Generate vercel.json redirects programmatically

Manually listing 30+ redirect rules is error-prone. Parse the WordPress XML to extract
all post slugs and generate the redirect entries automatically. WordPress slug-only URLs
(`/post-slug`) need redirecting to the new path (`/news/post-slug`).

### Submit updated sitemap to Google Search Console

After migration, submit the new XML sitemap to Google Search Console. Monitor the Coverage
report for 404 errors in the first few weeks, as Google will still be crawling old URLs.

### Blog subdomain DNS

When migrating a blog subdomain, add it as a domain in the Vercel project dashboard FIRST,
then create the CNAME DNS record pointing to `cname.vercel-dns.com`. Wait for Vercel to
provision the SSL certificate before testing.
