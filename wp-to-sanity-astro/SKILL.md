---
name: wp-to-sanity-astro
description: "Migrate WordPress blogs to a Sanity CMS + Astro + Vercel stack. This skill should be used when migrating blog content from WordPress (XML export) to Sanity, building Astro blog pages with Portable Text rendering, and configuring URL redirects on Vercel for SEO preservation. Triggers include migrate WordPress, WordPress to Sanity, import blog posts, WordPress to Astro, or any request involving WP XML export processing, Gutenberg HTML to Portable Text conversion, or blog subdomain redirect configuration on Vercel static sites."
---

# WordPress to Sanity/Astro/Vercel Migration

This skill provides a complete, battle-tested workflow for migrating WordPress blog content to a
Sanity CMS + Astro + Vercel stack, including content migration, page templates, and URL redirect
configuration. It encodes hard-won lessons from production migrations.

## Migration Overview

The migration has four phases:

1. **Content Migration** - Parse WordPress XML export, convert HTML to Portable Text, upload to Sanity
2. **Sanity Schema** - Create blogPost document type with proper field definitions
3. **Astro Pages** - Build listing page, individual post pages, RSS feed
4. **URL Redirects** - Configure three layers of redirects for SEO preservation

## Phase 1: Content Migration Script

Use the migration script at `scripts/migrate-wordpress.mjs` as a starting point. Customise the
`CATEGORY_MAP` and schema fields to match the target project.

Run with: `node scripts/migrate-wordpress.mjs`

### Prerequisites

Install dependencies in the project:

```bash
npm install @sanity/client fast-xml-parser
```

Required environment variables in `.env.local`:

```
PUBLIC_SANITY_PROJECT_ID=<project-id>
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<write-token>
```

### Key Implementation Details

**XML Parsing Configuration** - Use `fast-xml-parser` with these critical options:

```javascript
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  cdataPropName: '__cdata',
  isArray: (name) => ['item', 'category', 'wp:postmeta', 'wp:category', 'wp:tag'].includes(name),
});
```

The `isArray` callback is essential because WordPress XML contains elements that may appear once
or multiple times; without it, single-element cases parse as objects instead of arrays.

**CDATA Extraction** - WordPress wraps most content in CDATA sections. Use a helper function:

```javascript
function cdata(val) {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val.__cdata !== undefined) return val.__cdata;
  if (typeof val === 'object' && val['#text'] !== undefined) return String(val['#text']);
  return String(val);
}
```

**Post Filtering** - Only migrate published posts, not attachments/drafts/pages:

```javascript
items.filter(item => {
  const postType = cdata(item['wp:post_type']);
  const status = cdata(item['wp:status']);
  return postType === 'post' && status === 'publish';
});
```

**Featured Image Resolution** - WordPress stores featured images as attachment posts linked via
`_thumbnail_id` postmeta. Build an attachment map first, then resolve:

1. First pass: build `Map<postId, attachmentUrl>` from items where `wp:post_type === 'attachment'`
2. Second pass: for each post, find the `wp:postmeta` where `wp:meta_key === '_thumbnail_id'`
3. Look up the thumbnail ID in the attachment map to get the image URL

**Gutenberg HTML to Portable Text** - Strip `<!-- wp:* -->` comments before parsing. The HTML
converter must handle:

- Top-level element splitting with depth tracking (nested tags)
- Block types: paragraphs, headings (h2-h4), ul/ol lists, blockquotes, images, figures, tables
- Inline marks: bold (`<strong>`/`<b>`), italic (`<em>`/`<i>`), links (`<a>` with href/target)
- Images inside paragraphs (extract as standalone image blocks)
- Tables converted to readable text ("Header: Value | Header: Value")
- HTML entity decoding (curly quotes, en/em dashes, ellipsis, nbsp, numeric entities)

Each Portable Text block requires a unique `_key`. Use a counter-based generator.

**Image Upload** - Fetch image URLs and upload to Sanity Assets:

```javascript
const buffer = Buffer.from(await res.arrayBuffer());
const asset = await client.assets.upload('image', buffer, { filename });
```

Then reference in documents as `{ _type: 'reference', _ref: asset._id }`.

**Idempotency** - Always check if a post exists by slug before creating to allow safe re-runs:

```javascript
const existing = await client.fetch(
  `*[_type == "blogPost" && slug.current == $slug][0]._id`,
  { slug: post.slug }
);
if (existing) { /* skip */ }
```

### WordPress XML Analysis Tips

- Short slugs (e.g., `bison`, `coldplay`) are often attachment pages (images), not real posts
- `content:encoded` contains the post body as CDATA
- Categories use `@_domain="category"` vs tags with `@_domain="post_tag"`
- WordPress.com vs self-hosted exports have slightly different structures

## Phase 2: Sanity Blog Post Schema

Create a `blogPost` document type. See `references/sanity-schema.md` for the complete schema
definition with field types, validation, and preview configuration.

Key fields: title, slug, author (reference), publishDate, excerpt, featuredImage (with hotspot
and alt), categories (predefined string array), body (blockContent/Portable Text), seo.

## Phase 3: Astro Page Templates

### Required Dependencies

```bash
npm install astro-portabletext @tailwindcss/typography @astrojs/rss
```

### Blog Listing Page (`/news/index.astro`)

- Set `export const prerender = true` for static generation
- Fetch all posts via GROQ: `*[_type == "blogPost"] | order(publishDate desc)`
- Render in a responsive grid with featured images, categories, dates
- Include an empty state for when no posts exist

### Individual Post Page (`/news/[slug].astro`)

- Use `getStaticPaths()` to generate pages for all posts at build time
- Render Portable Text body using `astro-portabletext` with custom components
- Create a `PortableTextImage` component for rendering Sanity image references
- Include: breadcrumbs, article metadata, share buttons (LinkedIn, Twitter/X), related posts
- Add Article schema.org markup for SEO

### Blog Post Layout

Use `@tailwindcss/typography` prose classes for styling the article body. Customise typography
for brand colours on headings, links, blockquotes, and list markers.

### RSS Feed (`/rss.xml`)

Use `@astrojs/rss` to generate an RSS feed from all blog posts.

## Phase 4: URL Redirects (Critical)

This is where most migrations hit problems. Three redirect layers are needed.

### Layer 1: vercel.json Redirects (Primary Domain)

For old WordPress slug-only URLs on the main domain. Generate one 301 redirect per post:

```json
{
  "redirects": [
    { "source": "/old-post-slug", "destination": "/news/old-post-slug", "permanent": true }
  ]
}
```

Generate these programmatically from the WordPress XML export.

### Layer 2: Vercel Routing Middleware (Blog Subdomain)

**THIS IS THE MOST IMPORTANT SECTION.** If the WordPress blog was on a subdomain (e.g.,
`blog.example.com`), none of the obvious approaches work:

**DOES NOT WORK: vercel.json `has: host` redirects**
```json
{ "source": "/:path*", "has": [{ "type": "host", "value": "blog.example.com" }], "destination": "/news" }
```
Vercel serves static filesystem files BEFORE evaluating redirect rules. The subdomain request
matches `index.html` and serves the homepage broken (wrong domain assets).

**DOES NOT WORK: Astro `src/middleware.ts`**
With `output: 'static'`, Astro middleware only runs for SSR routes (e.g., API endpoints).
Prerendered pages bypass middleware entirely.

**DOES NOT WORK: `edgeMiddleware: true` on `@astrojs/vercel`**
This only renames the serverless handler function. It does not add a catch-all route before
the filesystem handler in Vercel's routing config.

**THE ONLY WORKING APPROACH: Root `middleware.ts` (Vercel Routing Middleware)**

Create `middleware.ts` at the project root (NOT `src/middleware.ts`). This runs on Vercel's
edge before the filesystem handler:

```typescript
const PRIMARY_HOST = 'example.com';
const BLOG_HOST = 'blog.example.com';

export default function middleware(request: Request) {
  const host = request.headers.get('host')?.replace(/:\d+$/, '');
  if (host !== BLOG_HOST) return;

  const { pathname } = new URL(request.url);

  // WordPress date-based URLs: /yyyy/mm/dd/slug/
  const datePattern = /^\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/?$/;
  const match = pathname.match(datePattern);
  if (match) {
    return Response.redirect(`https://${PRIMARY_HOST}/news/${match[4]}`, 301);
  }

  // Add any other specific redirects here (e.g., /about -> /about)

  // Catch-all: redirect to blog listing
  return Response.redirect(`https://${PRIMARY_HOST}/news`, 301);
}
```

### Layer 3: DNS Configuration

1. Add the blog subdomain as a domain in the Vercel project dashboard
2. Create a CNAME record: `blog` pointing to `cname.vercel-dns.com`
3. Wait for SSL certificate provisioning (automatic on Vercel)
4. Verify redirects work before decommissioning the old WordPress installation

## Common Pitfalls

Refer to `references/pitfalls.md` for a comprehensive list of gotchas encountered during
production migrations, covering Vite env loading, Sanity/Astro integration, Vercel routing,
and WordPress XML parsing edge cases.

## Workflow Summary

1. Export WordPress content as XML (Tools > Export in WP Admin)
2. Create or adapt the Sanity blogPost schema
3. Customise the migration script's `CATEGORY_MAP` and XML path
4. Run `node scripts/migrate-wordpress.mjs` and verify in Sanity Studio
5. Build Astro blog listing and post pages with Portable Text rendering
6. Add vercel.json redirects for primary domain slug-only URLs
7. If blog was on a subdomain, create root `middleware.ts` for subdomain redirects
8. Configure DNS for the blog subdomain in Vercel
9. Deploy, test all redirects, submit updated sitemap to Google Search Console
10. Monitor for 404s in the first few weeks post-migration
