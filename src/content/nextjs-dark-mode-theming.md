---
slug: "nextjs-dark-mode-theming"
title: "Dark Mode Without Flash: Next.js Theming with CSS Custom Properties"
description: "Build a flash-free dark mode and high-contrast theme system in Next.js — design tokens, data-attribute selectors, Tailwind integration, and real component patterns."
category: "Next.js"
subcategory: "Styling"
tags: ["nextjs", "dark-mode", "css-custom-properties", "theming", "accessibility"]
date: "2026-03-25"
related: ["css-layout-interview-questions", "web-accessibility-deep-dive", "react-hooks-deep-dive"]
---

## Introduction

Implementing dark mode in a Next.js application is one of the most commonly discussed senior frontend interview topics — not because it is hard, but because doing it correctly requires you to understand CSS cascade specificity, SSR hydration timing, `localStorage` persistence, and accessibility all at once.

The naive implementation (`useEffect` → read `localStorage` → set a class) always causes a visible flash of the wrong theme. Senior engineers are expected to know why and how to eliminate it. This post walks through the production architecture used to power this blog: a 12-token design system driven by `data-theme` and `data-contrast` HTML attributes, a blocking inline script that prevents any flash, and a Tailwind integration pattern that keeps every component theme-aware with zero hardcoded colour values.

For a complete overview of senior frontend interview topics, see our [Senior Frontend Interview Questions guide](/senior-frontend-interview-questions/).

---

## Why `useEffect` Causes a Theme Flash

When Next.js renders a page — whether server-side or statically — it cannot know the user's stored theme preference at render time. The HTML arrives in the browser with whatever the server default is (usually `light` or `dark` depending on your base styles). React then hydrates, `useEffect` fires, you read `localStorage`, and you apply the correct theme.

The problem: the browser has already painted the page once with the wrong colours before `useEffect` runs. The result is a visible flash — often called FOUC (Flash of Unstyled Content) or, in this case, a Flash of Wrong Theme.

```tsx
// This CAUSES a flash — do not use for theming
'use client'
import { useEffect, useState } from 'react'

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light')  // server default

  useEffect(() => {
    const stored = localStorage.getItem('theme') ?? 'dark'
    setTheme(stored)  // fires AFTER first paint — too late
  }, [])

  return <div data-theme={theme}>{children}</div>
}
```

The fix is to set the theme before React mounts, using an inline blocking script in `<head>`.

---

## The Blocking Script Pattern

An inline `<script>` tag in `<head>` without `async` or `defer` is **render-blocking**: the browser parses and executes it before painting anything. This is normally undesirable for third-party scripts, but it is exactly what you need for theme initialisation.

The following script reads `localStorage` and sets `data-theme` and `data-contrast` directly on `<html>` before the browser's first paint:

```ts
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

Three things make this work correctly:

1. **`try/catch`** — `localStorage` can throw in private browsing or restricted environments. The catch prevents a runtime error and falls back to the OS preference.
2. **`prefers-color-scheme` fallback** — first-time visitors have no stored preference. Reading the OS media query gives them the correct theme immediately.
3. **`suppressHydrationWarning` on `<html>`** — React will see that `data-theme` differs from what the server rendered and would normally warn. This attribute silences that warning since the difference is intentional.

---

## Designing the Token System

A design token is a named design decision expressed as a CSS custom property. The key rule: **name tokens by role, not value**. A token named `--green-500` breaks the moment light mode needs a different shade of green for the same semantic role. A token named `--accent` stays stable across every theme variant.

This blog uses 12 role-based tokens, all defined in one CSS file:

```css
/* globals.css */

:root,
[data-theme="dark"] {
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

[data-theme="light"] {
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

When `data-theme="light"` is set on `<html>`, the cascade re-evaluates every `var(--*)` call on the page. Every component repaints with the new values. Zero JavaScript re-renders. Zero component updates. The browser does all the work.

### Why `data-theme` Over a Class?

Both `[data-theme="dark"]` and `.dark` work. The attribute approach is preferred because:

- It does not pollute the class list alongside Tailwind utility classes
- Compound selectors like `[data-theme="light"][data-contrast="high"]` are unambiguous; `.light.high` could collide with utility class names
- It signals intent — an attribute is a property of the element, a class is typically a style hook

---

## Adding High Contrast as a Second Axis

Accessibility requires separate control over contrast independent of light/dark preference. A user may want a dark theme at low contrast for comfortable night reading, or a light theme at high contrast for maximum legibility. These are two independent concerns and should be modelled as two independent attributes.

A `data-contrast="high"` override layer stacks on top of whichever theme is active:

```css
[data-contrast="high"] {
  --border:        #e6edf3;
  --fg-muted:      #c9d1d9;
  --accent:        #3fff9a;
  --accent-muted:  rgba(63, 255, 154, 0.15);
  --accent-border: rgba(63, 255, 154, 0.35);
  --accent-glow:   rgba(63, 255, 154, 0.4);
  --code-bg:       #000000;
  --code-fg:       #ffffff;
}

/* Light theme at high contrast needs its own overrides */
[data-theme="light"][data-contrast="high"] {
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

CSS specificity handles the cascade automatically. `[data-theme][data-contrast]` has two attribute selectors (specificity `0,2,0`) and beats the single-attribute `[data-theme]` rule (`0,1,0`) without any `!important`.

### The Toggle Components

Each toggle is a client component that mutates the `<html>` element and persists to `localStorage`. The CSS cascade fires immediately on `setAttribute` — no state needed for the visual update:

```tsx
// ThemeToggle.tsx
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

## Integrating Tokens with Tailwind CSS

Tailwind's arbitrary-value syntax bridges utility classes and runtime CSS variables:

```tsx
// The six core patterns used across every component

// 1. Solid and semi-transparent backgrounds
<div className="bg-[var(--bg)]" />
<div className="bg-[var(--bg)]/80 backdrop-blur-sm" />   // frosted glass

// 2. Text hierarchy
<h1 className="text-[var(--fg)]" />
<p  className="text-[var(--fg-muted)]" />

// 3. Borders — structural and accent
<div className="border border-[var(--border)]" />
<div className="border-[var(--accent-border)]" />

// 4. Glow box-shadow
<article className="hover:shadow-[0_0_20px_var(--accent-glow)]" />

// 5. Focus rings on inputs
<input className="focus:outline-none focus:border-[var(--accent)]" />

// 6. Inline style escape hatch (for complex shadow values Tailwind rejects)
<div style={{ boxShadow: '0 0 8px var(--accent-glow)' }} />
```

The rule is simple: **Tailwind handles layout and spacing; CSS custom properties handle all colour**. Never write `bg-gray-900` in a component that needs to theme-switch — it ignores the cascade entirely.

---

## Component Patterns Built on Tokens

### Active Navigation with Accent Left Border

The sidebar uses a 3px left border in `--accent` for the active item. The border colour switches automatically when the user changes theme:

```tsx
<Link
  className={isActive
    ? 'bg-[var(--bg-secondary)] text-[var(--fg)] border-l-[3px] border-[var(--accent)]'
    : 'text-[var(--fg-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--fg)] border-l-[3px] border-transparent'
  }
>
  All Posts
</Link>
```

### Hover Glow Cards

Blog cards and related post links use `--accent-glow` — a low-opacity rgba version of `--accent` — as a `box-shadow` on hover:

```tsx
<article
  className="border border-[var(--border)] bg-[var(--bg-secondary)]
             hover:border-[var(--accent-border)]
             hover:shadow-[0_0_20px_var(--accent-glow)]
             transition-all"
>
  <h2 className="text-[var(--accent)]">{post.title}</h2>
  <p  className="text-[var(--fg-muted)]">{post.description}</p>
</article>
```

In dark mode, the glow is a vivid `rgba(48, 255, 144, 0.3)` green. In light mode it becomes `rgba(26, 107, 60, 0.15)` — a subtle dark-green shadow. One class string, two themes.

### Ghost Button That Inverts on Hover

The chat send button starts as a transparent accent-coloured ghost and fully inverts on hover — the text switches from `--accent` to `--bg` (background colour) as the background fills with `--accent`:

```tsx
<button
  className="bg-[var(--accent-muted)] border border-[var(--accent-border)] text-[var(--accent)]
             hover:bg-[var(--accent)] hover:text-[var(--bg)]
             transition-colors disabled:opacity-50"
>
  →
</button>
```

This pattern appears on every CTA button in the project. The key insight: `text-[var(--bg)]` on the hover state ensures the text is always the background colour, which contrasts correctly against `--accent` regardless of which theme is active.

### Frosted Glass Panels

The article Table of Contents and the main article column use a semi-transparent background with `backdrop-filter: blur` to let the grid texture show through while keeping text legible:

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

The `/80` Tailwind modifier applies 80% opacity to whatever `--bg` resolves to. In dark mode, `rgba(13, 17, 23, 0.8)`. In light mode, `rgba(245, 240, 232, 0.8)`. The backdrop blur then renders the grid texture behind the element as a soft diffused background.

### Chat Message Bubbles

The chat component uses `--accent-muted` for user messages and `--bg-secondary` for assistant messages — visually distinct without any hardcoded colours:

```tsx
{/* User message — accent-tinted, right-aligned */}
<div className="bg-[var(--accent-muted)] border border-[var(--accent-border)] text-[var(--fg)]
                max-w-[85%] rounded-lg px-3 py-2 text-sm">
  {message.content}
</div>

{/* Assistant message — neutral, left-aligned */}
<div className="bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--fg-muted)]
                max-w-[85%] rounded-lg px-3 py-2 text-sm">
  {message.content}
</div>
```

### Themed Scrollbars

Scrollbars are styled via CSS custom properties as well, including a special `.sidebar-scroll` class for sidebar elements where the thumb should highlight in `--accent` on hover:

```css
/* All scrollbars */
::-webkit-scrollbar-thumb       { background: var(--border); }
::-webkit-scrollbar-thumb:hover { background: var(--fg-muted); }

/* Sidebar panels — accent thumb on hover */
.sidebar-scroll::-webkit-scrollbar-thumb       { background-color: var(--border); }
.sidebar-scroll::-webkit-scrollbar-thumb:hover { background-color: var(--accent); }

/* Firefox */
* { scrollbar-color: var(--border) transparent; }
```

---

## Scenario-Based Questions

### How Would You Add a Sepia Theme?

Add a `[data-theme="sepia"]` block to your CSS with the appropriate token values. Update `ThemeToggle` to cycle through `dark → light → sepia` states instead of toggling between two. The inline script in `layout.tsx` already reads from `localStorage` generically with `d.setAttribute('data-theme', t)` — no changes needed there. Every component inherits the sepia values automatically through the cascade.

### How Do You Scope a Different Theme to One Page Section?

Apply `data-theme="light"` to a specific element rather than `<html>`. All descendant `var(--*)` calls will resolve against the light-mode tokens for that subtree only. This is the cascade working exactly as designed — any element can be a theme context boundary.

```tsx
// This section renders in light mode regardless of the global theme
<section data-theme="light" className="bg-[var(--bg)] text-[var(--fg)]">
  ...
</section>
```

### What Happens if the User Has JavaScript Disabled?

The blocking script does not run. The page renders with whatever the CSS `:root` default is — in this project, dark mode. The toggle buttons would still appear but would not function. A progressively enhanced fallback would be to use `prefers-color-scheme` as the default in the CSS itself, removing the dependency on JavaScript for the initial render.

---

## Rapid Fire

**Q: Does setting `data-theme` trigger a reflow or repaint?**
A: Repaint only, not reflow — assuming only colour tokens change. Reflows (layout recalculation) are triggered by geometry changes: dimensions, margins, font sizes. Colour changes are cheaper. Do not put spacing or layout values in theme-switched tokens.

**Q: Can you animate between themes?**
A: Not automatically. CSS transitions do not fire on `data-attribute` changes the way they do on class changes. You need to either add `transition: background-color 300ms, color 300ms` to specific elements or use `@property` to register the custom properties with explicit types, enabling the browser to interpolate them.

**Q: Why is `dangerouslySetInnerHTML` required for the inline script?**
A: React escapes all JSX string children to prevent XSS. `dangerouslySetInnerHTML` bypasses escaping for content you control. Since this is your own IIFE with no user-provided strings, it is safe. The `__html` key name is intentionally verbose to make the usage visible in code review.

**Q: How do you test theme switching in Playwright?**
A: Use `page.addInitScript` to inject `localStorage.setItem('theme', 'light')` before navigation. Alternatively, after navigation, call `page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'))` to switch without page reload. Both approaches work without modifying production code.

**Q: Can custom properties cross Shadow DOM boundaries?**
A: Yes. Properties defined on `:root` in the light DOM are readable from inside shadow roots via `var()`. This makes them the standard mechanism for theming web components. However, `@property` registered properties do not cross shadow boundaries in all browsers.

---

## Frequently Asked Questions

### Why does Next.js need a blocking script instead of SSR cookies to prevent the theme flash?

SSR cookies require the server to read the cookie on every request and inject `data-theme` into the rendered HTML, which complicates caching — you cannot cache a response that varies per user preference with a simple CDN rule. The blocking inline script approach is stateless on the server: every user gets the same cached HTML, and the script corrects the theme client-side before the first paint. The trade-off is that the script is render-blocking, but since it is tiny (under 300 bytes), it has negligible impact on Time to Interactive.

### What is the difference between `--accent`, `--accent-muted`, `--accent-border`, and `--accent-glow`?

These are four semantic variants of the same brand colour at different opacities, each serving a distinct visual role. `--accent` is the full-saturation colour for text and interactive elements. `--accent-muted` is an 8% opacity version used as a subtle background tint (pill badges, user message bubbles). `--accent-border` is a 20% opacity version for borders that need to feel accent-coloured without being too vivid. `--accent-glow` is a 30% opacity version used exclusively as a `box-shadow` colour to produce a soft luminous halo on hover. Using separate tokens keeps each usage semantically clear and lets high-contrast mode increase the opacities precisely.

### How do you ensure text on an accent background is always readable across both themes?

Use `text-[var(--bg)]` instead of `text-white` for text that sits on an `--accent` background. In dark mode, `--bg` is `#0d1117` (near-black), which contrasts well against the bright green `--accent`. In light mode, `--bg` is `#f5f0e8` (near-white), which contrasts well against the dark green `--accent`. Hardcoding `text-white` would break in light mode where `--accent` is dark green and white text fails the WCAG contrast ratio requirement.

### How does the `data-contrast="high"` layer interact with `data-theme`?

The high-contrast CSS block uses the selector `[data-contrast="high"]`, which has a specificity of `0,1,0` (one attribute selector). The theme blocks use `[data-theme="dark"]` and `[data-theme="light"]`, which also have a specificity of `0,1,0`. When both attributes are present, the last declared rule wins by source order — and since the `[data-contrast]` rule is declared last in the stylesheet, it overrides the theme tokens it redefines. The combined selector `[data-theme="light"][data-contrast="high"]` has specificity `0,2,0` and handles the cases where light-theme high-contrast needs different values than dark-theme high-contrast.

### Should design tokens be defined at `:root` or on the `<html>` element directly?

They are equivalent in practice — `:root` in CSS refers to the `<html>` element and has the same specificity as the `html` type selector. The preference for `:root` is semantic: it reads as "the root of the document" and makes it clear that these are global values, not specific to the `<html>` tag's tag name. Defining tokens on `[data-theme]` selectors applied to `<html>` achieves the same cascade result since the attribute selector applies to the same node as `:root`.
