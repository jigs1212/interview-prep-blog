# Design Tokens — Usage Reference

This document maps every CSS custom property (design token) to the components that consume it in this project. The theming system is a **custom CSS variable architecture** using `data-theme` and `data-contrast` HTML attributes on `<html>`, with Tailwind CSS for layout utilities.

---

## How the Theme System Works

The system provides:

1. **CSS custom properties (design tokens)** — declared under `:root`, `[data-theme]`, and `[data-contrast]` selectors in `src/app/globals.css`.
2. **`data-theme` attribute** — set on `<html>`. Accepted values: `"dark"` (default) | `"light"`.
3. **`data-contrast` attribute** — set on `<html>`. Accepted values: `"normal"` (default) | `"high"`.
4. **Combined selector** — `[data-theme="light"][data-contrast="high"]` for maximum-contrast light mode overrides.

The variables cascade; `[data-contrast="high"]` overrides only the tokens it redefines on top of whatever `[data-theme]` has already set.

The framework (Next.js) reads `localStorage` on the **server-rendered inline script** to set `data-theme` / `data-contrast` before React hydrates, preventing any flash of wrong theme:

```ts
// src/app/layout.tsx — runs before React hydrates
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

Full CSS declaration:

```css
/* src/app/globals.css */

:root,
[data-theme="dark"] {
  --bg: #0d1117;
  --bg-secondary: #161b22;
  --fg: #e6edf3;
  --fg-muted: #8b949e;
  --border: #30363d;
  --accent: #30ff90;
  --accent-hover: #5cffab;
  --accent-muted: rgba(48, 255, 144, 0.08);
  --accent-border: rgba(48, 255, 144, 0.2);
  --accent-glow: rgba(48, 255, 144, 0.3);
  --code-bg: #0d1117;
  --code-fg: #e6edf3;
}

[data-theme="light"] {
  --bg: #f5f0e8;
  --bg-secondary: #ebe5d6;
  --fg: #1c1917;
  --fg-muted: #57534e;
  --border: #d6d0c4;
  --accent: #1a6b3c;
  --accent-hover: #15573a;
  --accent-muted: rgba(26, 107, 60, 0.08);
  --accent-border: rgba(26, 107, 60, 0.2);
  --accent-glow: rgba(26, 107, 60, 0.15);
  --code-bg: #1c1917;
  --code-fg: #f5f0e8;
}

[data-contrast="high"] {
  --border: #e6edf3;
  --fg-muted: #c9d1d9;
  --accent: #3fff9a;
  --accent-hover: #6fffb8;
  --accent-muted: rgba(63, 255, 154, 0.15);
  --accent-border: rgba(63, 255, 154, 0.35);
  --accent-glow: rgba(63, 255, 154, 0.4);
  --code-bg: #000000;
  --code-fg: #ffffff;
}

[data-theme="light"][data-contrast="high"] {
  --border: #1c1917;
  --fg-muted: #292524;
  --accent: #15573a;
  --accent-hover: #0d3d28;
  --accent-muted: rgba(21, 87, 58, 0.15);
  --accent-border: rgba(21, 87, 58, 0.35);
  --accent-glow: rgba(21, 87, 58, 0.25);
  --code-bg: #0c0a09;
  --code-fg: #fafaf9;
}
```

---

## Component Usage Map

### `src/app/globals.css`

Global application of tokens — body background, grid texture, scrollbars, and all `.prose` markdown typography:

```css
body {
  color: var(--fg);
  background: var(--bg);
  /* Matrix-style grid texture using accent-muted as grid line colour */
  background-image:
    repeating-linear-gradient(0deg,  transparent, transparent 40px, var(--accent-muted) 40px, var(--accent-muted) 41px),
    repeating-linear-gradient(90deg, transparent, transparent 40px, var(--accent-muted) 40px, var(--accent-muted) 41px);
}

/* Webkit scrollbars */
::-webkit-scrollbar-thumb        { background: var(--border); }
::-webkit-scrollbar-thumb:hover  { background: var(--fg-muted); }

/* Sidebar-specific scrollbar — accent on hover */
.sidebar-scroll::-webkit-scrollbar-thumb       { background-color: var(--border); }
.sidebar-scroll::-webkit-scrollbar-thumb:hover { background-color: var(--accent); }

/* Firefox */
* { scrollbar-color: var(--border) transparent; }

/* Prose (markdown-rendered article content) */
.prose       { color: var(--fg); }
.prose h2    { color: var(--fg);       border-bottom: 1px solid var(--border); }
.prose h3    { color: var(--fg); }
.prose p     { color: var(--fg); }
.prose a     { color: var(--accent);   }
.prose a:hover { color: var(--accent-hover); }
.prose blockquote { border-left: 3px solid var(--accent); color: var(--fg-muted); }
.prose code  { background: var(--bg-secondary); border: 1px solid var(--border); }
.prose pre   { background: var(--code-bg); color: var(--code-fg); }
.prose th    { border-bottom: 2px solid var(--border); }
.prose td    { border-bottom: 1px solid var(--border); }
.prose hr    { border-top: 1px solid var(--border); }
```

---

### `src/app/layout.tsx`

```tsx
<body className="antialiased bg-[var(--bg)] text-[var(--fg)]">
```

The inline script (shown in the "How the Theme System Works" section above) also sets `data-theme` and `data-contrast` on `<html>` before React mounts.

---

### Layout Components

#### `src/components/layout/Sidebar.tsx`

```tsx
{/* Container */}
<aside className="bg-[var(--bg)] border-r border-[var(--border)]">

  {/* Header — logo brackets and tagline in accent */}
  <div className="border-b border-[var(--border)]">
    <h1 className="text-[var(--fg)] font-bold">
      <span className="text-[var(--accent)] font-mono">[</span>
      Interview Hub
      <span className="text-[var(--accent)] font-mono">]</span>
    </h1>
    <p className="font-mono text-[var(--accent)]">$ preparing --level senior</p>
  </div>

  {/* Active nav link — accent left border + secondary bg */}
  <Link className="bg-[var(--bg-secondary)] text-[var(--fg)] border-l-[3px] border-[var(--accent)]">
    All Posts
  </Link>

  {/* Inactive nav link — muted text, secondary bg on hover */}
  <Link className="text-[var(--fg-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--fg)] border-l-[3px] border-transparent">
    All Posts
  </Link>

  {/* Category section label */}
  <div className="bg-[var(--bg-secondary)]">
    <span className="font-mono text-[var(--accent)]">{'// CATEGORIES'}</span>
  </div>

  {/* Category count badge */}
  <span className="font-mono text-[var(--accent)]">02</span>

  {/* Tag pill — active */}
  <Link className="border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]">
    react
  </Link>

  {/* Tag pill — inactive */}
  <Link className="border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
    react
  </Link>
</aside>
```

---

#### `src/components/layout/Header.tsx`

```tsx
{/* Sticky header — semi-transparent bg with backdrop blur */}
<header className="sticky top-0 z-40 bg-[var(--bg)]/95 backdrop-blur">

  {/* Inner row — bottom border aligns pixel-perfectly with sidebar header */}
  <div className="h-[60px] border-b border-[var(--border)]">

    {/* Mobile hamburger button */}
    <button className="text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-secondary)]">
      ...
    </button>

    {/* Mobile logo */}
    <Link className="font-semibold text-[var(--fg)]">
      <span className="text-[var(--accent)] font-mono">[</span>Interview Hub<span className="text-[var(--accent)] font-mono">]</span>
    </Link>

    {/* AI shortcut badge — only shown on article pages */}
    <span className="border border-[var(--accent-border)] bg-[var(--accent-muted)] text-[var(--accent)] font-mono">
      <span>AI</span>
      <span className="border-l border-[var(--accent-border)]">⌘L</span>
    </span>

  </div>
</header>

{/* Mobile menu overlay — matches sidebar styling */}
<aside className="bg-[var(--bg)] border-r border-[var(--border)]">
  <div className="border-b border-[var(--border)]">
    <h2 className="text-[var(--fg)] font-bold">
      <span className="text-[var(--accent)] font-mono">[</span>Interview Hub<span className="text-[var(--accent)] font-mono">]</span>
    </h2>
    <p className="font-mono text-[var(--accent)]">$ preparing --level senior</p>
  </div>
  <button className="text-[var(--fg-muted)] hover:text-[var(--fg)]">✕</button>
</aside>
```

---

#### `src/components/layout/Footer.tsx`

```tsx
<footer>
  <p className="text-[var(--fg-muted)]">
    Made with ♥ by{' '}
    <a
      className="text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline font-medium transition-colors"
      href="https://jigarlodaya.online"
    >
      Jigar Lodaya
    </a>
  </p>
</footer>
```

---

### UI Components

#### `src/components/ui/ThemeToggle.tsx`

Reads `document.documentElement.classList` for dark state. On click toggles `.dark` class and sets `data-theme`, then persists to `localStorage`.

```tsx
function toggle() {
  const isDark = document.documentElement.classList.toggle('dark')
  const theme = isDark ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)  // ← triggers cascade re-evaluation
  localStorage.setItem('theme', theme)
}

<button
  className="p-2 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-secondary)] transition-colors"
>
  {/* Sun or Moon SVG based on state */}
</button>
```

---

#### `src/components/ui/ContrastToggle.tsx`

Sets `data-contrast` attribute and persists to `localStorage`.

```tsx
const toggleContrast = () => {
  const next = !isHigh
  const value = next ? 'high' : 'normal'
  document.documentElement.setAttribute('data-contrast', value)  // ← triggers cascade re-evaluation
  localStorage.setItem('contrast', value)
}

<button
  className="p-2 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-secondary)] transition-colors"
>
  {/* Half-circle SVG */}
</button>
```

---

#### `src/components/ui/CategoryBadge.tsx`

```tsx
<Link
  href={`/category/${slugify(name)}/`}
  className="inline-block text-xs font-medium px-2.5 py-1 rounded
             bg-[var(--accent-muted)] text-[var(--accent)]
             hover:bg-[var(--accent-border)] transition-colors"
>
  {name}
</Link>
```

---

#### `src/components/ui/Tag.tsx`

```tsx
<Link
  href={`/tag/${encodeURIComponent(name)}/`}
  className="inline-block text-xs font-mono px-2 py-0.5 rounded
             bg-[var(--bg-secondary)] text-[var(--fg-muted)] border border-[var(--border)]
             hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
>
  {name}
</Link>
```

---

### Blog Components

#### `src/components/blog/BlogCard.tsx`

```tsx
<article className="group relative border border-[var(--border)] bg-[var(--bg-secondary)] rounded-lg p-6
                    hover:border-[var(--accent-border)] hover:shadow-[0_0_20px_var(--accent-glow)]
                    transition-all">

  {/* Date / meta in muted text */}
  <span className="text-sm font-mono text-[var(--fg-muted)]">{post.date}</span>

  {/* Title — accent colour, underline on group hover */}
  <h2 className="text-xl font-semibold text-[var(--accent)] group-hover:underline">
    {post.title}
  </h2>

  {/* Description — muted */}
  <p className="text-[var(--fg-muted)] line-clamp-2">{post.description}</p>
</article>
```

---

#### `src/components/blog/ArticleLayout.tsx`

```tsx
{/* TOC column — frosted glass panel over grid texture */}
<aside className="hidden lg:block">
  <div
    className="sticky top-24 overflow-y-auto sidebar-scroll rounded-lg px-3 py-3
               bg-[var(--bg)]/80 backdrop-blur-sm border border-[var(--border)]"
    style={{ maxHeight: 'calc(100vh - 7rem)' }}
  >
    <TableOfContents toc={toc} />
  </div>
</aside>

{/* Article column — frosted glass over grid texture */}
<article className="min-w-0 rounded-lg px-6 py-6 bg-[var(--bg)]/80 backdrop-blur-sm">
  {children}
</article>
```

---

#### `src/components/blog/TableOfContents.tsx`

```tsx
<nav>
  {/* Heading */}
  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
    On this page
  </h4>

  {/* Left border rail */}
  <ul className="space-y-1 text-sm border-l border-[var(--border)]">

    {/* Active item — accent left border + accent text */}
    <a className="block pl-4 py-1 border-l-2 -ml-px
                  border-[var(--accent)] text-[var(--accent)] font-medium">
      Introduction to React Hooks
    </a>

    {/* Inactive item — muted, border on hover */}
    <a className="block pl-4 py-1 border-l-2 -ml-px
                  border-transparent text-[var(--fg-muted)]
                  hover:text-[var(--fg)] hover:border-[var(--border)]">
      useState: Managing State
    </a>

    {/* Nested child — extra indent */}
    <a className="block pl-8 py-1 border-l-2 -ml-px
                  border-transparent text-[var(--fg-muted)]
                  hover:text-[var(--fg)] hover:border-[var(--border)]">
      Functional Updates
    </a>

  </ul>
</nav>
```

---

#### `src/components/blog/RelatedPosts.tsx`

```tsx
{/* Card link — same glow pattern as BlogCard */}
<Link
  className="block p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]
             hover:border-[var(--accent-border)] hover:shadow-[0_0_16px_var(--accent-glow)]
             transition-all"
>
  {/* Inline category badge (span, not CategoryBadge, to avoid nested <a>) */}
  <span className="inline-block text-xs font-medium px-2.5 py-1 rounded mb-2
                   bg-[var(--accent-muted)] text-[var(--accent)]">
    {post.category}
  </span>

  <h4 className="font-medium mb-1">{post.title}</h4>

  <p className="text-sm text-[var(--fg-muted)] line-clamp-2">{post.description}</p>
</Link>
```

---

#### `src/components/blog/LeadMagnet.tsx`

```tsx
{/* Submit button — text must use --bg not white, since --accent is bright green */}
<button
  type="submit"
  className="px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--bg)] text-sm font-medium
             hover:opacity-90 transition-opacity"
>
  Download Free PDF
</button>
```

---

#### `src/components/blog/Pagination.tsx`

```tsx
{/* Active page number */}
<Link className="px-3 py-2 text-sm rounded bg-[var(--accent)] text-[var(--bg)] font-medium">
  3
</Link>

{/* Inactive page number */}
<Link className="px-3 py-2 text-sm rounded border border-[var(--border)]
                 text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)]">
  4
</Link>
```

---

#### `src/components/blog/ShareButtons.tsx`

```tsx
<a
  className="p-2 rounded-lg border border-[var(--border)]
             text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--accent)]
             transition-colors"
>
  {/* LinkedIn / Twitter / WhatsApp icon SVG */}
</a>
```

---

#### `src/components/blog/ReadingTime.tsx`

```tsx
<span className="flex items-center gap-1 text-sm font-mono text-[var(--fg-muted)]">
  {/* Clock SVG */}
  {minutes} min read
</span>
```

---

#### `src/components/blog/PillarPageLink.tsx`

```tsx
<aside className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
  <p>
    This article is part of our{' '}
    <Link className="text-[var(--accent)] hover:underline">
      Senior Frontend Interview Questions
    </Link>{' '}
    guide.
  </p>
</aside>
```

---

### Search

#### `src/components/search/SearchBar.tsx`

```tsx
{/* Search input */}
<input
  className="w-full pl-10 pr-4 py-2 text-sm rounded-lg
             border border-[var(--border)] bg-[var(--bg)]
             text-[var(--fg)] placeholder:text-[var(--fg-muted)]
             focus:outline-none focus:border-[var(--accent)]
             transition-colors"
  placeholder="Search posts..."
/>

{/* Search icon */}
<svg className="text-[var(--fg-muted)]" />

{/* Results dropdown */}
<div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">

  {/* Skeleton loaders while index loads */}
  <div className="h-4 bg-[var(--bg-secondary)] rounded animate-pulse" />

  {/* Empty state */}
  <p className="text-sm text-[var(--fg-muted)]">No results for '...'</p>

  {/* Result item — active/hover */}
  <a className="block px-4 py-3 hover:bg-[var(--bg-secondary)]">

    {/* Result title */}
    <span className="font-medium text-[var(--fg)]">{item.title}</span>

    {/* Category badge */}
    <span className="text-xs px-1.5 py-0.5 rounded
                     bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent-border)]">
      {item.category}
    </span>

    {/* Result description */}
    <p className="text-[var(--fg-muted)] truncate">{item.description}</p>

  </a>
</div>
```

---

### Chat Components

#### `src/components/chat/ChatDrawer.tsx`

```tsx
{/* Drawer panel — fixed right, slides in/out */}
<div className="fixed top-0 right-0 h-full w-[320px]
                bg-[var(--bg)] border-l border-[var(--border)]
                flex flex-col transition-transform duration-300">

  {/* Header */}
  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">

    {/* Animated status dot */}
    <div
      className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"
      style={{ boxShadow: '0 0 8px var(--accent-glow)' }}
    />

    {/* "AI CHAT" label */}
    <span className="text-xs font-mono font-semibold text-[var(--accent)] tracking-wider">
      AI CHAT
    </span>

    {/* Close button */}
    <button className="text-[var(--fg-muted)] hover:text-[var(--fg)] p-1">✕</button>
  </div>

  {/* Messages scroll area */}
  <div className="flex-1 overflow-y-auto sidebar-scroll px-4 py-3">

    {/* Empty state */}
    <div className="text-center text-[var(--fg-muted)]">
      <div className="font-mono text-[var(--accent)]">&gt;_</div>
      <p>Ask me anything about this article</p>
    </div>

    {/* Thinking indicator */}
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2
                    text-sm text-[var(--fg-muted)]">
      <span className="animate-pulse">Searching article...</span>
    </div>

  </div>
</div>
```

---

#### `src/components/chat/ChatMessage.tsx`

```tsx
{/* User message — accent-tinted bubble (right-aligned) */}
<div className="max-w-[85%] rounded-lg px-3 py-2 text-sm
                bg-[var(--accent-muted)] border border-[var(--accent-border)] text-[var(--fg)]">
  {message.content}
</div>

{/* Assistant message — secondary bg bubble (left-aligned) */}
<div className="max-w-[85%] rounded-lg px-3 py-2 text-sm
                bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--fg-muted)]">
  {message.content}
</div>
```

---

#### `src/components/chat/ChatInput.tsx`

```tsx
<form className="flex gap-2 p-3 border-t border-[var(--border)]">

  {/* Text input */}
  <input
    className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2
               text-sm font-mono text-[var(--fg)] placeholder:text-[var(--fg-muted)]
               focus:outline-none focus:border-[var(--accent)]"
    placeholder="Ask about this article..."
  />

  {/* Send button — accent ghost, inverts on hover */}
  <button
    className="px-3 py-2 bg-[var(--accent-muted)] border border-[var(--accent-border)]
               text-[var(--accent)] rounded-lg text-sm font-mono
               hover:bg-[var(--accent)] hover:text-[var(--bg)]
               transition-colors disabled:opacity-50"
  >
    →
  </button>

</form>
```

---

## Tailwind Integration Pattern

All tokens are consumed inside Tailwind's arbitrary-value syntax. The table below covers every pattern used across the project:

| Pattern | Example |
|---|---|
| Solid background | `bg-[var(--bg)]` |
| Semi-transparent background | `bg-[var(--bg)]/80` |
| Text colour | `text-[var(--fg)]` |
| Muted text | `text-[var(--fg-muted)]` |
| Border | `border border-[var(--border)]` |
| Accent border | `border-[var(--accent-border)]` |
| Glow box-shadow | `shadow-[0_0_20px_var(--accent-glow)]` |
| Inline style (complex shadow) | `style={{ boxShadow: '0 0 8px var(--accent-glow)' }}` |
| Placeholder text | `placeholder:text-[var(--fg-muted)]` |
| Focus ring | `focus:border-[var(--accent)]` |
| Left border accent | `border-l-[3px] border-[var(--accent)]` |

```tsx
// Concrete examples from the codebase

// 1. Semi-transparent frosted panel
<div className="bg-[var(--bg)]/80 backdrop-blur-sm border border-[var(--border)] rounded-lg" />

// 2. Hover glow card
<article className="border border-[var(--border)] hover:border-[var(--accent-border)] hover:shadow-[0_0_20px_var(--accent-glow)]" />

// 3. Active nav item with left accent bar
<Link className="bg-[var(--bg-secondary)] border-l-[3px] border-[var(--accent)] text-[var(--fg)]" />

// 4. Ghost button that inverts on hover
<button className="bg-[var(--accent-muted)] border border-[var(--accent-border)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)]" />

// 5. Focus input
<input className="border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none" />

// 6. Animated glow dot (inline style needed for box-shadow with variable)
<div className="bg-[var(--accent)] animate-pulse" style={{ boxShadow: '0 0 8px var(--accent-glow)' }} />
```

---

## Theme Switching Flow

```
User clicks ThemeToggle
  → classList.toggle('dark') on <html>
  → setAttribute('data-theme', 'dark'|'light') on <html>
  → localStorage.setItem('theme', ...)
  → CSS cascade re-evaluates all var(--*) tokens
  → Components repaint with new colours (zero JS re-render)

User clicks ContrastToggle
  → setAttribute('data-contrast', 'high'|'normal') on <html>
  → localStorage.setItem('contrast', ...)
  → CSS cascade applies [data-contrast="high"] overrides on top of current theme

Page load (SSR / static)
  → Inline blocking script reads localStorage before React hydrates
  → Sets data-theme + data-contrast on <html> immediately
  → No flash of wrong theme — tokens resolve before first paint
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
| `LeadMagnet.tsx` | `--accent`, `--bg` |
| `Pagination.tsx` | `--accent`, `--bg`, `--border`, `--fg-muted`, `--fg` |
| `ShareButtons.tsx` | `--border`, `--fg-muted`, `--fg`, `--accent` |
| `ReadingTime.tsx` | `--fg-muted` |
| `PillarPageLink.tsx` | `--border`, `--bg-secondary`, `--accent` |
| `SearchBar.tsx` | `--fg-muted`, `--border`, `--bg`, `--fg`, `--accent`, `--bg-secondary`, `--accent-muted`, `--accent-border` |
| `ChatDrawer.tsx` | `--bg`, `--border`, `--accent`, `--accent-glow`, `--fg-muted`, `--fg`, `--bg-secondary` |
| `ChatMessage.tsx` | `--accent-muted`, `--accent-border`, `--fg`, `--bg-secondary`, `--border`, `--fg-muted` |
| `ChatInput.tsx` | `--bg-secondary`, `--border`, `--fg`, `--fg-muted`, `--accent`, `--accent-muted`, `--accent-border`, `--bg` |
