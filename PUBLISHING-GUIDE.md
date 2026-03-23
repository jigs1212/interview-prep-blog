# How to Publish a New Blog Post

## Step 1: Generate the Content

1. Open `blog-prompt.md` in this repo.
2. Copy the prompt template.
3. Replace all `{{PLACEHOLDER}}` values with your topic details.
4. Paste the filled prompt into any AI content tool (ChatGPT, Claude, etc.).
5. Review the generated markdown — tweak wording, fix code examples, add your own insights.

## Step 2: Create the File

1. Save the markdown file in `src/content/` using **kebab-case** naming:
   ```
   src/content/your-post-slug.md
   ```
2. The filename doesn't need to match the slug (the frontmatter `slug` field is what matters), but keeping them consistent is recommended.

## Step 3: Verify Frontmatter

Make sure your file has all required frontmatter fields:

```yaml
---
slug: "your-post-slug"          # URL-safe, kebab-case, must be unique
title: "Your Post Title"        # Display title
description: "Short description" # Used on cards and for SEO
category: "React"               # One of your site categories
subcategory: "Hooks"            # More specific grouping
tags: ["tag1", "tag2"]          # Array of lowercase tags
date: "2026-03-23"              # YYYY-MM-DD format
related: ["other-post-slug"]    # Slugs of related posts (can be empty [])
---
```

### Existing categories

Check which categories already exist by looking at other posts in `src/content/`. Using an existing category groups your post with others. A new category name will automatically create a new sidebar entry.

### Related posts

The `related` field takes an array of slugs from other posts. These appear at the bottom of the blog post. Use `[]` if there are no related posts yet.

## Step 4: SEO Checklist

Before proceeding, verify your frontmatter meets SEO requirements:

- [ ] **Title** is under 60 characters and includes the primary keyword
- [ ] **Description** is 120-155 characters, primary keyword in first 60 chars
- [ ] **Slug** is 3-5 words, kebab-case, includes primary keyword
- [ ] **Tags** include 3-6 lowercase terms: primary keyword + category + long-tail variants
- [ ] **Related posts** link to topically relevant articles
- [ ] First paragraph mentions the primary keyword within the first 100 words
- [ ] Headings (h2/h3) are descriptive and searchable — avoid vague labels like "Overview"
- [ ] Each code block has a preceding sentence explaining what it demonstrates

The site automatically generates:
- Canonical URLs for all pages
- OpenGraph and Twitter Card meta tags (title, description, OG image)
- JSON-LD structured data (Article schema for posts, WebSite schema for home)
- Sitemap with all posts, categories, and tags
- robots.txt

## Step 5: Content Formatting Rules

- Use `##` (h2) for major sections — these appear in the Table of Contents sidebar
- Use `###` (h3) for subsections — these nest under their parent h2 in the TOC
- Do NOT use `#` (h1) — the page title comes from frontmatter
- Use fenced code blocks with language tags: ` ```tsx `, ` ```typescript `, ` ```bash `, etc.
- Keep paragraphs short (3-5 sentences)

## Step 6: Local Preview

```bash
npm run dev
```

Open `http://localhost:3000/` and navigate to your new post. Check:

- [ ] Post appears on the home page listing
- [ ] Category and tags are correct
- [ ] Table of Contents shows all h2/h3 headings
- [ ] TOC links scroll to the correct sections
- [ ] Code blocks render properly
- [ ] Related posts show at the bottom (if any)

## Step 7: Build and Verify

```bash
npm run build
```

This will:
- Generate OG images (social sharing cards) for all posts including yours
- Build the search index so your post is searchable
- Export static HTML

Check for any build errors. Common issues:
- Missing or malformed frontmatter fields
- Duplicate slugs across posts

## Step 8: Commit and Deploy

```bash
git add src/content/your-post-slug.md
git commit -m "post: add your-post-topic article"
git push origin main
```

GitHub Actions will automatically build and deploy to GitHub Pages on push to `main`.

## Quick Reference

| What | Where |
|------|-------|
| Blog posts | `src/content/*.md` |
| Prompt template | `blog-prompt.md` |
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Static output | `out/` |
| OG images | `public/og/*.png` (auto-generated) |
| Search index | `public/search-index.json` (auto-generated) |
