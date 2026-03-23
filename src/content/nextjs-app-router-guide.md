---
slug: "nextjs-app-router-guide"
title: "Next.js App Router Complete Guide"
description: "Everything you need to know about Next.js App Router for interviews"
category: "Next.js"
subcategory: "Routing"
tags: ["nextjs", "app-router", "server-components", "routing"]
date: "2026-03-19"
related: ["react-hooks-deep-dive", "typescript-generics-masterclass", "web-performance-interview-questions"]
---

## Understanding the App Router

The Next.js App Router, introduced in Next.js 13.4, represents a fundamental shift in how we build React applications. It leverages React Server Components by default, provides nested layouts, and introduces a new file-system based routing convention.

The key difference from the Pages Router is that every component in the `app` directory is a Server Component by default. This means components render on the server, reducing the JavaScript bundle sent to the client and improving performance.

## File-System Based Routing

The App Router uses a directory-based routing system where folders define routes and special files define UI.

### Special Files

Each route segment can export special files:

```
app/
  layout.tsx      // Shared UI for a segment and its children
  page.tsx        // Unique UI for a route, makes it publicly accessible
  loading.tsx     // Loading UI (React Suspense boundary)
  error.tsx       // Error UI (React Error Boundary)
  not-found.tsx   // Not found UI
```

### Dynamic Routes

Dynamic segments are created using square brackets in folder names:

```
app/blog/[slug]/page.tsx    // Matches /blog/any-slug
app/tag/[...tags]/page.tsx  // Catch-all: /tag/a/b/c
```

For static generation, you must export `generateStaticParams` to tell Next.js which paths to pre-render:

```tsx
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}
```

## Server Components vs Client Components

This is one of the most important concepts to understand for interviews. Server Components and Client Components serve different purposes.

### Server Components (Default)

Server Components render on the server and send HTML to the client. They can directly access backend resources, keep sensitive data on the server, and reduce client-side JavaScript.

```tsx
// This is a Server Component by default
async function BlogPost({ slug }: { slug: string }) {
  const post = await getPost(slug) // Direct data access
  return <article>{post.content}</article>
}
```

### Client Components

Client Components are opted into with the `'use client'` directive. They are needed for interactivity, browser APIs, and React hooks like `useState` and `useEffect`.

```tsx
'use client'
import { useState } from 'react'

export function SearchBar() {
  const [query, setQuery] = useState('')
  return <input value={query} onChange={e => setQuery(e.target.value)} />
}
```

### The Composition Pattern

A critical interview concept: Client Components can render Server Components passed as children. This allows you to keep most of your app as Server Components while adding interactivity where needed.

## Layouts and Templates

Layouts are one of the most powerful features of the App Router. A layout wraps its children and preserves state across navigations.

### Root Layout

Every app must have a root layout that includes `<html>` and `<body>` tags:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Nested Layouts

Layouts can be nested. Each segment's layout wraps the segments below it, enabling shared UI that does not re-render when navigating between sibling routes.

## Data Fetching

The App Router simplifies data fetching by allowing async Server Components. There is no need for `getServerSideProps` or `getStaticProps`.

### Static Generation

For static sites, data fetching happens at build time. Combined with `generateStaticParams`, you can statically generate all pages:

```tsx
export default async function Page({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  return <Article post={post} />
}
```

### Caching and Revalidation

Next.js extends the `fetch` API with caching and revalidation options. For static exports, all data is fetched at build time, making the site fast and reliable.

## Metadata API

The App Router provides a built-in Metadata API for SEO:

```tsx
export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  return {
    title: post.title,
    description: post.description,
  }
}
```

This replaces the `next/head` component and supports static and dynamic metadata generation.
