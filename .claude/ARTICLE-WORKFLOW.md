# Article Workflow — Draft to LinkedIn

Use these prompts in Claude.ai (not Claude Code) every time you write a new article.

---

## Step 1 — Topic & Outline

Paste into Claude.ai:

```
I'm writing an interview prep article for senior frontend engineers on:
[TOPIC — e.g. "React Server Components vs Client Components"]

Target reader: Senior dev preparing for architect-level interviews
Audience context: Indian tech market, Tesco / Persistent / product companies

Give me:
1. A compelling SEO title (under 60 chars)
2. Meta description (under 155 chars)
3. Article outline with H2 and H3 headings
4. 5 relevant tags
5. Category suggestion from: React / Next.js / TypeScript / System Design / JavaScript / Performance
6. 3 related article slugs I should create next
7. Suggested slug for this article (kebab-case)

Format the output as frontmatter-ready YAML followed by the outline.
```

---

## Step 2 — Draft Full Article

Paste into Claude.ai:

```
Write a complete, in-depth blog article using this outline:

[PASTE OUTLINE FROM STEP 1]

Requirements:
- 1500-2500 words
- Written for senior developers, not beginners
- Include code examples in TypeScript/React for each concept
- Each code block must be complete and copy-pasteable
- Add "Interview Tip:" callout boxes (use blockquote syntax > **Interview Tip:** ...)
- Include a "Common Mistakes" H2 section
- End with a "What to Say in an Interview" section (3-5 bullet points)
- Tone: confident, direct, peer-to-peer (not tutorial-ish)
- No filler phrases like "In conclusion" or "As we can see"

Output the full article in clean Markdown with the YAML frontmatter at the top.
```

---

## Step 3 — Quality Check

Paste into Claude.ai:

```
Review this article for an interview prep blog targeting senior frontend engineers:

[PASTE ARTICLE]

Check for:
1. Technical accuracy — flag any incorrect code or outdated APIs (Next.js 14, React 18)
2. SEO: is the primary keyword in H1, first paragraph, and at least 2 H2s?
3. Internal linking opportunities: suggest 2-3 slugs I should link to
4. Missing content: what would a senior interviewer ask that this doesn't cover?
5. Code completeness: are all examples self-contained and correct?
6. Sections that are too thin (< 150 words) or too dense (> 600 words without break)

Return:
- A structured review (pass/fail per check)
- Improved versions of flagged sections only (not the full article again)
```

---

## Step 4 — Publish to GitHub

Steps to follow manually:

1. Save the article as `src/content/[slug].md`
2. Run `npm run dev` and visit `/blog/[slug]` locally
3. Verify: TOC renders, code blocks highlight, related posts show
4. Run `npm run build` — confirm no errors
5. Commit with a clean message (see git rules below)
6. Push to main — GitHub Actions deploys automatically
7. Verify live at: `https://[username].github.io/interview-prep-blog/blog/[slug]`

**Git commit template:**
```
git add src/content/[slug].md
git commit -m "post: add [topic-slug] article

- Add [slug].md with frontmatter
- Category: [category], Tags: [tag1, tag2, tag3]
- ~[word-count] words, [N] code examples"
git push origin main
```

---

## Step 5 — LinkedIn Post

Paste into Claude.ai:

```
Write a LinkedIn post to promote this article:

Article title: [TITLE]
Article URL: [URL]
Key takeaway: [1-line summary of what the reader will learn]
Target audience: Senior frontend engineers, hiring managers, tech leads

LinkedIn post requirements:
- Hook in line 1 that does NOT start with "I wrote an article" or "Excited to share"
- Open with a question, a surprising fact, or a bold statement
- 3-5 short paragraphs, punchy sentences (max 2 lines each)
- Include 1 code snippet or interview question as a teaser (use triple backticks)
- End with an open question to drive comments
- 5 relevant hashtags at the end (#reactjs #nextjs #frontend #javascript #webdev)
- Tone: confident, not salesy, no corporate buzzwords

Format: ready to paste directly into LinkedIn.
```

---

## Git Rules Reminder

NEVER include these in any commit message:
- Co-authored-by: Claude
- Generated-by: AI
- 🤖 or any bot references

Commit message format:
```
type: short description (max 72 chars)

- Optional bullet detail
- Another detail
```

Types: `feat` `fix` `post` `refactor` `style` `chore` `docs`
