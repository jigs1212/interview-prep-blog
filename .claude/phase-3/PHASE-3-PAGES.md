# Phase 3 — Pages & Static Routes

Paste these prompts into Claude Code in order (3.1 → 3.2 → 3.3 → 3.4).

---

## 3.1 — Home Page + Paginated List

```
Build src/app/page.tsx (Home = Blog List Page 1):
- Server Component
- Fetch first 10 posts using getPaginatedPosts(1)
- Fetch all categories and tags for sidebar props
- Render BlogList + Pagination components
- generateMetadata() with site title and description

Build src/app/page/[number]/page.tsx:
- generateStaticParams(): generate params for all page numbers
- generateMetadata(): "Page X of Y — Interview Prep Hub"
- Same layout as home, but for page N
- If someone visits /page/1, redirect them to /

Both pages pass categories and tags to the layout/sidebar.
```

---

## 3.2 — Blog Detail Page

```
Build src/app/blog/[slug]/page.tsx:

- generateStaticParams(): return { slug } for every post
- generateMetadata(params): full Open Graph + Twitter Card metadata
    og:title, og:description, og:image (/og/[slug].png), og:type: article
    twitter:card: summary_large_image
    canonical URL using NEXT_PUBLIC_SITE_URL env variable

Page layout — 3 column on desktop, stacked on mobile:
  LEFT COL (sticky, 240px): TableOfContents component
  CENTER COL (flex-1): Article content
    - H1 title
    - Meta row: date | reading time | category badge
    - Tags list
    - Rendered HTML (post.content) inside a <div> with Tailwind prose classes
    - ShareButtons below article
    - RelatedPosts section at bottom
  RIGHT COL (160px): empty / reserved for future use

Apply Tailwind @tailwindcss/typography prose class to the rendered HTML container.
All heading IDs in the rendered HTML must match the TOC anchor IDs.
```

---

## 3.3 — Category & Tag Pages

```
Build src/app/category/[name]/page.tsx:
- generateStaticParams(): all unique category names (slugified)
- generateMetadata(): "[Category] Interview Prep Articles — Interview Prep Hub"
- Fetch posts for this category with getPostsByCategory()
- Render: category header with name + post count, BlogList, Pagination
- Handle 0-results gracefully with a "No posts in this category yet" message

Build src/app/tag/[tag]/page.tsx:
- generateStaticParams(): all unique tags
- generateMetadata(): "#[tag] Articles — Interview Prep Hub"
- Fetch posts for this tag with getPostsByTag()
- Render: tag header, BlogList
- Handle 0-results gracefully

For category names with spaces (e.g. "System Design"), use URL-safe slugs
(system-design) in the route but display the original name as the heading.
Add a slugify() helper to src/lib/utils.ts.
```

---

## 3.4 — SEO: Sitemap, Robots, OG Images

```
1. Create src/app/sitemap.ts (Next.js Metadata API):
   - Return MetadataRoute.Sitemap
   - Include all blog, category, tag, and page routes
   - Use NEXT_PUBLIC_SITE_URL as base URL
   - Priority: home=1.0, blog posts=0.8, category/tag=0.6

2. Create src/app/robots.ts:
   - Allow all crawlers
   - Point to sitemap URL

3. Create scripts/generate-og-images.ts:
   - For each post, generate a 1200x630 PNG to public/og/[slug].png
   - Use the 'sharp' package to compose the image:
     - Dark background (#0f172a)
     - White title text (max 2 lines, wraps at 60 chars)
     - Category badge (colored rectangle + white text)
     - Site name "Interview Prep Hub" at bottom right
     - Subtle grid pattern overlay
   - Skip if file already exists (cache)
   - Add to package.json scripts:
     "generate:og": "npx tsx scripts/generate-og-images.ts"
     "prebuild": "npm run generate:og && npx tsx scripts/generate-search-index.ts"
     "predev": "npx tsx scripts/generate-search-index.ts"

4. Create .env.example:
   NEXT_PUBLIC_SITE_URL=https://[your-username].github.io/interview-prep-blog
   NEXT_PUBLIC_SITE_NAME=Interview Prep Hub
```
