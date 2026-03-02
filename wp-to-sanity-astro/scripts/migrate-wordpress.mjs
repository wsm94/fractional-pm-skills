/**
 * WordPress XML to Sanity CMS Migration Script
 *
 * Usage: node scripts/migrate-wordpress.mjs
 *
 * Reads a WordPress WXR export XML file, converts posts to Sanity blogPost
 * documents, uploads featured/inline images, and creates documents via the
 * Sanity client.
 *
 * CUSTOMISE BEFORE RUNNING:
 *   1. Set XML_PATH to point to your WordPress export file
 *   2. Update CATEGORY_MAP to match your Sanity category values
 *   3. Ensure .env.local has PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET,
 *      and SANITY_API_TOKEN
 *   4. Update the Sanity document _type and field names if your schema differs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@sanity/client';
import { XMLParser } from 'fast-xml-parser';

// --- Config ---

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Load env from .env.local (avoid inline comments - they break Vite's loadEnv)
const envText = readFileSync(resolve(ROOT, '.env.local'), 'utf-8');
const env = Object.fromEntries(
  envText
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const eq = l.indexOf('=');
      return [l.slice(0, eq).trim(), l.slice(eq + 1).trim()];
    }),
);

const PROJECT_ID = env.PUBLIC_SANITY_PROJECT_ID;
const DATASET = env.PUBLIC_SANITY_DATASET || 'production';
const TOKEN = env.SANITY_API_TOKEN;

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  useCdn: false,
  apiVersion: '2025-01-30',
});

// CUSTOMISE: Path to your WordPress XML export file
const XML_PATH = resolve(ROOT, 'docs/wordpress-export.xml');

// CUSTOMISE: Map WordPress category slugs to your Sanity category values.
// WordPress categories appear as <category domain="category" nicename="slug">
const CATEGORY_MAP = {
  // 'wp-category-slug': 'sanity-category-value',
  uncategorized: 'news',
};

// --- XML Parsing ---

function parseExport() {
  const xml = readFileSync(XML_PATH, 'utf-8');

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    cdataPropName: '__cdata',
    // CRITICAL: These elements may appear once or multiple times.
    // Without isArray, single-element cases parse as objects, not arrays.
    isArray: (name) =>
      ['item', 'category', 'wp:postmeta', 'wp:category', 'wp:tag'].includes(name),
  });

  const parsed = parser.parse(xml);
  const channel = parsed.rss.channel;
  const items = channel.item || [];

  // Build attachment map: post_id -> attachment_url
  // WordPress stores images as "attachment" post types
  const attachments = new Map();
  for (const item of items) {
    const postType = cdata(item['wp:post_type']);
    if (postType === 'attachment') {
      const id = String(item['wp:post_id']);
      const url = cdata(item['wp:attachment_url']);
      if (url) attachments.set(id, url);
    }
  }

  // Extract published posts only (skip drafts, pages, attachments)
  const posts = items
    .filter((item) => {
      const postType = cdata(item['wp:post_type']);
      const status = cdata(item['wp:status']);
      return postType === 'post' && status === 'publish';
    })
    .map((item) => {
      const title = cdata(item.title) || '';
      const slug = cdata(item['wp:post_name']) || '';
      const content = cdata(item['content:encoded']) || '';
      const excerpt = cdata(item['excerpt:encoded']) || '';
      const publishDate = cdata(item['wp:post_date_gmt']) || '';
      const postId = String(item['wp:post_id']);

      // Get categories (domain="category" only, not tags)
      const cats = (item.category || [])
        .filter((c) => c['@_domain'] === 'category')
        .map((c) => {
          const nicename = c['@_nicename'] || '';
          return CATEGORY_MAP[nicename];
        })
        .filter(Boolean);
      const uniqueCats = [...new Set(cats)];

      // Resolve featured image via _thumbnail_id postmeta
      let featuredImageUrl = null;
      const metas = item['wp:postmeta'] || [];
      for (const meta of metas) {
        if (cdata(meta['wp:meta_key']) === '_thumbnail_id') {
          const thumbId = String(cdata(meta['wp:meta_value']));
          featuredImageUrl = attachments.get(thumbId) || null;
          break;
        }
      }

      return {
        title,
        slug,
        content,
        excerpt,
        publishDate,
        categories: uniqueCats,
        featuredImageUrl,
        wpPostId: postId,
      };
    });

  console.log(`Found ${posts.length} published posts`);
  console.log(`Found ${attachments.size} attachments`);
  return posts;
}

/**
 * Extract text from CDATA-wrapped XML values.
 * fast-xml-parser stores CDATA in __cdata or #text depending on config.
 */
function cdata(val) {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val.__cdata !== undefined) return val.__cdata;
  if (typeof val === 'object' && val['#text'] !== undefined) return String(val['#text']);
  return String(val);
}

// --- HTML to Portable Text ---

/**
 * Convert WordPress Gutenberg HTML to Sanity Portable Text blocks.
 * Handles: paragraphs, headings (h2-h4), lists (ul/ol), blockquotes,
 * images, links, bold, italic, hr, tables (as paragraphs).
 */
function htmlToPortableText(html) {
  // Strip WordPress Gutenberg comments (<!-- wp:paragraph --> etc.)
  const clean = html.replace(/<!--.*?-->/gs, '').trim();
  if (!clean) return [];

  const blocks = [];
  const elements = splitTopLevelElements(clean);

  for (const el of elements) {
    const trimmed = el.trim();
    if (!trimmed) continue;

    // Heading (h2-h4)
    const headingMatch = trimmed.match(/^<h([2-4])[^>]*>([\s\S]*?)<\/h[2-4]>/i);
    if (headingMatch) {
      blocks.push(makeBlock(`h${headingMatch[1]}`, parseInline(headingMatch[2])));
      continue;
    }

    // Paragraph
    if (trimmed.startsWith('<p')) {
      const inner = trimmed.replace(/^<p[^>]*>([\s\S]*?)<\/p>$/i, '$1').trim();
      if (!inner) continue;

      // Check if paragraph contains only an image
      if (inner.match(/^<img[^>]+>$/i)) {
        const imgBlock = parseImageTag(inner);
        if (imgBlock) blocks.push(imgBlock);
        continue;
      }

      blocks.push(makeBlock('normal', parseInline(inner)));
      continue;
    }

    // Unordered list
    if (trimmed.startsWith('<ul')) {
      for (const item of extractListItems(trimmed)) {
        blocks.push(makeListBlock('bullet', parseInline(item)));
      }
      continue;
    }

    // Ordered list
    if (trimmed.startsWith('<ol')) {
      for (const item of extractListItems(trimmed)) {
        blocks.push(makeListBlock('number', parseInline(item)));
      }
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('<blockquote')) {
      const inner = trimmed.replace(/^<blockquote[^>]*>([\s\S]*?)<\/blockquote>$/i, '$1').trim();
      const pTexts = [];
      for (const m of inner.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
        pTexts.push(m[1].trim());
      }
      const text = pTexts.length > 0 ? pTexts.join(' ') : stripHtml(inner);
      if (text) blocks.push(makeBlock('blockquote', parseInline(text)));
      continue;
    }

    // HR / separator - skip
    if (trimmed.match(/^<hr\b/i)) continue;

    // Standalone image or figure
    if (trimmed.startsWith('<img') || trimmed.startsWith('<figure')) {
      const imgMatch = trimmed.match(/<img[^>]+>/i);
      if (imgMatch) {
        const imgBlock = parseImageTag(imgMatch[0]);
        if (imgBlock) blocks.push(imgBlock);
      }
      continue;
    }

    // Table
    if (trimmed.includes('<table')) {
      blocks.push(...parseTable(trimmed));
      continue;
    }

    // Fallback: treat as paragraph
    const fallbackText = stripHtml(trimmed).trim();
    if (fallbackText) {
      blocks.push(makeBlock('normal', parseInline(fallbackText)));
    }
  }

  return blocks;
}

/**
 * Split HTML into top-level elements using depth tracking.
 * Handles nested tags correctly (e.g., list items inside lists).
 */
function splitTopLevelElements(html) {
  const elements = [];
  let current = '';
  let depth = 0;
  let i = 0;

  while (i < html.length) {
    if (html[i] === '<') {
      // Self-closing tags
      const selfClose = html.slice(i).match(/^<(img|hr|br)[^>]*\/?>/i);
      if (selfClose) {
        if (depth === 0) {
          if (current.trim()) elements.push(current.trim());
          elements.push(selfClose[0]);
          current = '';
        } else {
          current += selfClose[0];
        }
        i += selfClose[0].length;
        continue;
      }

      // Closing tag
      const closeMatch = html.slice(i).match(/^<\/([a-zA-Z][a-zA-Z0-9]*)[^>]*>/);
      if (closeMatch) {
        depth = Math.max(0, depth - 1);
        current += closeMatch[0];
        i += closeMatch[0].length;
        if (depth === 0) {
          if (current.trim()) elements.push(current.trim());
          current = '';
        }
        continue;
      }

      // Opening tag
      const openMatch = html.slice(i).match(/^<([a-zA-Z][a-zA-Z0-9]*)[^>]*>/);
      if (openMatch) {
        if (depth === 0 && current.trim()) {
          elements.push(current.trim());
          current = '';
        }
        current += openMatch[0];
        if (openMatch[0].endsWith('/>')) {
          if (depth === 0) {
            elements.push(current.trim());
            current = '';
          }
        } else {
          depth++;
        }
        i += openMatch[0].length;
        continue;
      }
    }

    current += html[i];
    i++;
  }

  if (current.trim()) elements.push(current.trim());
  return elements;
}

let blockKeyCounter = 0;
function genKey() {
  return `blk${String(++blockKeyCounter).padStart(6, '0')}`;
}

function makeBlock(style, spans) {
  const block = {
    _type: 'block',
    _key: genKey(),
    style,
    markDefs: [],
    children: [],
  };

  for (const span of spans) {
    if (span.type === 'text') {
      block.children.push({
        _type: 'span',
        _key: genKey(),
        text: span.text,
        marks: span.marks || [],
      });
    } else if (span.type === 'link') {
      const markKey = genKey();
      block.markDefs.push({
        _type: 'link',
        _key: markKey,
        href: span.href,
        openInNewTab: span.newTab || false,
      });
      block.children.push({
        _type: 'span',
        _key: genKey(),
        text: span.text,
        marks: [...(span.marks || []), markKey],
      });
    }
  }

  if (block.children.length === 0) {
    block.children.push({ _type: 'span', _key: genKey(), text: '', marks: [] });
  }

  return block;
}

function makeListBlock(listItem, spans) {
  const block = makeBlock('normal', spans);
  block.listItem = listItem;
  block.level = 1;
  return block;
}

/**
 * Parse inline HTML into spans with marks (bold, italic, links).
 */
function parseInline(html) {
  const spans = [];
  let remaining = html;

  while (remaining.length > 0) {
    const tagIdx = remaining.indexOf('<');
    if (tagIdx === -1) {
      const text = decodeEntities(remaining);
      if (text) spans.push({ type: 'text', text, marks: [] });
      break;
    }

    if (tagIdx > 0) {
      const text = decodeEntities(remaining.slice(0, tagIdx));
      if (text) spans.push({ type: 'text', text, marks: [] });
      remaining = remaining.slice(tagIdx);
    }

    // <br>
    const brMatch = remaining.match(/^<br\s*\/?>/i);
    if (brMatch) {
      spans.push({ type: 'text', text: '\n', marks: [] });
      remaining = remaining.slice(brMatch[0].length);
      continue;
    }

    // <strong> or <b>
    const strongMatch = remaining.match(/^<(strong|b)>([\s\S]*?)<\/\1>/i);
    if (strongMatch) {
      for (const s of parseInline(strongMatch[2])) {
        s.marks = [...(s.marks || []), 'strong'];
        spans.push(s);
      }
      remaining = remaining.slice(strongMatch[0].length);
      continue;
    }

    // <em> or <i>
    const emMatch = remaining.match(/^<(em|i)>([\s\S]*?)<\/\1>/i);
    if (emMatch) {
      for (const s of parseInline(emMatch[2])) {
        s.marks = [...(s.marks || []), 'em'];
        spans.push(s);
      }
      remaining = remaining.slice(emMatch[0].length);
      continue;
    }

    // <a href="...">
    const linkMatch = remaining.match(
      /^<a\s[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/i,
    );
    if (linkMatch) {
      const href = decodeEntities(linkMatch[1]);
      const innerText = stripHtml(linkMatch[2]);
      const newTab =
        linkMatch[0].includes('target="_blank"') ||
        linkMatch[0].includes("target='_blank'");

      const innerSpans = parseInline(linkMatch[2]);
      if (innerSpans.length === 1 && innerSpans[0].type === 'text') {
        spans.push({
          type: 'link',
          href,
          text: innerSpans[0].text,
          marks: innerSpans[0].marks || [],
          newTab,
        });
      } else {
        spans.push({ type: 'link', href, text: innerText, marks: [], newTab });
      }
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Unknown tag - skip
    const skipTag = remaining.match(/^<[^>]+>/);
    if (skipTag) {
      remaining = remaining.slice(skipTag[0].length);
      continue;
    }

    spans.push({ type: 'text', text: remaining[0], marks: [] });
    remaining = remaining.slice(1);
  }

  return spans;
}

function extractListItems(html) {
  const items = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = liRegex.exec(html)) !== null) {
    items.push(match[1].trim());
  }
  return items;
}

function parseImageTag(imgTag) {
  const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
  if (!srcMatch) return null;
  const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
  return {
    _type: 'imageRef',
    _key: genKey(),
    url: srcMatch[1],
    alt: altMatch ? decodeEntities(altMatch[1]) : '',
  };
}

function parseTable(html) {
  const blocks = [];
  const rows = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;
  while ((trMatch = trRegex.exec(html)) !== null) {
    const cells = [];
    const cellRegex = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(trMatch[1])) !== null) {
      cells.push(stripHtml(cellMatch[1]).trim());
    }
    rows.push(cells);
  }

  if (rows.length > 1) {
    const headers = rows[0];
    for (let i = 1; i < rows.length; i++) {
      const parts = rows[i]
        .map((cell, j) => (headers[j] ? `${headers[j]}: ${cell}` : cell))
        .join(' | ');
      blocks.push(makeBlock('normal', [{ type: 'text', text: parts, marks: [] }]));
    }
  }

  return blocks;
}

function stripHtml(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ''));
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, '\u2019') // right single quote
    .replace(/&#8216;/g, '\u2018') // left single quote
    .replace(/&#8220;/g, '\u201C') // left double quote
    .replace(/&#8221;/g, '\u201D') // right double quote
    .replace(/&#8211;/g, '\u2013') // en dash
    .replace(/&#8212;/g, '\u2014') // em dash
    .replace(/&#8230;/g, '\u2026') // ellipsis
    .replace(/&nbsp;/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&#8243;/g, '\u2033') // double prime
    .replace(/&#039;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

// --- Image Upload ---

async function uploadImageFromUrl(url, filename) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  Failed to fetch image: ${url} (${res.status})`);
      return null;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload('image', buffer, {
      filename: filename || url.split('/').pop() || 'image.jpg',
    });
    return asset;
  } catch (err) {
    console.warn(`  Error uploading image ${url}: ${err.message}`);
    return null;
  }
}

// --- Migration ---

async function migrate() {
  console.log('Starting WordPress to Sanity migration...\n');

  const posts = parseExport();
  console.log('');

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const post of posts) {
    console.log(`Processing: "${post.title}"`);

    // Idempotency: skip if post already exists by slug
    const existing = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0]._id`,
      { slug: post.slug },
    );
    if (existing) {
      console.log(`  SKIP - already exists (${existing})`);
      skipped++;
      continue;
    }

    try {
      // Convert HTML to Portable Text
      const rawBlocks = htmlToPortableText(post.content);

      // Upload inline images and resolve to Sanity references
      const body = [];
      for (const block of rawBlocks) {
        if (block._type === 'imageRef') {
          const asset = await uploadImageFromUrl(block.url, `${post.slug}-inline.jpg`);
          if (asset) {
            body.push({
              _type: 'image',
              _key: block._key,
              asset: { _type: 'reference', _ref: asset._id },
              alt: block.alt || post.title,
            });
          }
        } else {
          body.push(block);
        }
      }

      // Upload featured image
      let featuredImage = undefined;
      if (post.featuredImageUrl) {
        console.log(`  Uploading featured image...`);
        const asset = await uploadImageFromUrl(
          post.featuredImageUrl,
          `${post.slug}-featured.jpg`,
        );
        if (asset) {
          featuredImage = {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
            alt: post.title,
          };
        }
      }

      // CUSTOMISE: Adjust field names to match your Sanity schema
      const doc = {
        _type: 'blogPost',
        title: post.title,
        slug: { _type: 'slug', current: post.slug },
        publishDate: post.publishDate
          ? new Date(post.publishDate + 'Z').toISOString()
          : new Date().toISOString(),
        excerpt: post.excerpt || undefined,
        categories: post.categories.length > 0 ? post.categories : undefined,
        body,
        featuredImage,
      };

      await client.create(doc);
      console.log(`  CREATED`);
      created++;
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Migration complete!`);
  console.log(`  Created: ${created}`);
  console.log(`  Skipped: ${skipped} (already existed)`);
  console.log(`  Errors:  ${errors}`);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
