# Interview Prep Hub

A static blog for senior developer interview preparation, built with Next.js 14 and deployed to GitHub Pages.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222?logo=github)

## Local Development

```bash
git clone https://github.com/<your-username>/interview-prep-blog.git
cd interview-prep-blog
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000/interview-prep-blog/](http://localhost:3000/interview-prep-blog/)

## Adding a New Blog Post

Create a markdown file in `src/content/` with this frontmatter:

```markdown
---
slug: "your-post-slug"
title: "Your Post Title"
description: "A short description for cards and SEO"
category: "React"
subcategory: "Hooks"
tags: ["react", "hooks", "interview"]
date: "2026-03-20"
related: ["other-post-slug"]
---

## Your Content Here

Write using h2 and h3 headings — they become the Table of Contents.
```

## Build & Deploy

```bash
npm run build        # Generates OG images, search index, and static export
npm run analyze      # Build with bundle analyzer
```

Deployment is automatic via GitHub Actions on push to `main`.

## Folder Structure

```
src/
  app/
    blog/[slug]/page.tsx      # Blog post detail
    category/[name]/page.tsx   # Category listing
    tag/[tag]/page.tsx         # Tag listing
    page/[number]/page.tsx     # Paginated listing
    layout.tsx                 # Root layout (sidebar + header)
    page.tsx                   # Home page
    sitemap.ts                 # Auto-generated sitemap
    robots.ts                  # Robots.txt
    globals.css                # Global styles + prose
  components/
    layout/
      Sidebar.tsx              # Fixed left sidebar with categories/tags
      Header.tsx               # Top bar with search + mobile menu
      Footer.tsx               # Footer
    blog/
      BlogCard.tsx             # Post card with metadata
      BlogList.tsx             # Grid of BlogCards
      TableOfContents.tsx      # Scroll-spy TOC
      ShareButtons.tsx         # LinkedIn, Twitter, WhatsApp, copy link
      RelatedPosts.tsx         # Related posts grid
      Pagination.tsx           # Page navigation
      ReadingTime.tsx          # Reading time display
    search/
      SearchBar.tsx            # Fuse.js client-side search
    ui/
      Tag.tsx                  # Tag badge
      CategoryBadge.tsx        # Category badge
  content/                     # Markdown blog posts
  lib/
    posts.ts                   # Post data fetching + caching
    toc.ts                     # TOC extraction from HTML
    search.ts                  # Search index builder
    utils.ts                   # slugify, formatDate
    hooks/
      useDebounce.ts           # Debounce hook for search
  types/
    blog.ts                    # TypeScript interfaces
scripts/
  generate-og-images.ts        # OG image generation (sharp)
  generate-search-index.ts     # Search index generation
```

## MCP Servers (Recommended)

These MCP servers enhance the Claude Code workflow for this project:

1. **Context7** — Up-to-date library documentation
2. **GitHub** — PR/issue management from the terminal
3. **Filesystem** — Direct file operations
4. **Fetch** — Web content retrieval
5. **Sequential Thinking** — Complex problem decomposition
