# Phase 1 — Core Data Layer (lib/)

Paste these prompts into Claude Code in order (1.1 → 1.2 → 1.3).

---

## 1.1 — Post Parser (lib/posts.ts)

```
Build src/lib/posts.ts with these exported functions:

1. getAllPosts(): BlogPost[]
   - Read all .md files from src/content/
   - Parse frontmatter with gray-matter
   - Parse markdown to HTML with remark + remark-gfm + remark-html
   - Add readingTime using reading-time package
   - Sort by date descending
   - Cache result (module-level variable)

2. getPostBySlug(slug: string): BlogPost | null

3. getPostsByCategory(category: string): BlogPost[]

4. getPostsByTag(tag: string): BlogPost[]

5. getAllCategories(): { name: string; count: number }[]

6. getAllTags(): { name: string; count: number }[]

7. getPaginatedPosts(page: number, perPage = 10): { posts, total, totalPages }

8. getRelatedPosts(slugs: string[]): BlogPost[]

Use Node.js fs/path — this runs only at build time (SSG). Add proper TypeScript types throughout. Export a POSTS_PER_PAGE = 10 constant.
```

---

## 1.2 — TOC Generator (lib/toc.ts)

```
Build src/lib/toc.ts:

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
  children: TocItem[];
}

Export:
1. extractToc(htmlContent: string): TocItem[]
   - Parse h2 and h3 from HTML using regex
   - Generate slug-like ids (lowercase, spaces→dashes, strip special chars)
   - Nest h3 under their parent h2
   - Return array of TocItem

2. generateTocHtml(toc: TocItem[]): string
   - Returns an HTML string with nested <ul><li> structure
   - Each li has an <a href="#id"> anchor link

The TOC is generated at build time from parsed markdown HTML.
```

---

## 1.3 — Search Index (lib/search.ts)

```
Build src/lib/search.ts:

1. buildSearchIndex(): SearchIndexItem[]
   - Returns a lean array (no full HTML content) with:
     { slug, title, description, tags, category, date }
   - Used to generate public/search-index.json at build time

Create a script: scripts/generate-search-index.ts
   - Reads all posts, writes public/search-index.json
   - Add to package.json: "prebuild": "npx tsx scripts/generate-search-index.ts"

Also add a "predev" script to package.json that runs the same script so the
search index is available during local development.

The client SearchBar will fetch /search-index.json and use Fuse.js with:
  keys: ["title", "description", "tags", "category"]
  threshold: 0.3
```
