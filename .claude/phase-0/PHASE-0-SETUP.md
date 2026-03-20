# Phase 0 — Project Setup & Scaffolding

Paste these prompts into Claude Code in order (0.1 → 0.2 → 0.3).

---

## 0.1 — Init Next.js Project

```
Create a new Next.js 14 project with the following config:
- App Router (not Pages Router)
- TypeScript: yes
- Tailwind CSS: yes
- ESLint: yes
- src/ directory: yes
- Import alias: @/*

After scaffolding, update next.config.ts to:
  output: "export"
  basePath: "/interview-prep-blog"
  assetPrefix: "/interview-prep-blog/"
  images: { unoptimized: true }
  trailingSlash: true

Install these additional packages:
- gray-matter (frontmatter parsing)
- remark, remark-html, remark-gfm (markdown → HTML)
- rehype-slug, rehype-autolink-headings (TOC anchors)
- reading-time
- fuse.js (client-side search)
- date-fns

Show me the final package.json and next.config.ts.
```

---

## 0.2 — Folder Structure

```
Create this exact folder structure inside the project:

src/
  app/
    blog/[slug]/page.tsx
    category/[name]/page.tsx
    tag/[tag]/page.tsx
    page/[number]/page.tsx
    layout.tsx
    page.tsx
    globals.css
  components/
    layout/
      Sidebar.tsx
      Header.tsx
      Footer.tsx
    blog/
      BlogCard.tsx
      BlogList.tsx
      TableOfContents.tsx
      ShareButtons.tsx
      RelatedPosts.tsx
      Pagination.tsx
      ReadingTime.tsx
    search/
      SearchBar.tsx
    ui/
      Tag.tsx
      CategoryBadge.tsx
  content/
    sample-post.md
  lib/
    posts.ts
    toc.ts
    search.ts
    utils.ts
  types/
    blog.ts
  public/
    og/

Create placeholder files with TODO comments. Also create the types/blog.ts with the BlogPost interface:
{
  slug, title, description, category, subcategory,
  tags, date, related, content, readingTime, toc
}
```

---

## 0.3 — Sample Markdown Content

```
Create 3 sample blog posts in src/content/ with this frontmatter schema:

---
slug: "react-hooks-deep-dive"
title: "React Hooks Deep Dive"
description: "Complete guide to React hooks for senior interviews"
category: "React"
subcategory: "Hooks"
tags: ["react", "hooks", "useState", "useEffect"]
date: "2026-03-20"
related: ["useEffect-patterns", "custom-hooks-guide"]
---

Create one post each for:
1. React hooks (category: React, subcategory: Hooks)
2. Next.js App Router (category: Next.js, subcategory: Routing)
3. TypeScript generics (category: TypeScript, subcategory: Advanced)

Each post should have ~500 words with h2 and h3 headings for TOC testing.
```
