---
slug: "nextjs-dark-mode-theming"
title: "Dark Mode Without Flash in Next.js"
description: "Build a flash-free dark mode in Next.js — blocking script, SSR hydration, toggle components, and Tailwind token integration."
category: "Next.js"
subcategory: "Styling"
tags: ["nextjs", "dark-mode", "tailwind", "ssr", "hydration", "theming"]
date: "2026-03-25"
related: ["css-custom-properties-theming", "react-hooks-deep-dive", "web-accessibility-deep-dive"]
---

## Beginner Concepts

Dark mode in Next.js is one of the most commonly discussed senior interview topics — not because it is hard, but because doing it correctly requires understanding SSR hydration timing, `localStorage` persistence, and the cascade all at once.

The naive implementation always causes a visible flash. Senior engineers are expected to know why and how to eliminate it.

### Why `useEffect` Causes a Theme Flash

When Next.js renders a page — server-side or statically — it cannot know the user's stored theme preference. The HTML arrives with whatever the server default is. React hydrates, `useEffect` fires, you read `localStorage`, and you apply the correct theme. The problem: the browser has already painted the page once with the wrong colours before `useEffect` runs.

```tsx
// This CAUSES a flash — do not use for theming
'use client'
import { useEffect, useState } from 'react'

export default function Layout({ children }) {
	const [theme, setTheme] = useState('light')

	useEffect(() => {
		const stored = localStorage.getItem('theme') ?? 'dark'
		setTheme(stored) // fires AFTER first paint — too late
	}, [])

	return <div data-theme={theme}>{children}</div>
}
```

The fix is to set the theme before React mounts, using an inline blocking script in `<head>`.

For a complete overview of senior frontend interview topics, see our [Senior Frontend Interview Questions guide](/senior-frontend-interview-questions/).

---

## Intermediate Patterns

### The Blocking Script Pattern

An inline `<script>` in `<head>` without `async` or `defer` is render-blocking: the browser executes it before painting anything. This is normally undesirable, but it is exactly what you need for theme initialisation.

```tsx
// src/app/layout.tsx
const themeScript = `(function(){
	try {
		var d = document.documentElement;
		var t = localStorage.getItem('theme');
		if (!t) {
			t = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
		}
		d.classList.toggle('dark', t === 'dark');
		d.setAttribute('data-theme', t);
		var c = localStorage.getItem('contrast') || 'normal';
		d.setAttribute('data-contrast', c);
	} catch(e) {}
})();`

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body>{children}</body>
		</html>
	)
}
```

Three things make this work:

1. **`try/catch`** — `localStorage` can throw in private browsing or restricted environments. The catch prevents a runtime error and falls through to the OS preference.
2. **`prefers-color-scheme` fallback** — first-time visitors have no stored preference. Reading the OS media query gives them the correct theme immediately.
3. **`suppressHydrationWarning` on `<html>`** — React will see that `data-theme` differs from what the server rendered. This attribute silences the warning since the mismatch is intentional.

### Why Not SSR Cookies Instead?

Interviewers often ask: why not read a cookie during SSR to set the correct theme server-side? Cookies work, but they require the server to read and apply the theme on every request, breaking simple CDN caching. The inline script approach is stateless on the server — every user gets the same cached HTML, and the script corrects the theme client-side before the first paint. The script is under 300 bytes, so the render-blocking cost is negligible.

### The Token System

This blog uses 12 role-based CSS custom properties as design tokens. Every component references these tokens through `var()` — when the `data-theme` attribute changes, the cascade re-evaluates every token and the entire page repaints with zero JavaScript re-renders.

```css
/* globals.css */
:root,
[data-theme='dark'] {
	--bg:            #0d1117;
	--bg-secondary:  #161b22;
	--fg:            #e6edf3;
	--fg-muted:      #8b949e;
	--border:        #30363d;
	--accent:        #30ff90;
	--accent-hover:  #5cffab;
	--accent-muted:  rgba(48, 255, 144, 0.08);
	--accent-border: rgba(48, 255, 144, 0.2);
	--accent-glow:   rgba(48, 255, 144, 0.3);
	--code-bg:       #0d1117;
	--code-fg:       #e6edf3;
}

[data-theme='light'] {
	--bg:            #f5f0e8;
	--bg-secondary:  #ebe5d6;
	--fg:            #1c1917;
	--fg-muted:      #57534e;
	--border:        #d6d0c4;
	--accent:        #1a6b3c;
	--accent-hover:  #15573a;
	--accent-muted:  rgba(26, 107, 60, 0.08);
	--accent-border: rgba(26, 107, 60, 0.2);
	--accent-glow:   rgba(26, 107, 60, 0.15);
	--code-bg:       #1c1917;
	--code-fg:       #f5f0e8;
}
```

For a deep dive into cascade specificity, `@property` registration, and why tokens are named by role instead of value, see [CSS Custom Properties for Theming](/css-custom-properties-theming/).

### High Contrast as a Second Axis

A `data-contrast="high"` attribute layers on top of whichever theme is active. The blocking script already reads this from `localStorage` and sets it before first paint:

```css
[data-contrast='high'] {
	--border:        #e6edf3;
	--fg-muted:      #c9d1d9;
	--accent:        #3fff9a;
	--accent-muted:  rgba(63, 255, 154, 0.15);
	--accent-border: rgba(63, 255, 154, 0.35);
	--accent-glow:   rgba(63, 255, 154, 0.4);
	--code-bg:       #000000;
	--code-fg:       #ffffff;
}

[data-theme='light'][data-contrast='high'] {
	--border:        #1c1917;
	--fg-muted:      #292524;
	--accent:        #15573a;
	--accent-muted:  rgba(21, 87, 58, 0.15);
	--accent-border: rgba(21, 87, 58, 0.35);
	--accent-glow:   rgba(21, 87, 58, 0.25);
	--code-bg:       #0c0a09;
	--code-fg:       #fafaf9;
}
```

### Toggle Components

Each toggle is a client component that mutates `<html>` and persists to `localStorage`. The cascade fires immediately on `setAttribute` — no React state needed for the visual update:

```tsx
// ThemeToggle.tsx
'use client'

function toggle() {
	const isDark = document.documentElement.classList.toggle('dark')
	const theme = isDark ? 'dark' : 'light'
	document.documentElement.setAttribute('data-theme', theme)
	localStorage.setItem('theme', theme)
}

<button
	className="p-2 rounded-lg text-[var(--fg-muted)]
	           hover:text-[var(--fg)] hover:bg-[var(--bg-secondary)]
	           transition-colors"
>
	{/* Sun or Moon SVG */}
</button>
```

```tsx
// ContrastToggle.tsx
'use client'

const toggleContrast = () => {
	const next = !isHigh
	const value = next ? 'high' : 'normal'
	document.documentElement.setAttribute('data-contrast', value)
	localStorage.setItem('contrast', value)
	setIsHigh(next)
}
```

The `setIsHigh` state call is only needed to swap the SVG icon — the visual theme change itself happens at the CSS level with zero React involvement.

---

## Advanced Techniques

### Tailwind Integration with CSS Variables

Tailwind's arbitrary-value syntax bridges utility classes and runtime CSS variables. The rule: **Tailwind handles layout and spacing; CSS custom properties handle all colour**.

```tsx
// 1. Solid and semi-transparent backgrounds
<div className="bg-[var(--bg)]" />
<div className="bg-[var(--bg)]/80 backdrop-blur-sm" />

// 2. Text hierarchy
<h1 className="text-[var(--fg)]" />
<p className="text-[var(--fg-muted)]" />

// 3. Borders — structural and accent
<div className="border border-[var(--border)]" />
<div className="border-[var(--accent-border)]" />

// 4. Glow box-shadow
<article className="hover:shadow-[0_0_20px_var(--accent-glow)]" />

// 5. Focus rings
<input className="focus:outline-none focus:border-[var(--accent)]" />

// 6. Inline style escape hatch
<div style={{ boxShadow: '0 0 8px var(--accent-glow)' }} />
```

Never write `bg-gray-900` in a component that needs to theme-switch — it ignores the cascade entirely. Tailwind's JIT compiler generates class names at build time, so `bg-[var(--bg)]` produces one static class whose `background` value contains a `var()` reference. Dynamic class names like `` `bg-[${color}]` `` computed in JSX do not work unless Tailwind's class-scanning step encounters the literal string.

### Hover Glow Cards

Blog cards use `--accent-glow` as a `box-shadow` on hover. In dark mode it is a vivid `rgba(48, 255, 144, 0.3)`. In light mode it becomes `rgba(26, 107, 60, 0.15)`. One class string, two themes:

```tsx
<article
	className="border border-[var(--border)] bg-[var(--bg-secondary)]
	           hover:border-[var(--accent-border)]
	           hover:shadow-[0_0_20px_var(--accent-glow)]
	           transition-all"
>
	<h2 className="text-[var(--accent)]">{post.title}</h2>
	<p className="text-[var(--fg-muted)]">{post.description}</p>
</article>
```

### Ghost Button That Inverts on Hover

The button starts as a transparent accent ghost and fully inverts on hover. The key insight: `text-[var(--bg)]` on hover ensures the text is always the background colour, which contrasts correctly against `--accent` regardless of which theme is active:

```tsx
<button
	className="bg-[var(--accent-muted)] border border-[var(--accent-border)]
	           text-[var(--accent)] hover:bg-[var(--accent)]
	           hover:text-[var(--bg)] transition-colors disabled:opacity-50"
>
	Send
</button>
```

Hardcoding `text-white` would break in light mode where `--accent` is dark green and white text fails the WCAG contrast ratio requirement.

### Frosted Glass Panels

The `/80` Tailwind modifier applies 80% opacity to whatever `--bg` resolves to. Combined with `backdrop-blur`, it creates a frosted glass effect over the grid texture background:

```tsx
{/* TOC sidebar */}
<div
	className="sticky top-24 overflow-y-auto rounded-lg px-3 py-3
	           bg-[var(--bg)]/80 backdrop-blur-sm border border-[var(--border)]"
	style={{ maxHeight: 'calc(100vh - 7rem)' }}
>
	<TableOfContents toc={toc} />
</div>

{/* Article column */}
<article className="min-w-0 rounded-lg px-6 py-6 bg-[var(--bg)]/80 backdrop-blur-sm">
	{children}
</article>
```

In dark mode: `rgba(13, 17, 23, 0.8)`. In light mode: `rgba(245, 240, 232, 0.8)`. The backdrop filter renders whatever is behind as a soft diffused background.

### Chat Message Bubbles

User messages use `--accent-muted` for a brand-tinted background. Assistant messages use `--bg-secondary` for a neutral tone. Both adapt automatically across themes:

```tsx
{/* User message — accent-tinted, right-aligned */}
<div className="bg-[var(--accent-muted)] border border-[var(--accent-border)]
                text-[var(--fg)] max-w-[85%] rounded-lg px-3 py-2 text-sm">
	{message.content}
</div>

{/* Assistant message — neutral, left-aligned */}
<div className="bg-[var(--bg-secondary)] border border-[var(--border)]
                text-[var(--fg-muted)] max-w-[85%] rounded-lg px-3 py-2 text-sm">
	{message.content}
</div>
```

### Themed Scrollbars

Scrollbar styling follows the token system as well, with an accent highlight on hover for sidebar panels:

```css
/* All scrollbars */
::-webkit-scrollbar-thumb       { background: var(--border); }
::-webkit-scrollbar-thumb:hover { background: var(--fg-muted); }

/* Sidebar — accent thumb on hover */
.sidebar-scroll::-webkit-scrollbar-thumb       { background-color: var(--border); }
.sidebar-scroll::-webkit-scrollbar-thumb:hover { background-color: var(--accent); }

/* Firefox */
* { scrollbar-color: var(--border) transparent; }
```

---

## Scenario-Based Questions

### How would you add a sepia theme?

Add a `[data-theme="sepia"]` block to your CSS with appropriate token values. Update `ThemeToggle` to cycle through `dark -> light -> sepia` states instead of toggling between two. The blocking script in `layout.tsx` already reads from `localStorage` generically with `d.setAttribute('data-theme', t)` — no changes needed. Every component inherits sepia values automatically through the cascade.

### How do you scope a different theme to one page section?

Apply `data-theme="light"` to a specific element rather than `<html>`. All descendant `var()` calls resolve against that element's token values for the subtree only:

```tsx
// This section renders in light mode regardless of the global theme
<section data-theme="light" className="bg-[var(--bg)] text-[var(--fg)]">
	<PreviewCard />
</section>
```

### What happens if the user has JavaScript disabled?

The blocking script does not run. The page renders with the CSS `:root` default — in this project, dark mode. Toggle buttons appear but do not function. A progressively enhanced fallback adds `prefers-color-scheme` media queries to the CSS itself, removing the JavaScript dependency for the initial render.

### How do you prevent a contrast-toggle flash on client navigation?

In Next.js App Router, `layout.tsx` renders once and persists across client-side navigations. The blocking script runs only on full page loads, not soft navigations. Since `data-contrast` is set on `<html>` which persists across route changes, there is no flash. In a multi-page app without a persistent shell, you would need the script in each page's `<head>`.

---

## Rapid Fire

**Q: Does setting `data-theme` trigger a reflow or repaint?**
A: Repaint only, assuming only colour tokens change. Reflows require geometry changes. Do not put spacing or layout values in theme-switched tokens.

**Q: Can you animate between themes?**
A: Not automatically. CSS transitions do not fire on attribute changes. Add explicit `transition: background-color 300ms, color 300ms` to elements, or use `@property` to register custom properties with types the browser can interpolate.

**Q: Why is `dangerouslySetInnerHTML` required for the inline script?**
A: React escapes all JSX string children. `dangerouslySetInnerHTML` bypasses escaping for content you control. Since this is your own IIFE with no user input, it is safe.

**Q: How do you test theme switching in Playwright?**
A: Use `page.addInitScript` to inject `localStorage.setItem('theme', 'light')` before navigation. Alternatively, call `page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'))` after navigation.

**Q: What if `localStorage` is unavailable?**
A: The `try/catch` in the blocking script prevents a runtime error. The site falls back to the `prefers-color-scheme` media query, giving first-time visitors and restricted environments a correct initial theme.

---

## Frequently Asked Questions

### Why does Next.js need a blocking script instead of SSR cookies?

SSR cookies require the server to read the cookie on every request and inject `data-theme` into the rendered HTML, which breaks simple CDN caching — you cannot cache a response that varies per user preference. The blocking script is stateless on the server: every user gets the same cached HTML, and the script corrects the theme client-side before first paint. At under 300 bytes, the render-blocking cost is negligible.

### What is the difference between the four accent token variants?

`--accent` is the full-saturation colour for text and interactive elements. `--accent-muted` is an 8% opacity version for subtle background tints (badges, user message bubbles). `--accent-border` is a 20% opacity version for borders that feel accent-coloured without being vivid. `--accent-glow` is a 30% opacity version used as a `box-shadow` colour for soft hover halos. Separate tokens let high-contrast mode increase opacities precisely where needed.

### How do you ensure text on an accent background stays readable across themes?

Use `text-[var(--bg)]` instead of `text-white`. In dark mode, `--bg` is near-black and contrasts well against the bright green `--accent`. In light mode, `--bg` is near-white and contrasts well against the dark green `--accent`. Hardcoding `text-white` breaks in light mode where `--accent` is dark green — the white-on-dark-green combination fails WCAG contrast requirements.

### Should design tokens be defined at `:root` or on `<html>` directly?

They are equivalent — `:root` in CSS refers to the `<html>` element. The preference for `:root` is semantic: it reads as "the root of the document" rather than being tied to a tag name. Defining tokens on `[data-theme]` selectors applied to `<html>` achieves the same cascade result since the attribute selector targets the same node.
