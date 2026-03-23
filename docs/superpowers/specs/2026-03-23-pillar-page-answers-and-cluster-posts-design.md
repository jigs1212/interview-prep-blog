# Pillar Page Answers & Cluster Posts Design

**Date:** 2026-03-23
**Scope:** Add inline answers to the pillar page and create 4 new blog posts for uncovered topic sections.

## Current State

- Pillar page at `/senior-frontend-interview-questions/` has 64 questions across 8 topic sections, no answers.
- 4 existing blog posts cover React, TypeScript, Next.js, and Accessibility.
- 4 topic sections have no cluster articles: JavaScript, System Design, CSS, Performance.
- FAQ JSON-LD on pillar page uses generic placeholder answers.
- `blog-prompt.md` defines the content structure for new posts.
- Pillar page matches posts to topic sections via `topic.title.toLowerCase()` against `post.category.toLowerCase()`. This is fragile — topic titles like "JavaScript Fundamentals" do not match a post with `category: "JavaScript"`.

## Pillar Page Changes

### File: `src/app/senior-frontend-interview-questions/page.tsx`

#### Fix topic-to-post matching (Critical)

Replace the current `topic.title.toLowerCase()` matching with a `categoryMatch` field on each `TopicSection`:

```ts
interface TopicSection {
  title: string
  slug: string
  categoryMatch: string   // matches post.category (case-insensitive)
  description: string
  questions: PillarQuestion[]
}
```

Mapping:

| Topic title | `categoryMatch` | Existing post category |
|-------------|-----------------|----------------------|
| React | `react` | `React` |
| TypeScript | `typescript` | `TypeScript` |
| Next.js | `next.js` | `Next.js` |
| Web Accessibility (A11y) | `web fundamentals` | `Web Fundamentals` |
| JavaScript Fundamentals | `javascript` | `JavaScript` (new) |
| Frontend System Design | `system design` | `System Design` (new) |
| CSS and Layout | `css` | `CSS` (new) |
| Performance Optimization | `performance` | `Performance` (new) |

The matching logic changes from:
```ts
const catPosts = postsByCategory.get(topic.title.toLowerCase()) ?? []
```
to:
```ts
const catPosts = postsByCategory.get(topic.categoryMatch) ?? []
```

#### Update question type

Each question entry changes from a plain string to an object:

```ts
interface PillarQuestion {
  question: string
  answer: string
  code?: string       // optional small code snippet
  codeLang?: string   // language tag for the code block (default: 'tsx')
}
```

Each `TopicSection.questions` changes from `string[]` to `PillarQuestion[]`.

#### Types location

Define `PillarQuestion` and the updated `TopicSection` interface locally in `page.tsx` (not in `src/types/blog.ts`). These types are only used by the pillar page and are not shared across components or data functions. `src/types/blog.ts` is for types used across the data layer and components.

### Answer guidelines

- 2-3 sentences per answer. Direct, technical, no filler.
- Code snippets: 3-8 lines max. Only where the concept is clearer with code. Not every question needs one.
- Answers should complement, not duplicate, the blog post content. The pillar page gives the quick answer; the blog post explains the "why" and edge cases.

### Rendering changes

- Answers are always visible (no collapse/toggle). This keeps the page fully static with no client-side JavaScript needed. The length (~5000-6000 words) is intentional for SEO.
- Each question renders the answer text below it in `text-[var(--fg-muted)]` with `text-sm`.
- Code snippets render in a `<pre><code>` block styled with `bg-[var(--bg-secondary)]`, monospace font, rounded corners, small text, horizontal overflow scroll. No syntax highlighting (static export, no runtime highlighter).
- When `codeLang` is undefined, default to `'tsx'`. The `codeLang` value is set as a `className` on the `<code>` element (`language-${codeLang}`) for potential future syntax highlighting integration, but has no visual effect currently.
- The Q number + question text remain as-is (bold, accent-colored number).

### FAQ JSON-LD update

Replace the generic FAQ answers with the actual `answer` field from the `PillarQuestion` data. Use the first 3 questions per topic (24 total, unchanged count). Only the `answer` text is used in FAQ JSON-LD — code snippets are excluded (FAQ schema `text` field should be plain text).

### Estimated page size

~5000-6000 words. No layout changes — the existing `max-w-4xl` container handles the length.

## New Blog Posts

### 4 new markdown files in `src/content/`

| File | Slug | Category | Subcategory |
|------|------|----------|-------------|
| `javascript-interview-questions.md` | `javascript-interview-questions` | JavaScript | Fundamentals |
| `frontend-system-design-questions.md` | `frontend-system-design-questions` | System Design | Architecture |
| `css-layout-interview-questions.md` | `css-layout-interview-questions` | CSS | Layout |
| `web-performance-interview-questions.md` | `web-performance-interview-questions` | Performance | Optimization |

The `category` values above are chosen to match the `categoryMatch` field on the corresponding pillar page topic section (case-insensitive).

### Content structure (per post)

Each post follows `blog-prompt.md`:

1. **Introduction** — What the topic covers, why it matters for senior interviews, link to pillar page.
2. **Beginner concepts** — Foundational questions with answers and code.
3. **Intermediate patterns** — Applied usage, common patterns.
4. **Advanced techniques** — Deep internals, edge cases, performance.
5. **Scenario-based questions** — "How would you..." style questions.
6. **Rapid fire** — Short Q&A pairs.
7. **Frequently Asked Questions** — 3-5 questions as h3 headings ending with `?` (for FAQ JSON-LD extraction).

### Post specifications

- **Word count:** 1500-2500 words each.
- **Code examples:** Fenced code blocks with language tags. Each preceded by explanatory text.
- **Tags:** 4-6 lowercase tags per post, including category name and long-tail variants.
- **Related posts:** 2-3 slugs from existing posts.
- **Date:** `2026-03-23`.

### Post content outline

**JavaScript Interview Questions (`javascript-interview-questions`)**
- Tags: `["javascript", "event-loop", "closures", "promises", "prototypes", "interview-questions"]`
- Related: `["react-hooks-deep-dive"]`
- Topics: event loop (microtasks/macrotasks), closures and memory leaks, prototypal inheritance, Promise patterns (all/allSettled/race), generators/iterators, WeakMap/WeakSet, ESM vs CJS, structured cloning

**Frontend System Design Questions (`frontend-system-design-questions`)**
- Tags: `["system-design", "architecture", "component-library", "micro-frontends", "state-management", "interview-questions"]`
- Related: `["nextjs-app-router-guide", "react-hooks-deep-dive"]`
- Topics: design system/component library, real-time collaborative editing, infinite scroll with optimistic updates, micro-frontend architecture, client-side caching/offline, search autocomplete, feature flags, error tracking

**CSS & Layout Interview Questions (`css-layout-interview-questions`)**
- Tags: `["css", "flexbox", "css-grid", "responsive-design", "layout", "interview-questions"]`
- Related: `["web-accessibility-deep-dive"]`
- Topics: Flexbox vs Grid, cascade/specificity, custom properties, responsive design systems, CSS containment, CSS layers, CSS-in-JS vs utility-first, component library CSS

**Web Performance Interview Questions (`web-performance-interview-questions`)**
- Tags: `["performance", "core-web-vitals", "code-splitting", "lazy-loading", "optimization", "interview-questions"]`
- Related: `["nextjs-app-router-guide", "react-hooks-deep-dive"]`
- Topics: Core Web Vitals (LCP/CLS/INP), code splitting, tree shaking, layout shifts, critical rendering path, virtualization, SSR vs SSG vs CSR tradeoffs, Performance API/DevTools

## Existing Posts

Update the `related` field on existing posts to cross-link with new posts where topically relevant:

| Existing post | Add to `related` |
|---------------|-----------------|
| `react-hooks-deep-dive` | `"javascript-interview-questions"` |
| `nextjs-app-router-guide` | `"web-performance-interview-questions"` |
| `web-accessibility-deep-dive` | `"css-layout-interview-questions"` |
| `typescript-generics-masterclass` | (no change — no strong topical overlap with new posts) |

## Verification

After implementation, run `npm run build` and verify:
- All 8 blog post routes generate (4 existing + 4 new)
- Pillar page route generates
- New category and tag pages generate
- OG images generated for 4 new posts
- Search index includes 8 posts
- No build errors

## Files Changed

| File | Change |
|------|--------|
| `src/app/senior-frontend-interview-questions/page.tsx` | Add `categoryMatch` to topics, change questions from strings to `PillarQuestion` objects with answers + code, update rendering, update FAQ JSON-LD to use real answers |
| `src/content/javascript-interview-questions.md` | New blog post |
| `src/content/frontend-system-design-questions.md` | New blog post |
| `src/content/css-layout-interview-questions.md` | New blog post |
| `src/content/web-performance-interview-questions.md` | New blog post |
| `src/content/react-hooks-deep-dive.md` | Update `related` field |
| `src/content/nextjs-app-router-guide.md` | Update `related` field |
| `src/content/web-accessibility-deep-dive.md` | Update `related` field |

## No changes needed

- Sitemap: pillar page already included. New blog posts auto-included via `getAllPosts()`.
- OG images: auto-generated by prebuild script for new posts.
- Search index: auto-generated by prebuild script.
- Internal linking: `PillarPageLink` component already renders on all blog posts.
- Lead magnet: already renders on all blog posts and pillar page.
