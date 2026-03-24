---
slug: "css-custom-properties-theming"
title: "CSS Custom Properties for Theming Interviews"
description: "CSS custom properties for theming — cascade specificity, @property registration, design tokens, Shadow DOM, and animation for senior interviews."
category: "CSS"
subcategory: "Custom Properties"
tags: ["css", "custom-properties", "theming", "cascade", "design-tokens", "accessibility"]
date: "2026-03-25"
related: ["nextjs-dark-mode-theming", "css-layout-interview-questions", "web-accessibility-deep-dive"]
---

## Beginner Concepts

CSS custom properties are variables prefixed with `--` and consumed via `var()`. Unlike Sass or Less variables that compile away into static values, custom properties exist at runtime and participate in the cascade. This distinction is the foundation of every theming system built on native CSS.

### Core Syntax and Fallbacks

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

The `var()` function accepts an optional second argument — a fallback value. This fallback is evaluated lazily: if `--text-on-accent` is defined anywhere in the cascade above `.button`, the fallback is never used. Fallbacks can themselves contain `var()` references, enabling chains like `var(--brand, var(--accent, #000))`.

### Preprocessor Variables vs Custom Properties

Sass variables resolve at **compile time** and produce static CSS. Custom properties resolve at **computed-value time** and can change without recompiling anything.

```scss
// Sass — compiled away; cannot change at runtime
$accent: #30ff90;
.button { background: $accent; }
```

```css
/* CSS — lives in the cascade; changes with a single setAttribute */
:root { --accent: #30ff90; }
.button { background: var(--accent); }
```

This runtime mutability is what makes JavaScript-free theme switching possible. When you change `--accent` on an ancestor element, every descendant using `var(--accent)` repaints automatically.

### Inheritance and the Cascade

Custom properties inherit by default. A property set on `:root` is available to every element in the document tree. Setting the same property on a more specific element overrides it for that subtree only — standard cascade rules apply.

```css
:root { --fg: #e6edf3; }
.sidebar { --fg: #8b949e; }

/* Paragraphs inside .sidebar get #8b949e */
/* Paragraphs outside .sidebar get #e6edf3 */
p { color: var(--fg); }
```

This subtree scoping is what makes component-level theme overrides possible without any JavaScript.

For a complete overview of senior frontend interview topics, see our [Senior Frontend Interview Questions guide](/senior-frontend-interview-questions/).

---

## Intermediate Patterns

### Design Token Architecture

A design token is a named design decision — a colour, spacing value, or border radius — expressed as a custom property. The key principle: **name tokens by role, not by value**.

Naming by value (`--green-500`) breaks the moment the same token needs to represent something different in a light theme. Naming by role (`--accent`) stays semantically stable across every variant. This distinction is one of the most common interview topics around theming architecture.

A well-structured token system uses two layers:

1. **Primitive tokens** — raw values like `--green-500: #30ff90` that map directly to a colour palette
2. **Semantic tokens** — role-based aliases like `--accent: var(--green-500)` that components actually consume

Components should only reference semantic tokens. The primitive layer exists solely to feed the semantic layer.

### The Four-Combo Token Pattern

A production token system needs to handle multiple independent axes. The following pattern uses `data-theme` and `data-contrast` attributes to create four distinct visual combinations from a single set of semantic token names:

```css
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

The `data-theme` attribute on `<html>` acts as a global context switch. Any element using `var(--accent)` re-resolves automatically when the attribute changes. No JavaScript re-renders, no component updates — the browser handles everything through the cascade.

### Why `data-*` Attributes Over Classes

Both `[data-theme="dark"]` and `.dark` work as selectors. Attributes are preferred because they communicate intent more clearly and do not collide with utility class names. They also compose cleanly into compound selectors — `[data-theme="light"][data-contrast="high"]` is unambiguous, while `.light.high` risks class name conflicts.

### Specificity with Data Attributes

The cascade handles multi-axis theming naturally. A single attribute selector has specificity `0,1,0`. A compound selector like `[data-theme="light"][data-contrast="high"]` has specificity `0,2,0` and overrides any single-attribute rule without needing `!important`:

```css
[data-contrast='high'] {
	--border:        #e6edf3;
	--fg-muted:      #c9d1d9;
	--accent:        #3fff9a;
	--accent-muted:  rgba(63, 255, 154, 0.15);
	--accent-border: rgba(63, 255, 154, 0.35);
	--accent-glow:   rgba(63, 255, 154, 0.4);
}

/* Compound selector: 0,2,0 specificity — beats [data-contrast] alone */
[data-theme='light'][data-contrast='high'] {
	--border:        #1c1917;
	--fg-muted:      #292524;
	--accent:        #15573a;
	--accent-muted:  rgba(21, 87, 58, 0.15);
	--accent-border: rgba(21, 87, 58, 0.35);
	--accent-glow:   rgba(21, 87, 58, 0.25);
}
```

This is the CSS-native way to model accessibility. High contrast is an independent axis layered on top of any theme — no duplication of component code required.

---

## Advanced Techniques

### `@property` Registration

Unregistered custom properties are treated as strings by the browser. This means CSS transitions and animations cannot interpolate them — the browser does not know whether the value is a colour, a length, or arbitrary text.

The `@property` rule registers a custom property with an explicit type, enabling smooth animation:

```css
@property --hue {
	syntax: '<number>';
	inherits: false;
	initial-value: 150;
}

.element {
	--hue: 150;
	background: hsl(var(--hue), 80%, 50%);
	transition: --hue 600ms ease;
}

.element:hover {
	--hue: 280;
}
```

Without `@property`, the transition would snap instantly. With it, the browser interpolates `--hue` from 150 to 280 over 600ms.

Common syntax types include `<color>`, `<length>`, `<number>`, `<percentage>`, `<integer>`, and `<length-percentage>`. You can also use `<custom-ident>` for discrete keyword values or `*` for any value (though `*` disables animation).

### Animating Theme Transitions

Combining `@property` with the token system enables smooth visual transitions when switching themes:

```css
@property --accent-color {
	syntax: '<color>';
	inherits: true;
	initial-value: #30ff90;
}

* {
	transition: --accent-color 300ms ease;
}

[data-theme='dark'] { --accent-color: #30ff90; }
[data-theme='light'] { --accent-color: #1a6b3c; }
```

The trade-off: registering many properties and applying transitions broadly can increase paint workload. Profile before shipping this in production.

### `inherits: true` vs `inherits: false`

When `inherits` is `true`, the property participates in normal CSS inheritance — children get the parent's value. When `false`, each element starts with the `initial-value` unless explicitly set. Most design tokens should use `inherits: true` because the entire point of a token system is cascade-based inheritance. Use `inherits: false` for per-element animation properties like progress indicators or opacity multipliers that should not leak to children.

### Custom Properties and Shadow DOM

Custom properties cross Shadow DOM boundaries. A property defined on `:root` in the light DOM is readable from inside a shadow root via `var()`. This makes them the standard mechanism for theming web components — the host application defines the tokens, the component consumes them.

```css
/* Light DOM — host application */
:root {
	--brand-accent: #30ff90;
	--brand-bg: #0d1117;
}
```

```css
/* Inside a shadow root — web component */
:host {
	background: var(--brand-bg);
	color: var(--brand-accent);
}
```

There is one caveat: `@property` registered properties do not reliably cross Shadow DOM boundaries in all browsers. If you need animation support inside a web component, register the property inside the shadow root as well.

### Subtree Theme Scoping

Because custom properties follow the cascade, any element can become a theme boundary. Setting `data-theme="light"` on a specific container overrides tokens for that subtree only:

```css
/* Global dark */
[data-theme='dark'] { --bg: #0d1117; --fg: #e6edf3; }

/* This section renders in light mode regardless of the global theme */
section[data-theme='light'] { --bg: #f5f0e8; --fg: #1c1917; }
```

All descendants of that section resolve `var(--bg)` and `var(--fg)` against the light values. No JavaScript required — pure cascade behaviour.

---

## Scenario-Based Questions

### How would you add a third "sepia" theme to an existing system?

Add a `[data-theme="sepia"]` block with appropriate token values. The toggle logic cycles through three states instead of two, storing `"sepia"` in the persistence layer. Every component automatically adopts sepia colours via the cascade since they reference tokens, not hardcoded values. The high-contrast layer may need a `[data-theme="sepia"][data-contrast="high"]` compound rule if the default sepia tokens do not meet WCAG requirements.

### How would you architect a token system for a component library consumed by multiple apps?

Design the library to consume semantic tokens with sensible fallbacks rather than hardcoding colours. Document the expected token names and their types. The consuming application defines those tokens in its own stylesheet, overriding the library defaults. This decouples the visual layer from component logic entirely.

```css
/* Library default */
:root { --lib-accent: var(--accent, #0066cc); }
/* Consumer overrides --accent; library picks it up automatically */
```

### How do you handle theming when components render in iframes?

Custom properties do not cross iframe boundaries — each iframe has its own document. You need to either inject the token stylesheet into the iframe's document or use `postMessage` to communicate the active theme so the iframe's own script can set the correct `data-theme` attribute. For same-origin iframes, you can also directly access `iframe.contentDocument.documentElement.setAttribute('data-theme', theme)`.

### How would you prevent a theme flash on a static site?

Place an inline blocking `<script>` in the `<head>` that reads the stored preference from `localStorage` and sets the `data-theme` attribute before the browser's first paint. The script must be synchronous (no `async` or `defer`). For a Next.js implementation of this pattern, see [Dark Mode Without Flash in Next.js](/nextjs-dark-mode-theming/).

---

## Rapid Fire

**Q: Can you animate CSS custom property values?**
A: Not without `@property` registration. Unregistered properties are strings and cannot be interpolated. Register with a `syntax` type like `<color>` or `<number>` and transitions work.

**Q: Can a custom property reference another custom property?**
A: Yes. `--accent-muted: rgba(var(--accent-rgb), 0.08)` works if `--accent-rgb` is a raw RGB triplet. Values resolve lazily at computed-value time.

**Q: Does changing `data-theme` trigger a repaint or reflow?**
A: Repaint only, assuming only colour tokens change. Reflows require geometry changes (dimensions, margins, font sizes). Keep spacing and layout values out of theme-switchable tokens.

**Q: What happens if a `var()` references an undefined property with no fallback?**
A: The property receives the `unset` value. For inherited properties, this means the inherited value. For non-inherited properties, this means the initial value. It does not cause a CSS parse error.

**Q: How do custom properties affect CSS file size compared to Sass variables?**
A: Custom properties increase the output CSS slightly because `var()` calls remain in the compiled output. Sass variables compile away entirely. The difference is negligible — usually a few hundred bytes — and is offset by eliminating duplicate rule sets for each theme variant.

---

## Frequently Asked Questions

### When should you use `@property` to register a custom property?

Register a property with `@property` when you need to animate it with CSS transitions or keyframe animations, or when you need strict type checking on its value. Unregistered properties are treated as strings and cannot be interpolated by the browser's animation engine. Common use cases include opacity multipliers, HSL hue values, gradient stops, and progress indicators that need smooth transitions.

### Does using CSS custom properties impact performance?

The overhead is negligible for most applications. Custom properties are resolved at computed-value time, so the browser only does extra work when a property value changes. The performance-sensitive scenario is deeply nested elements that all recalculate when a root token changes — but this is unavoidable with any theming approach. Avoid declaring custom properties inside frequently animated elements or scroll handlers, as that triggers unnecessary style recalculations.

### How do CSS custom properties interact with Shadow DOM?

Custom properties cross Shadow DOM boundaries by default. A property defined on `:root` in the light DOM is readable from inside a shadow root via `var()`. This makes them the primary mechanism for theming web components. However, `@property` registered properties do not cross shadow boundaries in all browsers — register them inside the shadow root if you need animation support within a web component.

### What is the difference between `:root` and `html` for defining tokens?

They refer to the same element in HTML documents. `:root` has the specificity of a pseudo-class (`0,1,0`), while `html` as a type selector has specificity `0,0,1`. In practice, this difference rarely matters because theme selectors like `[data-theme]` override both. The convention is to use `:root` for global tokens because it reads as semantically meaningful — "the root of the document" — rather than being tied to a specific tag name.

### Can you use CSS custom properties in media queries?

No. Media query conditions are evaluated before the cascade resolves, so `@media (min-width: var(--breakpoint))` does not work. Custom properties can only be used in property values, not in at-rule conditions. For dynamic breakpoints, you need JavaScript (`window.matchMedia`) or container queries, which evaluate against element dimensions rather than viewport dimensions.
