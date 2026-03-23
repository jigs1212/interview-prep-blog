Act as a Senior SEO Engineer + Senior Next.js Architect.

I have a static blog built using Next.js (App Router) and hosted on GitHub Pages. The blog focuses on frontend interview preparation (React, TypeScript, Next.js, Accessibility).

Your task is to transform the project into a highly SEO-optimized, scalable content platform that can rank on Google for competitive keywords.

---

## 🎯 Goals

* Increase organic traffic
* Improve SEO score (90+ Lighthouse)
* Build strong internal linking & topical authority
* Target both primary and long-tail keywords

---

## 🧱 Implement the Following Features

### 1. Pillar + Cluster Architecture

* Create a pillar page:
  `/senior-frontend-interview-questions`
* This page should:

  * Be 2000+ words
  * Cover React, TypeScript, Next.js, Accessibility
  * Link to all related articles (cluster pages)
* Ensure all existing articles link back to this pillar page

---

### 2. SEO-Optimized Blog Structure

* Standardize all blog pages with:

  * H1, H2, H3 hierarchy
  * Sections:

    * Beginner
    * Intermediate
    * Advanced
    * Scenario-based questions
    * Rapid fire
* Add keyword-rich headings
* Ensure readability and spacing

---

### 3. Dynamic SEO Metadata

* Use Next.js App Router metadata API
* Each page must include:

  * title (≤ 60 chars)
  * meta description (≤ 160 chars)
  * keywords
* Add OpenGraph + Twitter meta tags

---

### 4. Structured Data (JSON-LD)

* Implement FAQ schema on blog pages
* Extract questions/answers dynamically if possible
* Inject into `<head>` properly

---

### 5. Internal Linking Engine

* Automatically:

  * Link each article to 2–3 related posts
  * Link to 1 pillar page
* Add "Related Articles" section
* Use keyword-rich anchor text

---

### 6. Long-Tail Keyword Pages

Generate new pages targeting:

* "react interview questions for 5 years experience"
* "typescript tricky interview questions"
* "nextjs interview questions for senior developers"
* "frontend system design interview questions"

Each page:

* 1500–2500 words
* Real-world scenarios
* Code examples
* SEO optimized

---

### 7. Sitemap + Robots.txt

* Generate `/sitemap.xml` dynamically or at build time
* Include all pages
* Create `/robots.txt`
* Ensure GitHub Pages compatibility

---

### 8. Performance Optimization

* Ensure all pages use static generation (SSG)
* Optimize images (next/image)
* Lazy load components where needed
* Minimize JS bundle
* Target Core Web Vitals (LCP, CLS, INP)

---

### 9. Reusable Blog Template

* Create a reusable MDX/JSX blog layout component
* Include:

  * Table of contents
  * FAQ section
  * Internal links
  * Clean UI for readability

---

### 10. Lead Magnet Component

* Build a reusable email capture UI:

  * "Download 100 Frontend Interview Questions PDF"
* Store emails (mock/local for now)

---

### 11. Related Posts System

* Build logic based on tags/keywords
* Show 3 related posts per article
* Exclude current post

---

## 🧪 Output Requirements

* Provide clean, production-ready Next.js code
* Follow best practices (modular, reusable components)
* Keep everything compatible with static export (important for GitHub Pages)
* Clearly mention where each feature should be integrated

---

## ⚠️ Constraints

* No server-side dependencies (must work as static site)
* Keep bundle size optimized
* Maintain clean developer-friendly code

---

## 💡 Bonus (if possible)

* Suggest internal linking improvements for existing content
* Suggest missing high-traffic blog topics
* Add canonical tags for SEO

---

Now analyze the project structure and implement all improvements step by step with explanations.
