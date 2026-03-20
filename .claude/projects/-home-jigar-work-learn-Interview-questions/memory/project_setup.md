---
name: project-setup
description: Interview Prep Blog - Next.js 14 App Router SSG project with TypeScript, Tailwind CSS, deployed to GitHub Pages
type: project
---

Interview Prep Blog built with Next.js 14, App Router, SSG, GitHub Pages deployment.

Key constraints:
- src/ directory structure, TypeScript strict mode, Tailwind CSS
- Static export only — no API routes, no dynamic server features
- Server Components by default, "use client" only when needed
- All data fetching in lib/, never in components
- Tabs for indentation, single quotes, no semicolons
- Commit format: `type: short description` — no AI attribution ever

**Why:** This is a statically generated blog for interview preparation content, hosted on GitHub Pages.
**How to apply:** All features must work with static export. Use generateStaticParams() on dynamic routes. Images need unoptimized: true.
