# Oat CSS Library — Usage Reference

This document maps every CSS custom property provided by the Oat library to the components that consume it in this project. The Oat library is a **design-token system**, not a component library. It exposes CSS custom properties and two HTML attribute hooks (`data-theme`, `data-contrast`) that drive the entire light/dark/high-contrast theme.

---

## How the Library Works

Oat does **not** ship pre-built component classes. It provides:

1. **CSS custom properties (design tokens)** — declared under `:root`, `[data-theme]`, and `[data-contrast]` selectors.
2. **`data-theme` attribute** — set on `<html>`. Accepted values: `"dark"` (default) | `"light"`.
3. **`data-contrast` attribute** — set on `<html>`. Accepted values: `"normal"` (default) | `"high"`.
4. **Combined selector** — `[data-theme="light"][data-contrast="high"]` for maximum-contrast light mode overrides.

The variables cascade; `[data-contrast="high"]` overrides only the tokens it redefines on top of whatever `[data-theme]` has already set.

The framework (Next.js) reads `localStorage` on the **server-rendered inline script** to set `data-theme` / `data-contrast` before React hydrates, preventing any flash of wrong theme:

```ts
// src/app/layout.tsx — runs before React
const themeScript = `(function(){
  try {
    var d = document.documentElement;
    var t = localStorage.getItem('theme');
    if (!t) { t = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light' }
    d.classList.toggle('dark', t === 'dark');
    d.setAttribute('data-theme', t);
    var c = localStorage.getItem('contrast') || 'normal';
    d.setAttribute('data-contrast', c);
  } catch(e) {}
})();`
```

---

## Design Tokens

All tokens are defined in `src/app/globals.css`.

| Token | Dark default | Light default | High-contrast override |
|---|---|---|---|
| `--bg` | `#0d1117` | `#f5f0e8` | _(unchanged)_ |
| `--bg-secondary` | `#161b22` | `#ebe5d6` | _(unchanged)_ |
| `--fg` | `#e6edf3` | `#1c1917` | _(unchanged)_ |
| `--fg-muted` | `#8b949e` | `#57534e` | `#c9d1d9` / `#292524` |
| `--border` | `#30363d` | `#d6d0c4` | `#e6edf3` / `#1c1917` |
| `--accent` | `#30ff90` | `#1a6b3c` | `#3fff9a` / `#15573a` |
| `--accent-hover` | `#5cffab` | `#15573a` | `#6fffb8` / `#0d3d28` |
| `--accent-muted` | `rgba(48,255,144,0.08)` | `rgba(26,107,60,0.08)` | higher opacity |
| `--accent-border` | `rgba(48,255,144,0.2)` | `rgba(26,107,60,0.2)` | higher opacity |
| `--accent-glow` | `rgba(48,255,144,0.3)` | `rgba(26,107,60,0.15)` | higher opacity |
| `--code-bg` | `#0d1117` | `#1c1917` | `#000000` / `#0c0a09` |
| `--code-fg` | `#e6edf3` | `#f5f0e8` | `#ffffff` / `#fafaf9` |

---

## Component Usage Map

### `src/app/globals.css`

Global application of tokens:

| Usage | Tokens |
|---|---|
| `body` background + grid texture | `--bg`, `--accent-muted` |
| Scrollbar track / thumb / hover | `--border`, `--fg-muted`, `--accent`, `--bg` |
| `.sidebar-scroll` custom scrollbar | `--border`, `--bg`, `--accent` |
| `.prose` typography (h2, h3, p, a, strong, blockquote, code, pre, table, hr) | `--fg`, `--fg-muted`, `--accent`, `--accent-hover`, `--border`, `--bg-secondary`, `--code-bg`, `--code-fg` |

---

### `src/app/layout.tsx`

| Usage | Tokens |
|---|---|
| `<body>` base text + background | `--bg`, `--fg` |
| Theme/contrast attribute injection via inline script | `data-theme`, `data-contrast` |

---

### Layout Components

#### `src/components/layout/Sidebar.tsx`

| Element | Tokens |
|---|---|
| `<aside>` container | `--bg`, `--border` |
| Header section | `--border` |
| Logo `[Interview Hub]` brackets | `--accent` (font-mono) |
| Tagline `$ preparing --level senior` | `--accent` (font-mono) |
| Active nav link | `--bg-secondary`, `--fg`, `--accent` (left border) |
| Inactive nav link | `--fg-muted`, `--bg-secondary` (hover) |
| Category section label `// CATEGORIES` | `--bg-secondary`, `--accent` (font-mono) |
| Category count badges | `--accent` (font-mono) |
| Tag pills (active) | `--accent`, `--accent-muted`, `--accent-border` |
| Tag pills (inactive / hover) | `--border`, `--fg-muted`, `--accent` |

#### `src/components/layout/Header.tsx`

| Element | Tokens |
|---|---|
| `<header>` background | `--bg` (with `/95` opacity + `backdrop-blur`) |
| Inner div bottom border | `--border` |
| Hamburger / mobile logo | `--fg-muted`, `--fg`, `--bg-secondary`, `--accent` |
| AI shortcut badge | `--accent-border`, `--accent-muted`, `--accent` |
| Mobile menu overlay sidebar | `--bg`, `--border` |

#### `src/components/layout/Footer.tsx`

| Element | Tokens |
|---|---|
| Footer text | `--fg-muted` |
| Author link | `--accent`, `--accent-hover` |

---

### UI Components

#### `src/components/ui/ThemeToggle.tsx`

Reads `document.documentElement.classList` for dark state. On click:
- Toggles `.dark` class on `<html>`
- Sets `data-theme="dark"` or `"light"` on `<html>`
- Persists to `localStorage('theme')`

| Element | Tokens |
|---|---|
| Toggle button | `--fg-muted`, `--fg`, `--bg-secondary` (hover) |

#### `src/components/ui/ContrastToggle.tsx`

On click:
- Sets `data-contrast="high"` or `"normal"` on `<html>`
- Persists to `localStorage('contrast')`

| Element | Tokens |
|---|---|
| Toggle button | `--fg-muted`, `--fg`, `--bg-secondary` (hover) |

#### `src/components/ui/CategoryBadge.tsx`

| Element | Tokens |
|---|---|
| Badge link | `--accent-muted`, `--accent`, `--accent-border` (hover) |

#### `src/components/ui/Tag.tsx`

| Element | Tokens |
|---|---|
| Tag link (default) | `--bg-secondary`, `--fg-muted`, `--border` |
| Tag link (hover) | `--accent`, `--accent` (border + text) |
| Font | `font-mono` (Geist Mono) |

---

### Blog Components

#### `src/components/blog/BlogCard.tsx`

| Element | Tokens |
|---|---|
| Card border (default) | `--border`, `--bg-secondary` |
| Card border + glow (hover) | `--accent-border`, `--accent-glow` (box-shadow) |
| Post title | `--accent` |
| Post description | `--fg-muted` |
| Date / meta | `--fg-muted` |

#### `src/components/blog/ArticleLayout.tsx`

| Element | Tokens |
|---|---|
| TOC aside panel | `--bg` (80% opacity) + `backdrop-blur-sm`, `--border` |
| Article column | `--bg` (80% opacity) + `backdrop-blur-sm` |

#### `src/components/blog/TableOfContents.tsx`

| Element | Tokens |
|---|---|
| TOC heading "On this page" | `--fg-muted` |
| TOC list border-l | `--border` |
| Active item | `--accent` (border + text) |
| Inactive item / hover | `--fg-muted`, `--fg`, `--border` |

#### `src/components/blog/RelatedPosts.tsx`

| Element | Tokens |
|---|---|
| Post link card (default) | `--border`, `--bg-secondary` |
| Post link card (hover) | `--accent-border`, `--accent-glow` (box-shadow) |
| Category inline badge | `--accent-muted`, `--accent` |
| Post description | `--fg-muted` |

#### `src/components/blog/LeadMagnet.tsx`

| Element | Tokens |
|---|---|
| Submit button | `--accent`, `--bg` (text on accent bg) |

#### `src/components/blog/Pagination.tsx`

| Element | Tokens |
|---|---|
| Active page | `--accent`, `--bg` (text on accent bg) |
| Inactive / hover | `--border`, `--fg-muted`, `--fg` |

#### `src/components/blog/ShareButtons.tsx`

| Element | Tokens |
|---|---|
| Share buttons | `--border`, `--fg-muted`, `--fg` (hover), `--accent` (hover) |

#### `src/components/blog/ReadingTime.tsx`

| Element | Tokens |
|---|---|
| Icon + text | `--fg-muted` |

#### `src/components/blog/PillarPageLink.tsx`

| Element | Tokens |
|---|---|
| Pillar link container | `--border`, `--bg-secondary` |
| Link accent | `--accent` |

---

### Search

#### `src/components/search/SearchBar.tsx`

| Element | Tokens |
|---|---|
| Search icon | `--fg-muted` |
| Input (default) | `--border`, `--bg`, `--fg`, `--fg-muted` (placeholder) |
| Input focus ring | `--accent` |
| Dropdown container | `--bg`, `--border` |
| Skeleton loaders | `--bg-secondary` |
| Result item hover / active | `--bg-secondary` |
| Result title | `--fg` |
| Result category badge | `--accent-muted`, `--accent`, `--accent-border` |
| Result description | `--fg-muted` |

---

### Chat Components

#### `src/components/chat/ChatDrawer.tsx`

| Element | Tokens |
|---|---|
| Drawer panel | `--bg`, `--border` |
| Header accent dot (animated pulse) | `--accent`, `--accent-glow` (box-shadow) |
| Header "AI CHAT" label | `--accent` (font-mono) |
| Close button | `--fg-muted`, `--fg` |
| Messages area (sidebar-scroll) | _uses `.sidebar-scroll` CSS class_ |
| Empty state `>_` | `--accent` |
| Thinking / loading bubble | `--bg-secondary`, `--border`, `--fg-muted` |

#### `src/components/chat/ChatMessage.tsx`

| Element | Tokens |
|---|---|
| User message bubble | `--accent-muted`, `--accent-border`, `--fg` |
| Assistant message bubble | `--bg-secondary`, `--border`, `--fg-muted` |

#### `src/components/chat/ChatInput.tsx`

| Element | Tokens |
|---|---|
| Text input | `--bg-secondary`, `--border`, `--fg`, `--fg-muted` (placeholder), `--accent` (focus border) |
| Send button (default) | `--accent-muted`, `--accent-border`, `--accent` |
| Send button (hover) | `--accent`, `--bg` (text becomes bg-coloured) |

---

## Tailwind Integration Pattern

All tokens are used inside Tailwind's arbitrary-value syntax:

```tsx
// Background
className="bg-[var(--bg)]"
className="bg-[var(--bg)]/80"          // with opacity modifier

// Text
className="text-[var(--fg)]"
className="text-[var(--fg-muted)]"

// Border
className="border border-[var(--border)]"
className="border-[var(--accent-border)]"

// Box shadow (glow effect)
className="shadow-[0_0_20px_var(--accent-glow)]"

// Inline style (when arbitrary value is too complex for Tailwind)
style={{ boxShadow: '0 0 8px var(--accent-glow)' }}
```

---

## Theme Switching Flow

```
User clicks ThemeToggle
  → classList.toggle('dark') on <html>
  → setAttribute('data-theme', 'dark'|'light') on <html>
  → localStorage.setItem('theme', ...)
  → CSS cascade re-evaluates all var(--*) tokens
  → All components re-render with new color values (no re-render, pure CSS)

User clicks ContrastToggle
  → setAttribute('data-contrast', 'high'|'normal') on <html>
  → localStorage.setItem('contrast', ...)
  → CSS cascade applies [data-contrast="high"] overrides on top of current theme
```

---

## File Summary

| File | Tokens used |
|---|---|
| `globals.css` | All 12 tokens |
| `layout.tsx` | `--bg`, `--fg` |
| `Sidebar.tsx` | `--bg`, `--bg-secondary`, `--fg`, `--fg-muted`, `--border`, `--accent`, `--accent-muted`, `--accent-border` |
| `Header.tsx` | `--bg`, `--fg`, `--fg-muted`, `--bg-secondary`, `--border`, `--accent`, `--accent-muted`, `--accent-border` |
| `Footer.tsx` | `--fg-muted`, `--accent`, `--accent-hover` |
| `ThemeToggle.tsx` | `--fg-muted`, `--fg`, `--bg-secondary` |
| `ContrastToggle.tsx` | `--fg-muted`, `--fg`, `--bg-secondary` |
| `CategoryBadge.tsx` | `--accent-muted`, `--accent`, `--accent-border` |
| `Tag.tsx` | `--bg-secondary`, `--fg-muted`, `--border`, `--accent` |
| `BlogCard.tsx` | `--border`, `--bg-secondary`, `--fg-muted`, `--accent`, `--accent-border`, `--accent-glow` |
| `ArticleLayout.tsx` | `--bg`, `--border` |
| `TableOfContents.tsx` | `--fg-muted`, `--border`, `--accent`, `--fg` |
| `RelatedPosts.tsx` | `--border`, `--bg-secondary`, `--accent-muted`, `--accent`, `--accent-border`, `--accent-glow`, `--fg-muted` |
| `SearchBar.tsx` | `--fg-muted`, `--border`, `--bg`, `--fg`, `--accent`, `--bg-secondary`, `--accent-muted`, `--accent-border` |
| `ChatDrawer.tsx` | `--bg`, `--border`, `--accent`, `--accent-glow`, `--fg-muted`, `--fg`, `--bg-secondary` |
| `ChatMessage.tsx` | `--accent-muted`, `--accent-border`, `--fg`, `--bg-secondary`, `--border`, `--fg-muted` |
| `ChatInput.tsx` | `--bg-secondary`, `--border`, `--fg`, `--fg-muted`, `--accent`, `--accent-muted`, `--accent-border`, `--bg` |
