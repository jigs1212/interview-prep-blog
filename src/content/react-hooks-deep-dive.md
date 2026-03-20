---
slug: "react-hooks-deep-dive"
title: "React Hooks Deep Dive"
description: "Complete guide to React hooks for senior interviews"
category: "React"
subcategory: "Hooks"
tags: ["react", "hooks", "useState", "useEffect"]
date: "2026-03-20"
related: ["useEffect-patterns", "custom-hooks-guide"]
---

## Introduction to React Hooks

React Hooks revolutionized how we write components by allowing function components to manage state and side effects. Introduced in React 16.8, hooks eliminated the need for class components in most scenarios. Understanding hooks deeply is essential for any senior React developer interview.

Hooks follow two fundamental rules: they must be called at the top level of a component (never inside loops, conditions, or nested functions), and they can only be called from React function components or custom hooks. These rules exist because React relies on the order of hook calls to maintain state between renders.

## useState: Managing Component State

The `useState` hook is the most fundamental hook. It returns a state variable and a setter function. Unlike class component state, `useState` can hold any value type — not just objects.

### Functional Updates

When the next state depends on the previous state, always use the functional update form:

```tsx
const [count, setCount] = useState(0)
setCount(prev => prev + 1)
```

This ensures correctness when multiple updates are batched together. A common interview question involves demonstrating why `setCount(count + 1)` called three times only increments by one, while `setCount(prev => prev + 1)` correctly increments by three.

### Lazy Initialization

If the initial state is expensive to compute, pass a function to `useState`:

```tsx
const [data, setData] = useState(() => computeExpensiveValue())
```

The function only runs on the initial render, avoiding unnecessary computation on re-renders.

## useEffect: Synchronizing with External Systems

The `useEffect` hook lets you synchronize a component with an external system. This is one of the most misunderstood hooks and a frequent interview topic.

### The Mental Model

Think of `useEffect` not as a lifecycle method, but as a synchronization mechanism. Each effect describes a relationship between your component's state and some external system.

```tsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId)
  connection.connect()
  return () => connection.disconnect()
}, [serverUrl, roomId])
```

### Common Pitfalls

One of the most common mistakes is missing dependencies in the dependency array. React expects every reactive value used inside the effect to be listed as a dependency. The exhaustive-deps ESLint rule helps catch these issues.

Another pitfall is using `useEffect` for things that do not require it. Deriving values from props or state should happen during rendering, not in an effect. This is a key concept that interviewers frequently test.

## useCallback and useMemo: Performance Optimization

These hooks help prevent unnecessary re-renders and expensive recomputations.

### useCallback

`useCallback` memoizes a function reference. It is primarily useful when passing callbacks to child components that use `React.memo`:

```tsx
const handleClick = useCallback(() => {
  doSomething(a, b)
}, [a, b])
```

### useMemo

`useMemo` memoizes a computed value. Use it when a calculation is genuinely expensive:

```tsx
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name))
}, [items])
```

### When Not to Optimize

A critical interview insight: premature optimization with `useCallback` and `useMemo` can actually hurt performance by adding overhead. Only optimize when you have measured a performance problem. React is fast by default.

## useRef: Mutable References

The `useRef` hook creates a mutable reference that persists across renders without triggering re-renders. It has two primary use cases: accessing DOM elements and storing mutable values.

```tsx
const inputRef = useRef<HTMLInputElement>(null)
const previousValue = useRef(value)
```

Understanding why `useRef` does not cause re-renders when mutated is a common interview question. The ref object is stable across renders — React does not track changes to `.current`.

## Custom Hooks: Composing Logic

Custom hooks are the primary mechanism for reusing stateful logic between components. They are regular JavaScript functions that call other hooks.

### Best Practices

Custom hooks should start with "use" and encapsulate a single concern. They should return only what consumers need — avoid exposing internal implementation details. A well-designed custom hook makes the component code read like a description of what it does, not how it does it.
