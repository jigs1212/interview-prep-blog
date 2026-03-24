---
slug: "react-state-immutability-mutation-pitfalls"
title: "React State Immutability: Why Mutating State Directly Breaks Your App"
description: "Understand React state immutability deeply — covers reference equality, silent re-render failures, useEffect traps, and patterns interviewers test."
category: "React"
subcategory: "Hooks"
tags: ["react", "useState", "immutability", "hooks", "state-management", "interview-prep"]
date: "2026-03-24"
difficulty: "intermediate"
readTime: "12"
related: ["react-useeffect-deep-dive", "react-rendering-and-reconciliation", "react-usereducer-vs-usestate"]
---

You're in a live coding round. The interviewer pastes this and asks: "Does this component re-render correctly?"

```tsx
const [todoItems, setTodoItems] = useState([{ name: "Task A", done: false }]);

const handleUpdate = () => {
  const copy = todoItems;
  copy[0].name = "Task B";
  setTodoItems(copy);
};
```

You say yes. You're wrong. And the interviewer knows it.

---

## What is React State Immutability and Why Interviewers Care

**Immutability** in React state means: never modify an existing state object or array in place. Always return a new reference when updating state.

This surfaces constantly in senior interviews because it's a filter question. It separates candidates who have only used React from those who understand how React decides whether to re-render. Getting this wrong in a live coding round signals that you'd ship silent bugs to production.

Interviewers at product companies — especially those using React 18 concurrent features — use this topic to test your mental model of React's rendering engine, not just your API knowledge.

---

## What is React State Immutability and the Mental Model Behind It

React does not track *what changed inside your state*. It tracks *whether your state reference changed*.

Every time you call `setState`, React runs a single check:

```
Object.is(previousState, nextState)
```

If that returns `true`, React bails out. No diff. No re-render. Completely silent.

<!-- IMAGE: react-reference-equality-check.png | Alt: Diagram showing React's Object.is comparison between previous and next state references during a setState call -->

```
setState(newValue)
        │
        ▼
Object.is(prev, newValue)
        │
   ┌────┴────┐
  true      false
   │          │
 bail out   schedule re-render
 (no render) (fiber work loop)
```

This is why mutation is dangerous. When you write `copy[0].name = "Task B"` and `copy` is the same reference as `todoItems`, you've changed the data in memory — but React's check sees the same reference and does nothing.

The UI is now lying. The DOM shows "Task A". Memory holds "Task B".

---

## Why `const copy = todoItems` Is Not a Copy

This is the most common misconception, and the root of every mutation bug.

JavaScript arrays and objects are **reference types**. Assigning them to a new variable copies the pointer — not the data.

```tsx
const todoItems = [{ name: "Task A", done: false }];
const copy = todoItems;

copy === todoItems; // true — same reference in memory
copy[0] === todoItems[0]; // true — same nested object too
```

Mutating `copy[0].name` mutates `todoItems[0].name`. They are the same object.

This is provable without any serialization tricks:

```tsx
const original = [{ name: "Task A" }];
const alias = original;

alias[0].name = "Task B";

console.log(original[0].name); // "Task B" — original is mutated
console.log(alias === original); // true — same reference throughout
```

> 🔍 **Interviewer's lens:** They're checking whether you know the difference between reference assignment and cloning, and whether you can explain why React's equality check fails as a result.

---

## Shallow vs. Deep Clone — Know the Difference

Understanding cloning depth is critical for correctly updating state with nested objects.

### Shallow Clone

A shallow clone creates a new top-level container, but nested objects inside still share references with the original.

```tsx
const original = [{ name: "Task A", meta: { priority: "high" } }];
const shallow = [...original]; // New array, same nested objects

shallow === original;         // false ✅ — new array reference
shallow[0] === original[0];   // true ❌ — same nested object

shallow[0].name = "Task B";
console.log(original[0].name); // "Task B" — still mutated!
```

A spread at the top level is enough when your state is a **flat array of primitives**. For arrays of objects, you need to spread the nested objects too:

```tsx
// ✅ Immutable update for array of objects
const updated = todoItems.map((item, i) =>
  i === 0 ? { ...item, name: "Task B" } : item
);
setTodoItems(updated);
```

### Deep Clone

A deep clone fully decouples all levels. Use `structuredClone` in modern environments:

```tsx
// ✅ Use structuredClone for complex nested state
const deepCopy = structuredClone(todoItems);
deepCopy[0].meta.priority = "low"; // Original untouched
setTodoItems(deepCopy);
```

`structuredClone` is native in modern browsers and Node 17+. It handles `Date`, `Map`, `Set`, and circular references — things `JSON.parse(JSON.stringify(...))` cannot.

> 🔍 **Interviewer's lens:** "How would you safely update a deeply nested property in state?" — This is the answer they want. Candidates who reach for `JSON.parse(JSON.stringify(...))` expose that they haven't kept up with the platform.

---

## How Mutation Silently Breaks `useState` and `useEffect`

### The Re-render Failure

```tsx
// ❌ No re-render — same reference returned to setState
const handleMarkDone = (id: number) => {
  const task = taskList.find(t => t.id === id);
  task!.done = true;       // Direct mutation
  setTaskList(taskList);   // Object.is(prev, taskList) → true → bails out
};

// ✅ New reference triggers the re-render
const handleMarkDone = (id: number) => {
  setTaskList(prev =>
    prev.map(task => task.id === id ? { ...task, done: true } : task)
  );
};
```

### The useEffect Stale Trap

**This is a critical caveat that catches senior candidates off guard.**

`useEffect` dependency comparison also uses `Object.is`. Mutate state without creating a new reference and any effect watching that state will never re-fire:

```tsx
// ❌ Effect fires only on mount — mutation doesn't create a new reference
useEffect(() => {
  syncToServer(taskList);
}, [taskList]);

// Somewhere else:
taskList[0].done = true; // Mutation — taskList reference unchanged
setTaskList(taskList);   // React skips render, effect never re-runs
```

The server never receives the update. The bug is completely silent.

The functional `setState` form prevents stale closure bugs — but it does **not** protect against mutation. You can still mutate inside the updater and return the same reference:

```tsx
// ❌ Functional form doesn't save you if you mutate prev
setTaskList(prev => {
  prev[0].done = true; // Mutates the existing object
  return prev;         // Same reference → no re-render
});

// ✅ Spread creates a new object reference
setTaskList(prev =>
  prev.map(task => task.id === targetId ? { ...task, done: true } : task)
);
```

> 🔍 **Interviewer's lens:** "Does using the functional setState form prevent mutation bugs?" — The answer is no. That one-line clarification is what separates a good answer from a great one.

---

## Correct Immutable Update Patterns

Every common state operation, done correctly:

```tsx
const [tasks, setTasks] = useState<Task[]>([
  { id: 1, name: "Design review", done: false },
  { id: 2, name: "Write tests", done: false },
]);

// Add
setTasks(prev => [...prev, { id: 3, name: "Ship it", done: false }]);

// Update by id
setTasks(prev =>
  prev.map(task => task.id === 1 ? { ...task, done: true } : task)
);

// Remove
setTasks(prev => prev.filter(task => task.id !== 2));

// Reorder (sort returns new array — safe)
setTasks(prev => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
```

For deeply nested state, Immer eliminates the spread pyramid:

```tsx
import { useImmer } from "use-immer";

const [tasks, updateTasks] = useImmer([
  { id: 1, name: "Design review", meta: { priority: "high", assignee: "Priya" } },
]);

// Looks like mutation — Immer produces a new immutable reference via Proxy
updateTasks(draft => {
  draft[0].meta.priority = "low";
});
```

Immer uses JavaScript `Proxy` to intercept writes and build a new structural tree. Only the nodes that changed are recreated — unchanged nodes are shared with the previous state. Redux Toolkit uses Immer internally.

---

## Gotchas & Pitfalls

### Gotcha: `sort()` and `reverse()` mutate in place

**What you might think:** `setTasks(tasks.sort(...))` creates a new array.

**What actually happens:** `Array.prototype.sort()` mutates the original array and returns the same reference. `Object.is(prev, sorted)` returns `true`. No re-render.

**Fix:**

```tsx
// ❌ Mutates original, no re-render
setTasks(tasks.sort((a, b) => a.name.localeCompare(b.name)));

// ✅ Spread first to create a new array before sorting
setTasks([...tasks].sort((a, b) => a.name.localeCompare(b.name)));
```

---

### Gotcha: `push`, `pop`, `splice` — all return mutated originals

**What you might think:** `setTasks(tasks.push(newTask))` adds an item and re-renders.

**What actually happens:** `Array.prototype.push` mutates `tasks` in place and returns the new *length* — not the array. You'd be calling `setTasks(3)`. Your state is now a number.

**Fix:** Use spread or `concat` instead:

```tsx
// ❌ Wrong on two levels — mutates AND passes wrong value
setTasks(tasks.push(newTask));

// ✅ Correct
setTasks(prev => [...prev, newTask]);
```

---

### Gotcha: Mutation in a `useCallback` or event handler doesn't throw

**What you might think:** React Strict Mode would catch direct mutations.

**What actually happens:** Strict Mode double-invokes the **render function** and certain hooks to surface side effects inside them. It does not catch mutations that happen in event handlers or callbacks — those run outside Strict Mode's detection scope.

**Why it matters:** You can't rely on Strict Mode as a safety net for mutation bugs in handlers.

---

### Gotcha: React 18 auto-batching compounds stale mutation bugs

In React 18, all `setState` calls are batched — including those inside `setTimeout` and native event handlers. If you mutate state and call `setState` multiple times in the same batch, React only processes one re-render. If any of those `setState` calls pass stale mutated references, the final state can be unpredictable.

**Fix:** Always use the functional update form inside async callbacks:

```tsx
// ✅ Functional form always works with React 18 batching
setTimeout(() => {
  setTaskList(prev => [...prev, newTask]);
  setIsLoading(false);
}, 0);
```

---

## Scenario-Based Questions

### Q: "Your component's list UI isn't updating after a user checks off a task. How do you debug it?"

**What the interviewer expects:**
- Don't jump to code. Diagnose the cause category first.
- Explain the two possible failure modes: mutation (same reference) vs. `setState` not being called at all.
- Show systematic debugging.

**Strong answer outline:**

First, check if `setState` is being called at all — add a `console.log` inside the handler. If it is, the next question is whether the reference changed. Add `Object.is(prev, next)` logging inside the updater:

```tsx
setTaskList(prev => {
  const next = /* your update */;
  console.log("Same ref?", Object.is(prev, next)); // Should be false
  return next;
});
```

If `Object.is` returns `true`, you have a mutation. Find where the existing reference is being returned unchanged.

**Bonus points:** Mention React DevTools Profiler — if the component shows no render at all for that interaction, it confirms the state reference didn't change.

---

### Q: "When would you reach for Immer over manual spread in a production codebase?"

**What the interviewer expects:** A tradeoff-aware answer — not "Immer is always better."

**Strong answer outline:**

Manual spread is fine for shallow state (1-2 levels). Use Immer when:

- State nesting exceeds 2 levels (spread chains become unreadable and error-prone).
- Multiple team members update the same state shape — Immer's "write like mutation" syntax is easier to review.
- You're migrating from a class component pattern where mutation was natural.

The cost: Immer adds ~3KB gzipped and a Proxy-based overhead. For hot paths with thousands of operations per second, measure before committing. For typical UI state, it's negligible.

For a broader look at state update patterns, see [useReducer vs useState for complex state](/blog/react-usereducer-vs-usestate).

---

### Q: "A junior dev on your team says 'I used `structuredClone` before mutating state, so it's fine.' Are they right?"

**What the interviewer expects:** You should recognize the misuse pattern and explain why it's still wrong.

**Strong answer outline:**

`structuredClone` before mutating means they cloned, mutated the clone, but then never called `setState` with the new reference — or they cloned, mutated the original after cloning, which defeats the purpose.

```tsx
// ❌ Clone is wasted — original is still mutated, setState gets same ref
const clone = structuredClone(taskList);
taskList[0].done = true; // Mutates original
setTaskList(taskList);   // Same reference

// ✅ Correct usage — clone, update the clone, set the clone
const next = structuredClone(taskList);
next[0].done = true;
setTaskList(next); // New reference → re-render
```

The question tests whether you can trace reference identity through multiple operations.

---

## Rapid-Fire Interview Questions

**Q: Does spreading an array (`[...arr]`) give you a safe deep clone?**
A: No. It creates a new array but nested objects still share references with the original. For arrays of objects, spread the nested objects too: `arr.map(item => ({ ...item }))`.

**Q: What does `Object.is(a, b)` return for two different empty arrays?**
A: `false`. Two distinct array literals `[] === []` is `false` — they're different references in memory. `Object.is` is functionally identical to `===` for objects and arrays.

**Q: Can you safely call `Array.prototype.map` on state without worrying about mutation?**
A: Yes — `map` always returns a new array. The returned items, however, are shallow copies of your callback's return value. If you return `item` without spreading, the nested reference is unchanged.

**Q: `useState` with an object: you update one property via spread — does React re-render other components subscribed to the same state?**
A: Yes, if they're in the same component tree reading from the same state. React doesn't compare individual properties — any state update (new reference) triggers the full re-render of the owning component and its subtree unless memoized.

**Q: Does Immer perform a deep clone of your entire state tree on every update?**
A: No. Immer uses structural sharing — only the nodes along the mutation path are recreated. Unchanged nodes share references with the previous state. This makes it performant even for large state objects.

**Q: You call `setProfile(prev => prev)` — does React re-render?**
A: No. Returning the same reference from the updater function is an explicit bail-out signal. React skips the re-render. This is how you can short-circuit updates inside the functional form.

**Q: Does `useReducer` have the same mutation gotchas as `useState`?**
A: Yes, identical. `useReducer` uses the same `Object.is` check on the value your reducer returns. Return the same reference from a reducer and React skips the re-render.

**Q: What's wrong with using `JSON.parse(JSON.stringify(state))` for deep cloning?**
A: It drops `undefined` values, `Date` objects (converted to strings), `Map`, `Set`, `Symbol`, and circular references — all silently. Use `structuredClone` instead, which handles all of these correctly.

---

## Cheat Sheet

| Operation | Safe Pattern | Trap to Avoid |
|---|---|---|
| Update object field | `{ ...prev, field: newVal }` | `prev.field = newVal` |
| Update item in array | `prev.map(item => item.id === id ? { ...item, field: val } : item)` | `prev[i].field = val` |
| Add to array | `[...prev, newItem]` | `prev.push(newItem)` |
| Remove from array | `prev.filter(item => item.id !== id)` | `prev.splice(i, 1)` |
| Sort array | `[...prev].sort(...)` | `prev.sort(...)` |
| Deep update | `structuredClone(prev)` then mutate clone | Nested spread at wrong level |
| Complex nested state | `useImmer` | Chained spread pyramid |
| Async handlers | `setState(prev => ...)` functional form | `setState(currentStateVar)` |

**Remember these before your interview:**

1. `const copy = arr` is a reference alias, not a copy. Always.
2. `Object.is` — React's single equality check. Same reference = no re-render.
3. `sort()`, `reverse()`, `push()`, `splice()` mutate in place. Spread before sorting.
4. Functional `setState` prevents stale closures. It does NOT prevent mutation.
5. `structuredClone` beats `JSON.parse(JSON.stringify(...))` in every way.

---

## Frequently Asked Questions

### Why doesn't React throw an error when you mutate state directly?

React has no way to observe mutations inside your data structures. It only runs `Object.is` at the moment `setState` is called. Direct mutations happen at the JavaScript engine level — React is never notified. This is a language-level limitation, not a React oversight. It's why mutation bugs are so dangerous: no error, no warning, just a silently stale UI.

### Does React state immutability work the same way in Next.js as in plain React?

Yes — `useState` and `useReducer` follow identical rules regardless of whether you're in a Next.js App Router Client Component or a plain React app. The distinction in Next.js is that **Server Components have no state at all** — `useState` cannot be used in them. Immutability is purely a Client Component concern. See [React rendering and reconciliation](/blog/react-rendering-and-reconciliation) for how this connects to the RSC model.

### Can I mutate state in a `useRef` instead of `useState` to avoid the re-render issue?

Yes — `useRef` holds a mutable ref object whose `.current` property you can mutate freely without triggering re-renders. That's precisely its use case: values that need to persist across renders but don't affect the UI. If your value needs to drive a UI update, it must live in `useState` or `useReducer`, and immutability rules apply.

### Is Immer safe to use with React 18 concurrent features?

Yes. Because Immer produces a new immutable reference on every `updateState` call, it's fully compatible with React 18's concurrent renderer, automatic batching, and `startTransition`. The Proxy-based mechanism finalizes the new state synchronously before returning — there's no async magic that could conflict with React's scheduler.

### Why does `useSelector` in Redux re-render my component even after a "no-op" state mutation?

If you mutate state in a Redux reducer and return the same reference, `useSelector` won't re-render (same check applies). But if you use Redux Toolkit (which uses Immer), accidental mutations in reducers are caught in development and an error is thrown. This is one concrete advantage of RTK over hand-rolled reducers.
