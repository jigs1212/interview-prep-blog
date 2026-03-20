# Phase 2 — Layout & UI Components

Paste these prompts into Claude Code in order (2.1 → 2.2 → 2.3 → 2.4).

---

## 2.1 — Root Layout + Global Styles

```
Build src/app/layout.tsx as the root layout:
- Dark/light mode support via Tailwind dark: classes + CSS variables
- HTML structure: sidebar (fixed, left, 260px) + main content area
- Include Header and Sidebar components
- Add metadata defaults: title template, description, openGraph defaults
- Font: Next.js local font or Google Fonts (pick a dev-friendly mono/sans combo)

Build src/app/globals.css:
- CSS variables for light/dark mode colors
- Prose styles for markdown rendered content (code blocks, blockquotes, tables)
- Tailwind base + utilities

Design direction: Clean, editorial, developer-focused.
Color palette: Dark sidebar (#0f172a) + white/gray content area.
Code blocks: dark theme (like VS Code dark+).
Typography: readable, 18px body, generous line-height.
No purple gradients. No generic AI aesthetics.
```

---

## 2.2 — Sidebar Component

```
Build src/components/layout/Sidebar.tsx:

Props: { categories: CategoryItem[], tags: TagItem[] }

Features:
- Fixed left sidebar, full height, scrollable
- Site logo/name at top (Interview Prep Hub)
- "All Posts" link
- Category list with post counts, links to /category/[name]
- Collapsible subcategory display under each category
- Popular tags section with tag cloud
- Active state highlighting for current page
- Mobile: hidden by default, toggled via hamburger in Header
- Fully responsive with Tailwind

Use Next.js Link for all navigation.
Active state via usePathname() hook.
```

---

## 2.3 — Blog Components (build all 7)

```
Build these blog components one by one:

1. BlogCard.tsx
   - Props: post: BlogPost
   - Shows: title, description, date, category badge, tags, reading time
   - Links to /blog/[slug]
   - Hover state with subtle shadow/border transition

2. BlogList.tsx
   - Props: posts: BlogPost[]
   - Grid or list layout
   - Maps over BlogCard

3. TableOfContents.tsx
   - Props: toc: TocItem[]
   - Sticky right rail on desktop
   - Highlights active section on scroll using IntersectionObserver
   - Smooth scroll to anchor on click
   - Collapsible on mobile
   - Must be "use client"

4. ShareButtons.tsx
   - Props: title: string, url: string
   - Buttons for LinkedIn, Twitter/X, WhatsApp
   - Correct share URL patterns for each platform:
     LinkedIn: https://www.linkedin.com/sharing/share-offsite/?url=
     Twitter:  https://twitter.com/intent/tweet?text=&url=
     WhatsApp: https://wa.me/?text=
   - Copy-link button with clipboard API + "Copied!" feedback
   - Must be "use client"

5. RelatedPosts.tsx
   - Props: posts: BlogPost[]
   - 2-column grid of compact post cards

6. Pagination.tsx
   - Props: currentPage: number, totalPages: number, basePath: string
   - Static links to /page/[number] (no JS)
   - Previous / Next + page number buttons
   - Ellipsis for large page counts

7. ReadingTime.tsx
   - Props: minutes: number
   - Renders "5 min read" with a clock SVG icon
```

---

## 2.4 — Search Bar (client component)

```
Build src/components/search/SearchBar.tsx as a "use client" component:

- Fetches /search-index.json once on mount using useEffect + useState
- Initializes Fuse.js with the fetched index
- Debounced input (300ms) — build a custom useDebounce hook at src/lib/hooks/useDebounce.ts
- Dropdown results list showing: title, category badge, description snippet (first 80 chars)
- Keyboard navigation: ArrowUp/ArrowDown to move through results, Enter to navigate
- Click outside to close (useRef + document addEventListener)
- Empty state message: "No results for '[query]'"
- Loading skeleton while index is being fetched

Place the SearchBar in src/components/layout/Header.tsx.

Important: SearchBar must be "use client". Everything else in this project is Server Components by default.
```
