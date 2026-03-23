# Pillar Page Answers & Cluster Posts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add inline answers to the pillar page's 64 questions and create 4 new blog posts for uncovered topic sections (JavaScript, System Design, CSS, Performance).

**Architecture:** The pillar page (`page.tsx`) gets its question data structure upgraded from strings to objects with answers + optional code. Four new markdown blog posts are created following the existing content pattern. Existing posts get cross-linked via the `related` frontmatter field.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Markdown with gray-matter frontmatter, static export.

**Spec:** `docs/superpowers/specs/2026-03-23-pillar-page-answers-and-cluster-posts-design.md`

---

## Task Overview

Tasks 1-4 are independent blog posts (can run in parallel).
Task 5 is the pillar page rewrite (can run in parallel with 1-4).
Task 6 updates existing post related fields (can run in parallel with 1-5).
Task 7 is the final build verification (depends on all previous tasks).

---

### Task 1: Create JavaScript Interview Questions blog post

**Files:**
- Create: `src/content/javascript-interview-questions.md`

**Parallelizable:** Yes — independent of all other tasks.

- [ ] **Step 1: Create the blog post file**

Create `src/content/javascript-interview-questions.md` with this frontmatter and content structure:

```yaml
---
slug: "javascript-interview-questions"
title: "JavaScript Interview Questions for Senior Developers"
description: "Master JavaScript fundamentals for senior interviews — event loop, closures, prototypes, promises, and advanced patterns with code examples."
category: "JavaScript"
subcategory: "Fundamentals"
tags: ["javascript", "event-loop", "closures", "promises", "prototypes", "interview-questions"]
date: "2026-03-23"
related: ["react-hooks-deep-dive"]
---
```

Content must follow this structure (1500-2500 words total):
1. `## Introduction` — JavaScript fundamentals matter for senior interviews. Link to pillar page: "For a complete overview of senior frontend interview topics, see our [Senior Frontend Interview Questions guide](/senior-frontend-interview-questions/)."
2. `## Beginner Concepts` — Cover: event loop basics, closure definition, `var` vs `let` vs `const`
3. `## Intermediate Patterns` — Cover: Promise patterns (all/allSettled/race), prototype chain, `this` binding, ESM vs CJS
4. `## Advanced Techniques` — Cover: microtasks vs macrotasks execution order, generators/iterators, WeakMap/WeakSet use cases, structured cloning vs JSON
5. `## Scenario-Based Questions` — "How would you..." style: debugging async issues, memory leak from closures, module bundling
6. `## Rapid Fire` — 5-8 short Q&A pairs
7. `## Frequently Asked Questions` — 3-5 h3 headings ending with `?` (e.g., `### What is the difference between microtasks and macrotasks?`)

Each section must include fenced code blocks with language tags (`javascript` or `typescript`). Each code block must be preceded by a sentence explaining what it demonstrates.

- [ ] **Step 2: Verify the file parses correctly**

Run: `npx tsx -e "const {getAllPosts} = require('./src/lib/posts'); console.log(getAllPosts().find(p => p.slug === 'javascript-interview-questions')?.title)"`

If that doesn't work due to ESM, just verify the frontmatter is valid YAML by checking the file has proper `---` delimiters and all required fields.

---

### Task 2: Create Frontend System Design blog post

**Files:**
- Create: `src/content/frontend-system-design-questions.md`

**Parallelizable:** Yes — independent of all other tasks.

- [ ] **Step 1: Create the blog post file**

Create `src/content/frontend-system-design-questions.md` with this frontmatter:

```yaml
---
slug: "frontend-system-design-questions"
title: "Frontend System Design Interview Questions"
description: "Senior frontend system design interview prep — component libraries, real-time features, micro-frontends, and scalable architecture patterns."
category: "System Design"
subcategory: "Architecture"
tags: ["system-design", "architecture", "component-library", "micro-frontends", "state-management", "interview-questions"]
date: "2026-03-23"
related: ["nextjs-app-router-guide", "react-hooks-deep-dive"]
---
```

Content structure (1500-2500 words):
1. `## Introduction` — Why system design rounds exist for frontend. Link to pillar page.
2. `## Beginner Concepts` — Component architecture basics, data flow patterns, API contract design
3. `## Intermediate Patterns` — Design system/component library, search autocomplete, feature flags architecture
4. `## Advanced Techniques` — Real-time collaborative editing (CRDTs/OT), micro-frontend architecture, client-side caching + offline support (Service Workers)
5. `## Scenario-Based Questions` — "Design an infinite scroll feed with optimistic updates", "Design an error tracking system for the frontend"
6. `## Rapid Fire` — 5-8 short Q&A pairs
7. `## Frequently Asked Questions` — 3-5 h3 headings ending with `?`

Focus on architecture diagrams described in text (data flow, component hierarchy) since this is a markdown post. Code examples should show interfaces, type definitions, and pseudocode patterns rather than full implementations.

---

### Task 3: Create CSS & Layout blog post

**Files:**
- Create: `src/content/css-layout-interview-questions.md`

**Parallelizable:** Yes — independent of all other tasks.

- [ ] **Step 1: Create the blog post file**

Create `src/content/css-layout-interview-questions.md` with this frontmatter:

```yaml
---
slug: "css-layout-interview-questions"
title: "CSS & Layout Interview Questions for Senior Developers"
description: "CSS interview prep for senior developers — Flexbox, Grid, specificity, custom properties, responsive design, and CSS architecture patterns."
category: "CSS"
subcategory: "Layout"
tags: ["css", "flexbox", "css-grid", "responsive-design", "layout", "interview-questions"]
date: "2026-03-23"
related: ["web-accessibility-deep-dive"]
---
```

Content structure (1500-2500 words):
1. `## Introduction` — CSS knowledge differentiates frontend specialists. Link to pillar page.
2. `## Beginner Concepts` — Box model, Flexbox basics, cascade and specificity rules
3. `## Intermediate Patterns` — CSS Grid layouts, custom properties vs preprocessor variables, responsive design systems, `@media` queries
4. `## Advanced Techniques` — CSS containment (`contain`), CSS layers (`@layer`), CSS-in-JS vs utility-first tradeoffs, component library CSS strategies
5. `## Scenario-Based Questions` — "How would you implement a responsive dashboard layout?", "How would you handle CSS for a shared component library?"
6. `## Rapid Fire` — 5-8 short Q&A pairs
7. `## Frequently Asked Questions` — 3-5 h3 headings ending with `?`

Code examples should use `css` language tag. Include visual layout examples described with CSS code.

---

### Task 4: Create Web Performance blog post

**Files:**
- Create: `src/content/web-performance-interview-questions.md`

**Parallelizable:** Yes — independent of all other tasks.

- [ ] **Step 1: Create the blog post file**

Create `src/content/web-performance-interview-questions.md` with this frontmatter:

```yaml
---
slug: "web-performance-interview-questions"
title: "Web Performance Interview Questions for Senior Developers"
description: "Senior web performance interview prep — Core Web Vitals, code splitting, tree shaking, rendering optimization, and profiling techniques."
category: "Performance"
subcategory: "Optimization"
tags: ["performance", "core-web-vitals", "code-splitting", "lazy-loading", "optimization", "interview-questions"]
date: "2026-03-23"
related: ["nextjs-app-router-guide", "react-hooks-deep-dive"]
---
```

Content structure (1500-2500 words):
1. `## Introduction` — Performance is a senior responsibility. Link to pillar page.
2. `## Beginner Concepts` — Core Web Vitals definitions (LCP, CLS, INP), critical rendering path, image optimization basics
3. `## Intermediate Patterns` — Code splitting (dynamic imports, React.lazy), tree shaking, resource hints (preload/prefetch), layout shift prevention
4. `## Advanced Techniques` — Virtualization for large lists, SSR vs SSG vs CSR tradeoffs, Performance Observer API, Chrome DevTools profiling workflow
5. `## Scenario-Based Questions` — "How would you diagnose a slow LCP?", "How would you implement virtualization for a 10,000-row table?"
6. `## Rapid Fire` — 5-8 short Q&A pairs
7. `## Frequently Asked Questions` — 3-5 h3 headings ending with `?`

Code examples in `tsx`, `javascript`, and `html`. Include Performance API usage examples.

---

### Task 5: Update pillar page with answers, code, and fixed matching

**Files:**
- Modify: `src/app/senior-frontend-interview-questions/page.tsx`

**Parallelizable:** Yes — independent of blog post creation tasks.

- [ ] **Step 1: Rewrite the pillar page**

Rewrite `src/app/senior-frontend-interview-questions/page.tsx` with these changes:

**Types (local to file):**
```ts
interface PillarQuestion {
	question: string
	answer: string
	code?: string
	codeLang?: string
}

interface TopicSection {
	title: string
	slug: string
	categoryMatch: string
	description: string
	questions: PillarQuestion[]
}
```

**Topic data:** Update each of the 8 topic sections. Add `categoryMatch` field:
- React: `categoryMatch: 'react'`
- TypeScript: `categoryMatch: 'typescript'`
- Next.js: `categoryMatch: 'next.js'`
- Web Accessibility (A11y): `categoryMatch: 'web fundamentals'`
- JavaScript Fundamentals: `categoryMatch: 'javascript'`
- Frontend System Design: `categoryMatch: 'system design'`
- CSS and Layout: `categoryMatch: 'css'`
- Performance Optimization: `categoryMatch: 'performance'`

Convert each question from a string to a `PillarQuestion` object. Each answer should be 2-3 sentences, direct and technical. Add `code` field (3-8 lines) where the concept is clearer with code — not every question needs code. Use `codeLang` only when not `tsx` (default).

**Matching logic change** (line ~245):
```ts
// Old:
const catPosts = postsByCategory.get(topic.title.toLowerCase()) ?? []
// New:
const catPosts = postsByCategory.get(topic.categoryMatch) ?? []
```

**Question rendering change** (replaces lines ~252-258):
```tsx
<div className="space-y-4 mb-6">
	{topic.questions.map((q, i) => (
		<div key={i} className="p-4 rounded-lg border border-[var(--border)]">
			<div className="flex gap-3 mb-2">
				<span className="text-[var(--accent)] font-semibold shrink-0">Q{i + 1}.</span>
				<span className="font-medium">{q.question}</span>
			</div>
			<p className="text-sm text-[var(--fg-muted)] ml-10">{q.answer}</p>
			{q.code && (
				<pre className="mt-2 ml-10 p-3 rounded bg-[var(--bg-secondary)] overflow-x-auto">
					<code className={`text-xs language-${q.codeLang ?? 'tsx'}`}>{q.code}</code>
				</pre>
			)}
		</div>
	))}
</div>
```

**FAQ JSON-LD update** (replaces lines ~177-190):
```ts
const faqJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: topics.flatMap(topic =>
		topic.questions.slice(0, 3).map(q => ({
			'@type': 'Question',
			name: q.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: q.answer,
			},
		}))
	),
}
```

Keep all other sections unchanged (metadata, header, navigation, "How to Use", LeadMagnet, "All Articles").

**Answer content guidelines (roughly 4-5 questions per topic section should include a code snippet):**
- React answers: focus on hooks behavior, rendering, reconciliation
- TypeScript answers: focus on type system mechanics, generics, narrowing
- Next.js answers: focus on App Router, server/client components, caching
- Accessibility answers: focus on WCAG, ARIA rules, keyboard patterns
- JavaScript answers: focus on event loop, closures, prototypes, promises
- System Design answers: focus on architecture patterns, tradeoffs
- CSS answers: focus on layout mechanisms, specificity, modern features
- Performance answers: focus on Core Web Vitals, optimization techniques

---

### Task 6: Update existing posts' related fields

**Files:**
- Modify: `src/content/react-hooks-deep-dive.md` (line 9, `related` field)
- Modify: `src/content/nextjs-app-router-guide.md` (line 9, `related` field)
- Modify: `src/content/web-accessibility-deep-dive.md` (line 9, `related` field)

**Parallelizable:** Yes — independent of all other tasks.

- [ ] **Step 1: Update react-hooks-deep-dive.md**

Change the `related` field from:
```yaml
related: ["useEffect-patterns", "custom-hooks-guide"]
```
to:
```yaml
related: ["javascript-interview-questions", "typescript-generics-masterclass"]
```

(Replace non-existent slugs with actual posts)

- [ ] **Step 2: Update nextjs-app-router-guide.md**

Change the `related` field from:
```yaml
related: ["react-hooks-deep-dive", "typescript-generics-masterclass"]
```
to:
```yaml
related: ["react-hooks-deep-dive", "typescript-generics-masterclass", "web-performance-interview-questions"]
```

- [ ] **Step 3: Update web-accessibility-deep-dive.md**

Change the `related` field from:
```yaml
related: []
```
to:
```yaml
related: ["css-layout-interview-questions"]
```

---

### Task 7: Build verification

**Files:** None (verification only)

**Depends on:** Tasks 1-6 all complete.

- [ ] **Step 1: Run full build**

Run: `npm run build`

Expected: Build succeeds with no errors. Output should show:
- 8 blog post routes under `/blog/[slug]`
- New category pages: `/category/javascript`, `/category/system-design`, `/category/css`, `/category/performance`
- New tag pages for all new tags
- Pillar page route: `/senior-frontend-interview-questions`
- OG images generated for 4 new posts

- [ ] **Step 2: Verify search index includes all 8 posts**

Run: `grep -c '"slug"' public/search-index.json`

Expected: 8

- [ ] **Step 3: Verify pillar page answers render**

Run: `grep -c 'Q1\.' out/senior-frontend-interview-questions/index.html`

Expected: 8 (one Q1 per topic section)

- [ ] **Step 4: Verify categoryMatch links posts to topics**

Run: `grep -c 'Deep-Dive Articles' out/senior-frontend-interview-questions/index.html`

Expected: 8 (every topic section should now have at least one linked article)

- [ ] **Step 5: Verify FAQ JSON-LD on pillar page**

Run: `grep -o '"@type":"Question"' out/senior-frontend-interview-questions/index.html | wc -l`

Expected: 24 (3 per topic x 8 topics)

- [ ] **Step 6: Verify FAQ extraction on all 4 new posts**

Run: `for slug in javascript-interview-questions frontend-system-design-questions css-layout-interview-questions web-performance-interview-questions; do echo "$slug: $(grep -c 'FAQPage' out/blog/$slug/index.html)"; done`

Expected: Each shows `1` (FAQ JSON-LD present because posts have h3 headings ending with `?`)

- [ ] **Step 7: Verify word count on new posts**

Run: `wc -w src/content/javascript-interview-questions.md src/content/frontend-system-design-questions.md src/content/css-layout-interview-questions.md src/content/web-performance-interview-questions.md`

Expected: Each file between 1500-2500 words.

- [ ] **Step 8: Commit all changes**

```bash
git add src/content/javascript-interview-questions.md src/content/frontend-system-design-questions.md src/content/css-layout-interview-questions.md src/content/web-performance-interview-questions.md src/app/senior-frontend-interview-questions/page.tsx src/content/react-hooks-deep-dive.md src/content/nextjs-app-router-guide.md src/content/web-accessibility-deep-dive.md public/search-index.json public/og/
git commit -m "feat: add pillar page answers and 4 new cluster blog posts"
```
