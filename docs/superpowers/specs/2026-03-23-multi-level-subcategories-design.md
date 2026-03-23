# Multi-Level Subcategories Design

**Date:** 2026-03-23
**Scope:** Two-level category hierarchy (Category > Subcategory) with collapsible sidebar, dedicated URLs, and breadcrumb navigation.

## Current State

- `BlogPost` type has `category` and `subcategory` fields; frontmatter already defines both.
- `subcategory` is parsed but unused — no UI, routing, or data functions reference it.
- Sidebar shows a flat category list. Category page filters by category only.

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

Add `subcategory` to `SearchIndexItem`:

```ts
interface SearchIndexItem {
  slug: string
  title: string
  description: string
  category: string
  subcategory: string  // new
  tags: string[]
}
```

## Data Layer

Add to `src/lib/posts.ts`:

### `getAllCategoriesWithSubcategories(): CategoryWithSubcategories[]`

Iterates all posts, groups by category, then groups subcategories within each category. Returns sorted by total count descending. Subcategories within each category sorted by count descending.

### `getPostsBySubcategory(category: string, subcategory: string): BlogPost[]`

Filters posts matching both `category` (original name, not slug) and `subcategory` (original name, not slug).

### Update `getAllCategories()`

Keep existing function unchanged for backward compatibility. The new `getAllCategoriesWithSubcategories()` is used only where subcategory data is needed (sidebar, layout).

## Routing

### New route: `src/app/category/[name]/[sub]/page.tsx`

- `generateStaticParams()` — produces `{ name: slugify(category), sub: slugify(subcategory) }` for every unique category+subcategory pair across all posts.
- `findSubcategoryBySlug(category, subSlug)` — reverse lookup from slug to original subcategory name, similar to existing `findCategoryBySlug`.
- Page shows filtered posts using `getPostsBySubcategory()`.
- Metadata: title is `"Subcategory — Category | Interview Prep Hub"`.
- Empty state if no posts found.

### Existing route: `src/app/category/[name]/page.tsx`

No changes. Continues to show all posts in a category regardless of subcategory.

## Sidebar

### Component: `src/components/layout/Sidebar.tsx`

Replace flat category list with collapsible groups.

**Props change:** Accept `CategoryWithSubcategories[]` instead of `CategoryCount[]`.

**Behavior:**
- Each category row has a chevron icon (right-pointing when collapsed, down-pointing when expanded) and the category name with total count.
- Clicking the category row toggles expand/collapse of its subcategories.
- Subcategories render indented below the parent, each linking to `/category/{catSlug}/{subSlug}/`.
- Active state: if current path matches a subcategory URL, that subcategory is highlighted AND the parent category is auto-expanded.
- If current path matches a category URL (no subcategory), the category row itself is highlighted.
- Collapse state is local component state (`useState` with a `Set<string>` of expanded category names). Auto-expand the category that contains the active subcategory.

### Component: `src/components/layout/Header.tsx`

Same change for mobile menu — pass `CategoryWithSubcategories[]`, render collapsible subcategories matching sidebar behavior.

## Layout

### `src/app/layout.tsx`

Change data fetch from `getAllCategories()` to `getAllCategoriesWithSubcategories()`. Pass result to Sidebar and Header.

## Breadcrumbs

### New component: `src/components/ui/Breadcrumbs.tsx`

Server component. Props: `items: { label: string, href?: string }[]`.

Renders: `Home > Category > Subcategory` with separator characters. Last item is plain text (current page), preceding items are links.

### Usage

- **Subcategory page** (`/category/[name]/[sub]/`): `[{ label: "Home", href: "/" }, { label: categoryName, href: "/category/{catSlug}/" }, { label: subcategoryName }]`
- **Category page** (`/category/[name]/`): `[{ label: "Home", href: "/" }, { label: categoryName }]`

## Blog Post Detail

### `src/components/ui/CategoryBadge.tsx`

No changes — continues to link to the top-level category.

### `src/components/ui/SubcategoryBadge.tsx` (new)

Similar to `CategoryBadge` but links to `/category/{catSlug}/{subSlug}/`. Styled slightly differently (lighter background or outline style) to visually distinguish from the category badge.

### `src/app/blog/[slug]/page.tsx`

Render `SubcategoryBadge` next to `CategoryBadge` in the post header metadata row.

## Search Index

### `src/lib/search.ts`

Include `subcategory` field in the search index items so posts are searchable by subcategory.

### `scripts/generate-search-index.ts`

Include `subcategory` in the output JSON.

## Sitemap

### `src/app/sitemap.ts`

Add subcategory page URLs with priority 0.6 (same as category pages).

## Files Changed

| File | Change |
|------|--------|
| `src/types/blog.ts` | Add `SubcategoryCount`, `CategoryWithSubcategories`; update `SearchIndexItem` |
| `src/lib/posts.ts` | Add `getAllCategoriesWithSubcategories()`, `getPostsBySubcategory()` |
| `src/app/layout.tsx` | Use `getAllCategoriesWithSubcategories()` |
| `src/components/layout/Sidebar.tsx` | Collapsible subcategory groups |
| `src/components/layout/Header.tsx` | Collapsible subcategory groups in mobile menu |
| `src/app/category/[name]/[sub]/page.tsx` | New subcategory page |
| `src/app/category/[name]/page.tsx` | Add breadcrumbs |
| `src/components/ui/Breadcrumbs.tsx` | New breadcrumb component |
| `src/components/ui/SubcategoryBadge.tsx` | New subcategory badge component |
| `src/app/blog/[slug]/page.tsx` | Add `SubcategoryBadge` to post header |
| `src/lib/search.ts` | Include `subcategory` in index |
| `scripts/generate-search-index.ts` | Include `subcategory` in output |
| `src/app/sitemap.ts` | Add subcategory URLs |
