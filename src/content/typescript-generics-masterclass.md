---
slug: "typescript-generics-masterclass"
title: "TypeScript Generics Masterclass"
description: "Master TypeScript generics for senior developer interviews"
category: "TypeScript"
subcategory: "Advanced"
tags: ["typescript", "generics", "type-system", "advanced-types"]
date: "2026-03-18"
related: ["react-hooks-deep-dive", "nextjs-app-router-guide"]
---

## What Are Generics?

Generics are one of TypeScript's most powerful features. They allow you to write code that works with multiple types while maintaining full type safety. Think of generics as type parameters — just as functions accept value parameters, generic types accept type parameters.

The simplest generic is the identity function:

```typescript
function identity<T>(value: T): T {
  return value
}

const num = identity(42)      // type: number
const str = identity('hello') // type: string
```

Without generics, you would need to use `any` (losing type safety) or write separate functions for each type (violating DRY).

## Generic Constraints

Constraints let you restrict what types a generic can accept. This is crucial for writing practical generic code.

### The extends Keyword

Use `extends` to constrain a generic type:

```typescript
function getLength<T extends { length: number }>(value: T): number {
  return value.length
}

getLength('hello')    // OK: string has length
getLength([1, 2, 3])  // OK: array has length
getLength(42)          // Error: number has no length
```

### keyof Constraint

A common interview pattern combines generics with `keyof` to create type-safe property access:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const person = { name: 'Alice', age: 30 }
getProperty(person, 'name') // type: string
getProperty(person, 'age')  // type: number
getProperty(person, 'foo')  // Error: 'foo' is not a key
```

## Generic Interfaces and Types

Generics shine when defining reusable data structures and API contracts.

### Generic Interfaces

```typescript
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

type UserResponse = ApiResponse<User>
type PostResponse = ApiResponse<Post[]>
```

### Generic Type Aliases

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }
```

Note the default type parameter `E = Error`. This is a common pattern that provides a sensible default while allowing customization.

## Conditional Types

Conditional types are advanced generics that select types based on conditions. They follow the pattern `T extends U ? X : Y`.

### Basic Conditional Types

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false
```

### Distributive Conditional Types

When a conditional type acts on a union, it distributes over each member:

```typescript
type NonNullable<T> = T extends null | undefined ? never : T

type C = NonNullable<string | null | undefined> // string
```

This is how many of TypeScript's built-in utility types work internally.

## Mapped Types

Mapped types create new types by transforming each property of an existing type.

### Built-in Utility Types

Understanding how built-in utilities work is a common interview topic:

```typescript
// Partial<T> - makes all properties optional
type Partial<T> = {
  [K in keyof T]?: T[K]
}

// Required<T> - makes all properties required
type Required<T> = {
  [K in keyof T]-?: T[K]
}

// Readonly<T> - makes all properties readonly
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

// Pick<T, K> - selects subset of properties
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

### Custom Mapped Types

You can create powerful custom transformations:

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface Person {
  name: string
  age: number
}

type PersonGetters = Getters<Person>
// { getName: () => string; getAge: () => number }
```

## infer Keyword

The `infer` keyword lets you extract types within conditional types. This is an advanced topic that frequently appears in senior interviews.

```typescript
type ReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never

type UnpackPromise<T> = T extends Promise<infer U> ? U : T

type A = UnpackPromise<Promise<string>> // string
type B = UnpackPromise<number>          // number
```

### Recursive Types with infer

```typescript
type DeepUnpackPromise<T> = T extends Promise<infer U>
  ? DeepUnpackPromise<U>
  : T

type C = DeepUnpackPromise<Promise<Promise<string>>> // string
```

## Practical Patterns

### Generic React Components

Generics are essential for building reusable React components:

```tsx
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

### Generic API Clients

```typescript
async function fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  const response = await fetch(endpoint)
  return response.json() as Promise<ApiResponse<T>>
}

const users = await fetchApi<User[]>('/api/users')
```

These patterns demonstrate how generics enable code reuse without sacrificing type safety — a fundamental principle for production TypeScript codebases.
