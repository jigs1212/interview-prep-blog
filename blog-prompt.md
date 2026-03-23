# Blog Post Generation Prompt

Copy the prompt below, replace all `{{PLACEHOLDER}}` values with your content, and paste into any AI content tool.

---

## Prompt

```
Write a technical blog post for a senior developer interview preparation site.

**Topic:** {{TOPIC_TITLE}}
**Category:** {{CATEGORY}} (e.g., React, Next.js, TypeScript, JavaScript, Node.js, System Design)
**Subcategory:** {{SUBCATEGORY}} (e.g., Hooks, App Router, Generics)
**Target audience:** Senior frontend/fullstack developers preparing for interviews

### Output format

The output must be a single markdown file with this exact frontmatter at the top:

---
slug: "{{SLUG}}"
title: "{{TOPIC_TITLE}}"
description: "{{META_DESCRIPTION_120_TO_155_CHARS_WITH_PRIMARY_KEYWORD}}"
category: "{{CATEGORY}}"
subcategory: "{{SUBCATEGORY}}"
tags: [{{COMMA_SEPARATED_TAGS}}]
date: "{{YYYY-MM-DD}}"
related: [{{RELATED_POST_SLUGS_OR_EMPTY}}]
---

### Content requirements

1. Start with an `## Introduction` section that explains what the topic is, why it matters for senior interviews, and sets context.
2. Use `##` (h2) for major sections and `###` (h3) for subsections — these become the Table of Contents.
3. Aim for 5-8 major sections covering the topic comprehensively.
4. Target 800-1500 words total.
5. Include code examples using fenced code blocks with language tags (```tsx, ```typescript, ```javascript, etc.).
6. Write in a direct, technical tone — no fluff. Assume the reader knows programming basics.
7. For each concept, explain:
   - What it is
   - Why it matters in interviews
   - Common pitfalls or misconceptions interviewers test
8. End with a section on best practices or advanced patterns.

### Key topics to cover

{{LIST_THE_SPECIFIC_TOPICS_AND_SUBTOPICS_YOU_WANT_COVERED}}

- Topic 1: {{SUBTOPIC_1}}
- Topic 2: {{SUBTOPIC_2}}
- Topic 3: {{SUBTOPIC_3}}
- Topic 4: {{SUBTOPIC_4}}
- Topic 5: {{SUBTOPIC_5}}

### Code snippets to include

If you have specific code examples you want in the post, provide them here. The AI should integrate them naturally into the relevant sections.

{{PASTE_YOUR_CODE_SNIPPETS_HERE_OR_REMOVE_THIS_SECTION}}

### Interview angle

Focus on these interview-relevant aspects:
- {{COMMON_INTERVIEW_QUESTION_1}}
- {{COMMON_INTERVIEW_QUESTION_2}}
- {{COMMON_INTERVIEW_QUESTION_3}}

### SEO requirements

Follow these rules to maximize search engine visibility:

1. **Title** (`title` field): Include the primary keyword naturally. Keep under 60 characters. Format: "Topic — Qualifier" (e.g., "React Hooks Deep Dive", "TypeScript Generics Masterclass").
2. **Description** (`description` field): Write a compelling 120-155 character meta description. Include the primary keyword in the first 60 characters. End with a call to action or value proposition.
3. **Slug** (`slug` field): Use the primary keyword in the slug. Keep it short — 3-5 words max, kebab-case (e.g., `react-hooks-deep-dive`).
4. **Headings for featured snippets**: Structure h2/h3 headings as questions or clear topic labels that search engines can extract (e.g., "### What Is the Rules of Hooks?" rather than "### Rules").
5. **First paragraph**: Include the primary keyword within the first 100 words. Clearly state what the reader will learn.
6. **Internal linking context**: Use the `related` field to link to other posts. Within the content body, reference related concepts by name to build topical authority (e.g., "as covered in the hooks deep dive" — the site will not auto-link, but this helps thematic coherence).
7. **Code block alt context**: Before each code block, include a sentence explaining what the code demonstrates. Search engines cannot index code blocks, so the surrounding text must convey the content.
8. **Tags**: Use 3-6 lowercase tags. Include the primary keyword, category-level term, and 1-2 long-tail variants (e.g., `["react", "hooks", "useState", "custom-hooks"]`).

### Constraints

- Do NOT use h1 (#) headings — only h2 (##) and h3 (###).
- Do NOT add a title at the top — the frontmatter `title` field handles that.
- Keep paragraphs concise (3-5 sentences max).
- Use inline code (`backticks`) for function names, variable names, and short code references.
- Use fenced code blocks for multi-line examples with the appropriate language tag.
- No emojis.
- No "In this article we will..." style intros. Get straight to the content.
```

---

## Example (filled in)

```
slug: "react-hooks-deep-dive"
title: "React Hooks Deep Dive"
description: "Complete guide to React hooks for senior interviews"
category: "React"
subcategory: "Hooks"
tags: ["react", "hooks", "useState", "useEffect"]
date: "2026-03-23"
related: ["useEffect-patterns", "custom-hooks-guide"]
```

**Topics:** useState, useEffect, useCallback, useMemo, useRef, custom hooks
**Interview angles:** batching behavior, stale closures, dependency arrays, when not to optimize
