# Phase 4 — Deployment & CI/CD

Paste these prompts into Claude Code in order (4.1 → 4.2).

---

## 4.1 — GitHub Actions Workflows

```
Create .github/workflows/deploy.yml:

name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: https://${{ github.repository_owner }}.github.io/interview-prep-blog
          NEXT_PUBLIC_SITE_NAME: Interview Prep Hub
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4

Important git rules for this workflow:
- Do NOT add any "Co-authored-by" or AI attribution lines
- Commit author must be "GitHub Actions <actions@github.com>"
- No Claude or AI mentions in any step names or commit messages

---

Create .github/workflows/pr-check.yml:

name: PR Build Check

on:
  pull_request:
    branches: [main]

jobs:
  build-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: https://example.github.io/interview-prep-blog
          NEXT_PUBLIC_SITE_NAME: Interview Prep Hub
```

---

## 4.2 — Final Config, README, Bundle Analyzer

```
1. Add bundle analyzer to next.config.ts:
   npm install --save-dev @next/bundle-analyzer
   Wrap config: const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })
   Add script: "analyze": "ANALYZE=true npm run build"

2. Create .nvmrc with content: 20

3. Create .gitignore additions (append to existing):
   .env.local
   .env.*.local
   out/
   .next/
   node_modules/
   public/og/*.png
   public/search-index.json

4. Create README.md with these sections:
   - Project title + description
   - Tech stack badges
   - Local dev setup:
       git clone ...
       cp .env.example .env.local
       npm install
       npm run dev
   - How to add a new blog post (full frontmatter schema example)
   - Build & deploy instructions
   - Folder structure (ASCII tree)
   - MCP servers section (list the 5 recommended ones)

5. Add .prettierrc:
   {
     "useTabs": true,
     "singleQuote": true,
     "semi": false,
     "tabWidth": 2,
     "printWidth": 100,
     "trailingComma": "es5"
   }

6. Add tsconfig.json path aliases check — ensure @/* maps to ./src/*

7. Final smoke test prompt (run after all phases):
   Run npm run build and verify:
   - /out/index.html exists
   - /out/blog/[slug]/index.html exists for all 3 sample posts
   - /out/search-index.json exists
   - No TypeScript errors
   - No missing generateStaticParams warnings
```
