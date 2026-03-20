# Interview Prep Blog — Claude Code Prompts Playbook

Drop this folder into your repo root. Everything you need to build and run the blog is here.

---

## Folder Structure

```
prompts/
  CLAUDE.md                  ← Copy to project ROOT (not this folder)
  ARTICLE-WORKFLOW.md        ← Use in Claude.ai for every new article
  MCP-SETUP.md               ← Run once to connect MCP servers
  phase-0/
    PHASE-0-SETUP.md         ← Project init + scaffolding
  phase-1/
    PHASE-1-DATA-LAYER.md    ← lib/ functions (posts, TOC, search)
  phase-2/
    PHASE-2-COMPONENTS.md    ← All React components
  phase-3/
    PHASE-3-PAGES.md         ← Next.js pages + SEO
  phase-4/
    PHASE-4-DEPLOY.md        ← GitHub Actions + final config
```

---

## How to Use

### Step 1 — Copy CLAUDE.md to project root
```bash
cp prompts/CLAUDE.md ./CLAUDE.md
```
This file controls Claude Code's behavior for the entire project.

### Step 2 — Set up MCP servers (once)
Read `MCP-SETUP.md` and run the install commands.

### Step 3 — Start a Claude Code session
Open Claude Code in your project folder and say:
```
Read CLAUDE.md, then start with Phase 0 from prompts/phase-0/PHASE-0-SETUP.md
```

### Step 4 — Work through phases in order
- Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4
- Test locally between each phase with `npm run dev`
- Run `npm run build` before moving to next phase

### Step 5 — Publish articles
Follow `ARTICLE-WORKFLOW.md` for every new post.

---

## Git Rules (Critical)

**Never** include in any commit:
- `Co-authored-by: Claude`
- `Generated-by: AI`
- Any AI or bot references

Commit format: `type: description`

Types: `feat` `fix` `post` `refactor` `style` `chore` `docs`

---

## Quick Reference — Commit Examples

```bash
# New feature
git commit -m "feat: add TOC scroll highlighting"

# New post
git commit -m "post: add react-hooks-deep-dive article"

# Bug fix
git commit -m "fix: resolve sidebar overflow on mobile"
```

---

## Environment Variables

Copy `.env.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SITE_URL=https://[username].github.io/interview-prep-blog
NEXT_PUBLIC_SITE_NAME=Interview Prep Hub
```
