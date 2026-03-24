---
slug: "css-custom-properties-theming"
title: "CSS Custom Properties for Theming: Dark Mode, Contrast & Beyond"
description: "Master CSS custom properties for senior interviews — covers theming architecture, dark mode without flash, high-contrast a11y, and Tailwind integration patterns."
category: "CSS"
subcategory: "Custom Properties"
tags: ["css", "custom-properties", "dark-mode", "theming", "accessibility"]
date: "2026-03-25"
related: ["css-layout-interview-questions", "web-accessibility-deep-dive"]
---

## Introduction

CSS custom properties — commonly called CSS variables — are one of the most powerful primitives available to frontend developers today. Unlike preprocessor variables (Sass, Less), they live in the cascade, are readable and writable at runtime from JavaScript, and enable entire theming systems without a single line of JavaScript for the visual rendering itself.

For senior engineers, the questions go well beyond `var(--color)`. Interviewers test whether you understand cascade specificity with custom properties, the difference between registered and unregistered properties, performance implications, and how to architect a multi-theme system that is both accessible and flash-free. For a complete overview of senior frontend interview topics, see our [Senior Frontend Interview Questions guide](/senior-frontend-interview-questions/).

This post walks through building a production-grade theming system from scratch, using the same approach used in this blog — `data-theme` / `data-contrast` attributes, design tokens, Tailwind arbitrary-value integration, and a no-flash persistence layer.

---

## What Are CSS Custom Properties?

CSS custom properties are variables prefixed with `--` and consumed via `var()`. Unlike preprocessor variables which are compiled away, custom properties exist at runtime and participate in the cascade.

The following demonstrates the core syntax and cascade behaviour:

```css
:root {
  --color-accent: #30ff90;
}

.button {
  background: var(--color-accent);
  /* Fallback if the variable is not defined */
  color: var(--text-on-accent, #000000);
}
```

The `var()` function accepts an optional second argument — a fallback value. This is evaluated lazily: if `--text-on-accent` is set anywhere in the cascade above `.button`, the fallback is never used.

### Why Custom Properties Beat Preprocessor Variables

The critical interview distinction: Sass variables are resolved at **compile time** and produce static CSS. CSS custom properties resolve at **paint time** and can change without re-parsing or re-compiling styles.

```scss
// Sass — compiled away; cannot change at runtime
$accent: #30ff90;
.button { background: $accent; }
```

```css
/* CSS — lives in the cascade; can change with a single setAttribute */
:root { --accent: #30ff90; }
.button { background: var(--accent); }
```

This runtime mutability is what makes JavaScript-free theme switching possible.

---

## Designing a Token System

A design token is a named design decision — a colour, spacing value, border radius — expressed as a custom property. The key is to name tokens by **role**, not by **value**.

Naming by value (`--green-500`) breaks the moment the same token needs to represent something different in light mode. Naming by role (`--accent`) stays semantically stable across themes.

The following token set drives the entire theming layer of this blog:

```css
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

Notice there is no class-based approach (`.dark`, `.light`). The `data-theme` attribute on `<html>` acts as a global context switch. Any component on the page automatically picks up the correct values because every `var(--*)` call re-resolves against the cascade whenever an ancestor's attribute changes.

### Why `data-theme` Over `.dark`

Both work. The practical advantage of attributes is that they communicate intent more clearly and do not pollute the class list alongside utility classes. They also compose cleanly — `[data-theme="light"][data-contrast="high"]` is an unambiguous compound selector that cannot accidentally match `.dark.high` class conflicts.

---

## High Contrast as a Second Axis

Accessibility standards (WCAG 2.1 AA) require a 4.5:1 contrast ratio for normal text and 3:1 for large text. Some users enable high-contrast mode in their operating system, and your site should respect or augment that preference.

A second attribute `data-contrast` makes high contrast an independent toggle that layers on top of whichever theme is active:

```css
[data-contrast="high"] {
  --border:        #e6edf3;
  --fg-muted:      #c9d1d9;
  --accent:        #3fff9a;
  --accent-muted:  rgba(63, 255, 154, 0.15);
  --accent-border: rgba(63, 255, 154, 0.35);
  --accent-glow:   rgba(63, 255, 154, 0.4);
}

/* Light theme + high contrast needs its own overrides */
[data-theme="light"][data-contrast="high"] {
  --border:        #1c1917;
  --fg-muted:      #292524;
  --accent:        #15573a;
  --accent-muted:  rgba(21, 87, 58, 0.15);
  --accent-border: rgba(21, 87, 58, 0.35);
  --accent-glow:   rgba(21, 87, 58, 0.25);
}
```

Because the cascade evaluates selectors in specificity order, `[data-theme][data-contrast]` (two attribute selectors, specificity `0,2,0`) correctly overrides the single-attribute rules (`0,1,0`). No `!important` required.

---

## Switching Themes Without a Flash

The hardest part of server-rendered theming. If you read `localStorage` inside a `useEffect`, React has already painted the page once with the server-side default, causing a visible colour flash. The fix is an **inline blocking script** that runs before the browser's first paint.

```tsx
// app/layout.tsx
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

Key details:
- The script is wrapped in an IIFE and uses `try/catch` to handle environments where `localStorage` is unavailable (private browsing, server-side rendering).
- `suppressHydrationWarning` on `<html>` prevents React from complaining that the server-rendered `data-theme` attribute differs from what it expected — it will differ intentionally since the script may have changed it.
- The script checks `prefers-color-scheme` as the default so first-time visitors get the correct theme without any stored preference.

### Common Interview Pitfall

Interviewers often ask: why not just set a cookie from the server and read it during SSR to avoid the script entirely? The answer: cookies work, but they require the server to read and apply the theme on every request, complicating caching strategies. The inline script approach is stateless on the server and works with any static deployment.

---

## Integrating Custom Properties with Tailwind CSS

Tailwind's arbitrary value syntax bridges the gap between utility classes and CSS custom properties:

```tsx
// Background and text
<div className="bg-[var(--bg)] text-[var(--fg)]">

// With opacity modifier (Tailwind 3.x+)
<div className="bg-[var(--bg)]/80 backdrop-blur-sm">

// Border
<div className="border border-[var(--border)]">

// Glow effect via box-shadow
<article className="hover:shadow-[0_0_20px_var(--accent-glow)]">

// When arbitrary value won't accept the syntax, use inline style
<div style={{ boxShadow: '0 0 8px var(--accent-glow)' }}>
```

This hybrid approach is intentional: Tailwind handles **layout and spacing** (which are not theme-dependent), while CSS custom properties handle **colour and visual tone** (which must switch at runtime). Never hardcode colour utility classes like `bg-gray-900` in a themeable component — they ignore the cascade.

### What Tailwind Cannot Do

Tailwind's JIT compiler generates class names at build time. `bg-[var(--bg)]` generates one static class whose `background` value contains a `var()` reference — it works. However, dynamic class names like `` `bg-[${color}]` `` computed in JSX do not work unless Tailwind's class-scanning step encounters the literal string. Always prefer named tokens consumed via `var()` over dynamic string interpolation.

---

## Component Patterns

### Active State Navigation

The sidebar uses a `data-*` pattern via conditional class application. The key point is that active state colour comes from `--accent` and `--bg-secondary` — tokens, not hardcoded values:

```tsx
<Link
  className={`px-3 py-2 rounded-md text-sm transition-colors ${
    isActive
      ? 'bg-[var(--bg-secondary)] text-[var(--fg)] border-l-[3px] border-[var(--accent)]'
      : 'text-[var(--fg-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--fg)] border-l-[3px] border-transparent'
  }`}
>
  All Posts
</Link>
```

### Glow on Hover (Accent-coloured Shadow)

Blog cards use `--accent-glow` — a low-opacity rgba version of the accent — as a `box-shadow` to create a subtle focus indicator consistent with the theme:

```tsx
<article className="border border-[var(--border)] bg-[var(--bg-secondary)] rounded-lg hover:border-[var(--accent-border)] hover:shadow-[0_0_20px_var(--accent-glow)] transition-all">
```

When the user switches to light mode, `--accent-glow` changes from a bright green rgba to a deep-green rgba automatically. No component code changes.

### Glassmorphism Panel

Adding `backdrop-blur` with a semi-transparent token creates a frosted-glass panel effect without any additional JavaScript:

```tsx
<aside className="bg-[var(--bg)]/80 backdrop-blur-sm border border-[var(--border)] rounded-lg">
  <TableOfContents />
</aside>
```

The `/80` opacity modifier tells Tailwind to apply 80% opacity to whatever `--bg` resolves to. The backdrop filter then blurs whatever is rendered behind the element — in this case the grid-texture background — while keeping the content legible.

---

## Scenario-Based Questions

### How Would You Add a Third "Sepia" Theme?

Add a `[data-theme="sepia"]` block to your CSS with appropriate token values. Update `ThemeToggle` to cycle through three states instead of two, storing `"sepia"` in `localStorage`. The inline script in `layout.tsx` already reads from `localStorage` generically — no changes needed there. Every component automatically adopts sepia colours via the cascade.

### What Happens if `localStorage` Is Unavailable?

The inline script is wrapped in `try/catch`. If `localStorage` throws (private browsing in some browsers, third-party cookie restrictions), the `catch` block prevents a runtime error. The result is the site renders with its default theme (dark). A progressively enhanced fallback could read `prefers-color-scheme` as the default, which the script already does for first-time visitors.

### How Do You Prevent a Contrast-Toggle Flash on Navigation?

In a Next.js App Router app, `layout.tsx` is rendered once and persists across client-side navigations. The inline script runs only on full page loads, not soft navigations. Since the `data-contrast` attribute is set on `<html>` which persists across route changes, there is no flash. If you were using a multi-page app without a persistent shell, you would need the script in each page's `<head>`.

---

## Rapid Fire

**Q: Can you animate CSS custom property values?**
A: Not directly with CSS transitions — the browser does not know how to interpolate an unregistered custom property. Use `@property` to register the property with a syntax type, and then transitions work. Example: `@property --accent-opacity { syntax: '<number>'; inherits: false; initial-value: 1; }`.

**Q: What is the difference between `inherit: true` and `inherit: false` in `@property`?**
A: `inherits: true` means the property participates in normal CSS inheritance (children inherit the value from parents). `inherits: false` means each element starts fresh with the `initial-value`. Most design tokens should use `inherits: true`.

**Q: Can a custom property reference another custom property?**
A: Yes. `--accent-muted: rgba(var(--accent-rgb), 0.08)` works if `--accent-rgb` is a raw RGB triplet. The values are resolved lazily at computed-value time.

**Q: Does changing `data-theme` trigger a repaint or reflow?**
A: It triggers a repaint (colour change) but not a reflow (layout change), assuming only colour tokens change. Avoiding reflows is why spacing and layout values should not be in theme-switchable tokens.

**Q: How do you test theming in Playwright?**
A: Set `page.addInitScript` to inject `localStorage.setItem('theme', 'light')` before navigation, or use `page.evaluate` to call `document.documentElement.setAttribute('data-theme', 'light')` after navigation. Both approaches work without modifying production code.

---

## Frequently Asked Questions

### What is the difference between CSS custom properties and Sass variables?

Sass variables are resolved at compile time and produce static CSS values. They cannot change at runtime without recompiling the stylesheet. CSS custom properties resolve at paint time, participate in the cascade, are inherited by child elements, and can be read and written from JavaScript via `getComputedStyle` and `style.setProperty`. This runtime mutability makes CSS custom properties the correct choice for any theming system that switches visually without a page reload.

### When should you use `@property` to register a custom property?

Register a property with `@property` when you need to animate it with CSS transitions or keyframe animations, or when you need strict type checking on its value. Unregistered properties are treated as strings and cannot be interpolated by the browser's animation engine. Use `@property` for properties like opacity multipliers, HSL hue values, or progress indicators that you want to animate smoothly.

### How do you handle theming in a component library that is consumed by applications with different themes?

Design the library to consume CSS custom properties with sensible fallbacks rather than hardcoding colours. Document the expected token names your components rely on. The consuming application defines those tokens in its own stylesheet. This is the approach the Oat library uses — it defines the tokens, and every component in the application references them, allowing the library to remain theme-agnostic.

### Does using CSS custom properties impact performance?

The overhead is negligible for most applications. Custom properties are resolved at computed-value time, not paint time, so the browser only does extra work when a property value changes. The performance-sensitive scenario is having deeply nested elements that all recalculate when a root token changes — this is unavoidable with any theming approach. Avoid declaring custom properties inside frequently animated elements or scroll handlers, as that triggers unnecessary recalculations.

### How do CSS custom properties interact with Shadow DOM?

Custom properties cross Shadow DOM boundaries. A property defined on `:root` in the light DOM is readable from inside a shadow root via `var()`. This makes them the standard mechanism for theming web components — the host application defines the token, the component consumes it. However, `@property` registered properties do not cross Shadow DOM boundaries in all browsers, so register them inside the shadow root if you need animation support.
