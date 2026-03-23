# Multi-Level Subcategories Design

**Date:** 2026-03-23
**Scope:** Two-level category hierarchy (Category > Subcategory) with collapsible sidebar, dedicated URLs, and breadcrumb navigation.

## Current State

- `BlogPost` type has `category` and `subcategory` fields; frontmatter already defines both.
- `subcategory` is parsed but unused — no UI, routing, or data functions reference it.
- Sidebar shows a flat category list. Category page filters by category only.
- `basePath: '/interview-prep-blog'` is set in `next.config.mjs`. Next.js auto-prepends it to `<Link>` hrefs. Manual basePath is needed only for `fetch()`, `window.location.href`, `<a>` tags, and `redirect()`.

## Types

Update `src/types/blog.ts`:

```ts
interface SubcategoryCount {
  name: string
  count: number
}

interface CategoryWithSubcategories {
  name: string
  count: number
  subcategories: SubcategoryCount[]
}
```

Make `subcategory` optional on `BlogPost`:

```ts
subcategory?: string  // was: subcategory: string
```

Add `subcategory` field to the existing `SearchIndexItem` (preserve all existing fields including `date`):

```ts
interface SearchIndexItem {
  slug: string
  title: string
  description: string
  category: string
  subcategory: string  // new — empty string if no subcategory
  tags: string[]
  date: string         // existing, keep as-is
}
```

All types are plain serializable objects (no functions, no Date objects) — safe to pass across server/client boundary.

## Data Layer

Add to `src/lib/posts.ts`:

### `getAllCategoriesWithSubcategories(): CategoryWithSubcategories[]`

Iterates all posts, groups by category, then groups subcategories within each category. Posts with no subcategory are counted in the category total but not listed as a subcategory. Returns sorted by total count descending. Subcategories within each category sorted by count descending.

### `getPostsBySubcategory(category: string, subcategory: string): BlogPost[]`

Filters posts matching both `category` (original name, not slug) and `subcategory` (original name, not slug). Returns empty array if no matches.

### Update `getAllCategories()`

Keep existing function unchanged for backward compatibility. The new `getAllCategoriesWithSubcategories()` is used only where subcategory data is needed (sidebar, layout).

### Handle missing subcategory

In `getAllPosts()`, parse subcategory as `(data.subcategory ?? '') as string`. Posts with empty/missing subcategory are valid — they belong to the category but appear in no subcategory grouping. This avoids generating broken URLs like `/category/react/undefined/`.

## Routing

### New route: `src/app/category/[name]/[sub]/page.tsx`

- `generateStaticParams()` — produces `{ name: slugify(category), sub: slugify(subcategory) }` for every unique category+subcategory pair across posts that have a non-empty subcategory.
- `findSubcategoryBySlug(categoryName, subSlug)` — local function in this file (matching pattern of `findCategoryBySlug` in `[name]/page.tsx`). Reverse lookup from slug to original subcategory name.
- Page shows filtered posts using `getPostsBySubcategory()`.
- Call `notFound()` if the subcategory slug doesn't resolve to a known subcategory.
- Metadata: title is `"Subcategory — Category | Interview Prep Hub"`.

### Existing route: `src/app/category/[name]/page.tsx`

Add `Breadcrumbs` component import and render. No other changes — continues to show all posts in a category regardless of subcategory.

## Sidebar

### Component: `src/components/layout/Sidebar.tsx`

Replace flat category list with collapsible groups.

**Props change:** Accept `CategoryWithSubcategories[]` instead of `CategoryCount[]`.

**Behavior:**
- Each category row has a chevron icon (right-pointing when collapsed, down-pointing when expanded) and the category name with total count.
- The category name is a `<Link>` to `/category/{catSlug}/`. The chevron is a `<button>` with `aria-expanded` that toggles expand/collapse without navigating.
- Subcategories render indented below the parent, each linking to `/category/{catSlug}/{subSlug}/`.
- Active state: if current path matches a subcategory URL, that subcategory is highlighted AND the parent category is auto-expanded.
- If current path matches a category URL (no subcategory), the category row itself is highlighted.
- Categories with zero subcategories render without a chevron (just a plain link, like the current flat list).
- Collapse state is local component state (`useState` with a `Set<string>` of expanded category names). Auto-expand the category that contains the active subcategory on mount.

**Deduplicate `slugify`:** Import from `@/lib/utils` instead of inlining. The `utils.ts` module uses only `date-fns` which works in client components.

### Component: `src/components/layout/Header.tsx`

Same change for mobile menu — pass `CategoryWithSubcategories[]`, render collapsible subcategories matching sidebar behavior. Import `slugify` from `@/lib/utils`.

## Layout

### `src/app/layout.tsx`

Change data fetch from `getAllCategories()` to `getAllCategoriesWithSubcategories()`. Pass result to Sidebar and Header.

## Breadcrumbs

### New component: `src/components/ui/Breadcrumbs.tsx`

Server component. Props: `items: { label: string, href?: string }[]`.

Renders: `Home > Category > Subcategory` with separator characters. Last item is plain text (current page), preceding items are `<Link>` components.

### Usage

- **Subcategory page** (`/category/[name]/[sub]/`): `[{ label: "Home", href: "/" }, { label: categoryName, href: "/category/{catSlug}/" }, { label: subcategoryName }]`
- **Category page** (`/category/[name]/`): `[{ label: "Home", href: "/" }, { label: categoryName }]`

## Blog Post Detail

### `src/components/ui/CategoryBadge.tsx`

No changes — continues to link to the top-level category.

### `src/components/ui/SubcategoryBadge.tsx` (new)

Similar to `CategoryBadge` but links to `/category/{catSlug}/{subSlug}/`. Styled with outline/lighter background to visually distinguish from category badge. Import `slugify` from `@/lib/utils`. Only rendered when the post has a non-empty subcategory.

### `src/app/blog/[slug]/page.tsx`

Render `SubcategoryBadge` next to `CategoryBadge` in the post header metadata row. Conditionally render only if `post.subcategory` is non-empty.

## Search

### `src/lib/search.ts`

Include `subcategory` field (or empty string) in the search index items.

### `scripts/generate-search-index.ts`

Include `subcategory` in the output JSON.

### `src/components/search/SearchBar.tsx`

Add `'subcategory'` to the Fuse.js `keys` array so posts are searchable by subcategory name.

## Sitemap

### `src/app/sitemap.ts`

Add subcategory page URLs with priority 0.6 (same as category pages).

## Files Changed

| File | Change |
|------|--------|
| `src/types/blog.ts` | Add `SubcategoryCount`, `CategoryWithSubcategories`; make `subcategory` optional on `BlogPost`; add `subcategory` to `SearchIndexItem` |
| `src/lib/posts.ts` | Add `getAllCategoriesWithSubcategories()`, `getPostsBySubcategory()`; handle missing subcategory |
| `src/lib/utils.ts` | Export `slugify` (already exists, ensure exported) |
| `src/app/layout.tsx` | Use `getAllCategoriesWithSubcategories()` |
| `src/components/layout/Sidebar.tsx` | Collapsible subcategory groups; import shared `slugify`; `aria-expanded` on toggle |
| `src/components/layout/Header.tsx` | Collapsible subcategory groups in mobile menu; import shared `slugify` |
| `src/app/category/[name]/[sub]/page.tsx` | New subcategory page with `generateStaticParams`, `notFound()`, breadcrumbs |
| `src/app/category/[name]/page.tsx` | Add breadcrumbs |
| `src/components/ui/Breadcrumbs.tsx` | New breadcrumb component |
| `src/components/ui/SubcategoryBadge.tsx` | New subcategory badge component |
| `src/app/blog/[slug]/page.tsx` | Add conditional `SubcategoryBadge` to post header |
| `src/lib/search.ts` | Include `subcategory` in index |
| `scripts/generate-search-index.ts` | Include `subcategory` in output |
| `src/components/search/SearchBar.tsx` | Add `'subcategory'` to Fuse.js keys |
| `src/app/sitemap.ts` | Add subcategory URLs |
