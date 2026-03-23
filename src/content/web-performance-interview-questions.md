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

## Introduction

Web performance is a senior-level responsibility, not just a nice-to-have. Users abandon pages that take longer than three seconds to load, and search engines penalize slow sites in rankings. As a senior developer, you are expected to identify bottlenecks, implement optimizations, and establish performance budgets that the team follows.

Interview panels at the senior level go beyond asking "what is lazy loading?" They test whether you can diagnose a slow page from a waterfall chart, choose the right rendering strategy for a given use case, and explain the tradeoffs behind your decisions. This guide covers the full spectrum of performance topics you should be prepared to discuss.

For a complete overview of senior frontend interview topics, see our [Senior Frontend Interview Questions guide](/senior-frontend-interview-questions/).

## Beginner Concepts

### Core Web Vitals

Google defines three Core Web Vitals that directly impact user experience and search ranking. Every senior developer should know these metrics cold.

**LCP (Largest Contentful Paint)** measures how long it takes for the largest visible element — typically a hero image or heading — to render. A good LCP is under 2.5 seconds. **CLS (Cumulative Layout Shift)** quantifies how much the page layout shifts unexpectedly during loading. A good CLS score is under 0.1. **INP (Interaction to Next Paint)** replaced FID in 2024 and measures the latency of all user interactions throughout the page lifecycle, not just the first one. A good INP is under 200 milliseconds.

You can check Core Web Vitals programmatically using the `web-vitals` library:

```javascript
import { onLCP, onCLS, onINP } from 'web-vitals'

onLCP(metric => console.log('LCP:', metric.value))
onCLS(metric => console.log('CLS:', metric.value))
onINP(metric => console.log('INP:', metric.value))
```

### Critical Rendering Path

The critical rendering path is the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels on screen. Understanding this pipeline is essential for diagnosing render-blocking issues.

The browser first parses HTML into the DOM tree. It then parses CSS into the CSSOM. These two trees are combined into the render tree, which contains only visible nodes with their computed styles. The browser then performs layout (calculating the geometry of each node) followed by paint (filling in pixels). Any resource that blocks DOM or CSSOM construction delays the entire pipeline.

### Image Optimization Basics

Images are typically the heaviest assets on a page. Modern formats like WebP and AVIF offer significantly better compression than JPEG and PNG. Always serve the smallest format the browser supports.

The `loading="lazy"` attribute defers offscreen images until the user scrolls near them. The `srcset` attribute lets the browser choose the right image size for the viewport, avoiding unnecessarily large downloads on mobile devices.

This example demonstrates responsive images with lazy loading and multiple size options:

```html
<img
  src="/images/hero-800.webp"
  srcset="/images/hero-400.webp 400w,
         /images/hero-800.webp 800w,
         /images/hero-1200.webp 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  loading="lazy"
  alt="Hero banner"
  width="1200"
  height="600"
/>
```

## Intermediate Patterns

### Code Splitting with Dynamic Imports

Code splitting breaks your JavaScript bundle into smaller chunks that load on demand. This reduces the initial payload and improves time to interactive. In React, you achieve this with `React.lazy` and `Suspense`.

This example shows how to lazily load a heavy component only when it is needed:

```tsx
import { lazy, Suspense } from 'react'

const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <HeavyChart />
    </Suspense>
  )
}
```

Route-level code splitting is the most impactful place to start. Next.js does this automatically for each page. For component-level splitting, target components that are below the fold, behind user interactions (modals, tabs), or conditionally rendered.

### Tree Shaking

Tree shaking is a dead-code elimination technique that removes unused exports from your final bundle. It relies on ES module static analysis — the bundler can determine at build time which exports are never imported.

Tree shaking breaks when modules have side effects. If a module executes code at the top level (modifying globals, polyfilling APIs), the bundler cannot safely remove it. The `sideEffects` field in `package.json` tells bundlers which files are safe to tree shake.

This configuration marks all files as side-effect-free except CSS imports:

```json
{
  "sideEffects": ["*.css"]
}
```

Barrel files (index.ts re-exporting everything) can also defeat tree shaking in some bundlers. Prefer direct imports when bundle size matters.

### Resource Hints

Resource hints tell the browser to fetch or prepare resources before they are needed. Using the right hint in the right situation can shave hundreds of milliseconds off load times.

This example demonstrates the three most common resource hints:

```html
<!-- Preload: fetch critical resources for the current page immediately -->
<link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin />

<!-- Prefetch: fetch resources likely needed for the next navigation -->
<link rel="prefetch" href="/dashboard/data.json" />

<!-- Preconnect: establish early connections to third-party origins -->
<link rel="preconnect" href="https://api.example.com" />
```

Use `preload` for resources on the current page that the browser discovers late (fonts referenced in CSS, images referenced in JavaScript). Use `prefetch` for resources the user is likely to need next. Use `preconnect` when you know the user will request resources from a specific origin but you do not know the exact URL yet.

### Preventing Layout Shifts

Layout shifts frustrate users and hurt CLS scores. The most common causes are images without dimensions, dynamically injected content, and web fonts that swap with a different size.

Always set explicit `width` and `height` attributes on images and video elements. The browser uses these to calculate the aspect ratio and reserve space before the resource loads. For responsive containers, use the CSS `aspect-ratio` property.

This CSS demonstrates reserving space for a responsive image container and controlling font loading:

```css
.video-container {
  aspect-ratio: 16 / 9;
  width: 100%;
  background: #e2e8f0;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter.woff2') format('woff2');
  font-display: swap;
}
```

The `font-display: swap` strategy shows fallback text immediately and swaps to the custom font once loaded. For critical text, consider `font-display: optional` which skips the font entirely if it does not load within a short window, eliminating the layout shift completely.

## Advanced Techniques

### Virtualization for Large Lists

When rendering thousands of rows, the DOM becomes the bottleneck. Virtualization (also called windowing) solves this by only rendering the items currently visible in the viewport, plus a small overscan buffer above and below.

Libraries like `@tanstack/react-virtual` and `react-window` handle the math of calculating which items to render based on scroll position. You provide the total count and a row renderer, and the library manages the rest.

This example shows a basic virtualized list using `@tanstack/react-virtual`:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  })

  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: virtualRow.start,
              height: virtualRow.size,
              width: '100%',
            }}
          >
            {items[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  )
}
```

Use virtualization when the list exceeds a few hundred items. For smaller lists, the overhead of the virtualization library is not worth it.

### SSR vs SSG vs CSR Tradeoffs

Choosing the right rendering strategy is a frequent senior-level interview question. Each approach optimizes for different constraints.

**SSG (Static Site Generation)** pre-renders pages at build time. It delivers the fastest TTFB because pages are served from a CDN as static files. SEO is excellent since the HTML is fully formed. The tradeoff is that content is stale until the next build. Use SSG for marketing pages, blogs, and documentation.

**SSR (Server-Side Rendering)** generates HTML on each request. TTFB is slower than SSG because the server must render before responding. SSR is ideal for personalized or frequently updated content where SEO still matters. TTI depends on the hydration cost of the client-side JavaScript.

**CSR (Client-Side Rendering)** ships a minimal HTML shell and renders everything in the browser. TTFB is fast (small HTML payload) but TTI is slow because the browser must download, parse, and execute JavaScript before anything is visible. SEO is poor without additional work. Use CSR for authenticated dashboards and interactive tools where SEO is irrelevant.

### Performance Observer API

The Performance Observer API lets you measure real user performance metrics programmatically. This is how production monitoring tools like Datadog and Sentry collect performance data.

This example demonstrates measuring LCP and CLS using the PerformanceObserver:

```javascript
const lcpObserver = new PerformanceObserver(list => {
  const entries = list.getEntries()
  const lastEntry = entries[entries.length - 1]
  console.log('LCP:', lastEntry.startTime, lastEntry.element)
})
lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

const clsObserver = new PerformanceObserver(list => {
  let clsScore = 0
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      clsScore += entry.value
    }
  }
  console.log('CLS:', clsScore)
})
clsObserver.observe({ type: 'layout-shift', buffered: true })
```

The `buffered: true` option ensures you capture entries that occurred before the observer was registered, which is critical for metrics like LCP that fire early in the page lifecycle.

### Chrome DevTools Performance Panel

The Performance panel in Chrome DevTools is your primary tool for diagnosing runtime performance issues. The workflow starts with recording a trace — click the record button, perform the action you want to profile, then stop.

The flame chart shows every function call on the main thread, stacked by call depth. Wide bars indicate long-running functions. Look for tasks exceeding 50ms, which Chrome marks as "Long Tasks" with a red corner. These block the main thread and cause jank.

The summary tab breaks down time into categories: Scripting, Rendering, Painting, and Idle. If scripting dominates, focus on reducing JavaScript execution. If rendering dominates, look for forced reflows caused by reading layout properties after writing them (layout thrashing).

## Scenario-Based Questions

### How would you diagnose a slow LCP?

Start by opening the Performance panel in DevTools and recording a page load. Identify the LCP element in the timeline — DevTools marks it explicitly. Then examine the network waterfall to see when the LCP resource (usually an image or font) was requested.

Common causes include render-blocking CSS or JavaScript that delays the critical rendering path, late-discovered images (referenced in CSS or JavaScript rather than HTML), unoptimized images served in legacy formats, and slow server response times. Fix these by inlining critical CSS, preloading the LCP image, converting to WebP/AVIF, and adding appropriate cache headers. For server-rendered pages, check TTFB — if it exceeds 600ms, the bottleneck is on the server, not the client.

### How would you implement virtualization for a 10,000-row table?

Use a virtualization library like `@tanstack/react-virtual` to render only the visible rows. Set up a scrollable container with a fixed height and configure the virtualizer with the total row count and estimated row height. Add an overscan of 5-10 rows to prevent flicker during fast scrolling.

For variable-height rows, provide a measurement function or use the library's dynamic measurement feature. Handle scroll restoration by saving and restoring the scroll offset when the user navigates away and returns. If the table supports sorting or filtering, reset the scroll position to the top when the data changes. For extremely large datasets, consider server-side pagination combined with virtualization.

### A page has high CLS — how do you fix it?

Open the Performance panel and enable the "Layout Shifts" track. This shows exactly when shifts occur and which elements moved. The Layout Instability API (via PerformanceObserver) can also identify shifting elements programmatically.

The most common fixes are adding explicit `width` and `height` to images and videos, reserving space for ads or dynamic content with fixed-size containers, using `font-display: optional` to prevent font-swap shifts, and avoiding inserting content above the fold after initial render. For third-party embeds, wrap them in a container with a fixed aspect ratio. Test your fixes using Lighthouse and the CLS overlay in DevTools to verify the score drops below 0.1.

### How would you reduce the JavaScript bundle size of a large application?

Start by analyzing the bundle with a tool like `@next/bundle-analyzer` or `webpack-bundle-analyzer` to identify the largest modules. Look for duplicate dependencies, oversized libraries with smaller alternatives (e.g., replacing `moment` with `date-fns`), and unused code that tree shaking missed.

Implement route-level code splitting so users only download JavaScript for the current page. Lazy-load heavy components behind user interactions. Audit barrel files that may be pulling in entire libraries. Review your `package.json` for dependencies that could be replaced with native browser APIs — `fetch` instead of `axios`, `URLSearchParams` instead of `query-string`, `Intl` instead of formatting libraries.

## Rapid Fire

**Q: What is TTFB?**
A: Time to First Byte — the time between the browser sending a request and receiving the first byte of the response. It measures server responsiveness and network latency.

**Q: What does `font-display: swap` do?**
A: It tells the browser to show text with a fallback font immediately and swap to the custom font once it loads, preventing invisible text.

**Q: What is a Long Task?**
A: Any task on the main thread that takes longer than 50ms. Long tasks block user input and cause visual jank.

**Q: What is the difference between `preload` and `prefetch`?**
A: `preload` fetches resources needed for the current page with high priority. `prefetch` fetches resources for future navigations with low priority during idle time.

**Q: What causes layout thrashing?**
A: Reading layout properties (like `offsetHeight`) immediately after writing style changes forces the browser to recalculate layout synchronously, blocking the main thread.

**Q: What is the purpose of the `will-change` CSS property?**
A: It hints to the browser that an element will be animated, allowing it to promote the element to its own compositor layer ahead of time. Overusing it wastes memory.

**Q: What is the difference between `defer` and `async` on script tags?**
A: `defer` downloads in parallel and executes after HTML parsing in document order. `async` downloads in parallel and executes immediately when ready, in any order.

**Q: What is INP and why did it replace FID?**
A: INP (Interaction to Next Paint) measures the worst-case responsiveness across all interactions on a page. FID only measured the delay of the first interaction, missing slowness that occurred later.

## Frequently Asked Questions

### What are Core Web Vitals and why do they matter?

Core Web Vitals are three metrics defined by Google that measure real-user experience: LCP (loading speed), CLS (visual stability), and INP (interactivity). They directly influence search rankings and serve as a shared language between developers, product teams, and stakeholders for discussing page quality. Meeting the recommended thresholds correlates with lower bounce rates and higher user engagement.

### What is the difference between code splitting and tree shaking?

Code splitting divides your bundle into smaller chunks that load on demand, reducing the amount of JavaScript downloaded upfront. Tree shaking removes unused exports from the final bundle at build time through static analysis of ES module imports. They are complementary — tree shaking makes each chunk smaller, while code splitting controls when each chunk loads.

### When should you use SSR vs SSG vs CSR?

Use SSG for content that changes infrequently and needs fast load times with strong SEO, such as blogs and marketing pages. Use SSR for dynamic or personalized content that still requires SEO, such as e-commerce product pages with real-time pricing. Use CSR for authenticated applications like dashboards where SEO is not a concern and rich interactivity is the priority.

### How do you measure performance in production?

Use the `web-vitals` library or the PerformanceObserver API to collect Core Web Vitals from real users and send them to an analytics endpoint. Complement real-user monitoring (RUM) with synthetic monitoring tools like Lighthouse CI that run in your deployment pipeline. Set performance budgets for bundle size, LCP, and INP, and configure alerts when metrics regress beyond acceptable thresholds.
