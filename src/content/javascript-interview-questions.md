---
slug: "javascript-interview-questions"
title: "JavaScript Interview Questions for Senior Developers"
description: "Master JavaScript fundamentals for senior interviews — event loop, closures, prototypes, promises, and advanced patterns with code examples."
category: "JavaScript"
subcategory: "Fundamentals"
tags: ["javascript", "event-loop", "closures", "promises", "prototypes", "interview-questions"]
date: "2026-03-23"
related: ["react-hooks-deep-dive"]
---

## Introduction

JavaScript remains the most tested language in frontend interviews, and senior-level roles demand more than surface familiarity. Interviewers expect you to explain the runtime model, articulate trade-offs between language features, and debug subtle asynchronous behavior on a whiteboard. Even if you spend most of your day in React or another framework, the underlying language mechanics are what separate senior candidates from mid-level ones.

For a complete overview of senior frontend interview topics, see our [Senior Frontend Interview Questions guide](/senior-frontend-interview-questions/).

This guide covers the JavaScript questions that appear most frequently in senior interviews. Each section builds on the previous one, starting from foundational concepts and moving toward the nuanced, scenario-based questions that hiring committees use to gauge depth of understanding.

## Beginner Concepts

### The Event Loop

JavaScript is single-threaded, meaning it can only execute one piece of code at a time. The event loop is the mechanism that allows non-blocking behavior despite this constraint. It continuously checks whether the call stack is empty and, if so, picks the next task from the task queue.

The call stack is where synchronous code executes. When you call a function, a frame is pushed onto the stack. When the function returns, the frame is popped. If the stack is not empty, no new task can begin.

The task queue (also called the callback queue or macrotask queue) holds callbacks from `setTimeout`, `setInterval`, DOM events, and I/O operations. The event loop only dequeues a task when the call stack is completely empty.

This example demonstrates how the event loop defers `setTimeout` callbacks until the synchronous code finishes.

```javascript
console.log('start')

setTimeout(() => {
	console.log('timeout')
}, 0)

console.log('end')

// Output: start, end, timeout
```

Even with a delay of zero, the `setTimeout` callback is placed in the task queue and must wait for the current synchronous execution to complete.

### Closures

A closure is a function that retains access to its lexical scope even after the outer function has returned. Every function in JavaScript forms a closure over the variables in its surrounding scope at the time of creation.

Closures are the foundation of many patterns: data privacy, partial application, memoization, and module encapsulation. Understanding them is non-negotiable for senior roles.

This example shows a closure creating a private counter that cannot be accessed directly from outside.

```javascript
function createCounter() {
	let count = 0
	return {
		increment() { return ++count },
		decrement() { return --count },
		getCount() { return count },
	}
}

const counter = createCounter()
counter.increment() // 1
counter.increment() // 2
counter.getCount()  // 2
// count is not accessible directly — it is enclosed
```

### Variable Scoping: var vs let vs const

The `var` keyword declares function-scoped variables and is hoisted to the top of its function (initialized as `undefined`). Both `let` and `const` are block-scoped and sit in a temporal dead zone from the start of the block until the declaration is reached.

This example illustrates the classic loop scoping problem with `var` and how `let` resolves it.

```javascript
// var is function-scoped — all callbacks share the same i
for (var i = 0; i < 3; i++) {
	setTimeout(() => console.log(i), 0) // 3, 3, 3
}

// let is block-scoped — each iteration gets its own i
for (let i = 0; i < 3; i++) {
	setTimeout(() => console.log(i), 0) // 0, 1, 2
}
```

Use `const` by default, `let` when reassignment is necessary, and avoid `var` entirely in modern codebases.

## Intermediate Patterns

### Promise Combinators

The three main Promise combinators serve different coordination strategies. Choosing the wrong one is a common source of production bugs.

`Promise.all` rejects as soon as any input promise rejects. `Promise.allSettled` waits for all promises to either fulfill or reject and never short-circuits. `Promise.race` resolves or rejects as soon as the first promise settles.

This example compares the behavior of each combinator when one promise rejects.

```javascript
const success = Promise.resolve('ok')
const failure = Promise.reject(new Error('fail'))

// Rejects immediately with Error('fail')
Promise.all([success, failure])
	.catch(err => console.log('all:', err.message))

// Resolves with status objects for every promise
Promise.allSettled([success, failure])
	.then(results => console.log('allSettled:', results))
// [{ status: 'fulfilled', value: 'ok' }, { status: 'rejected', reason: Error }]

// Resolves with 'ok' because success settles first
Promise.race([success, failure])
	.then(val => console.log('race:', val))
```

Use `Promise.all` when every result is required. Use `Promise.allSettled` when you need partial results even if some requests fail. Use `Promise.race` for timeouts or first-response-wins patterns.

### Prototype Chain and Object.create

JavaScript uses prototypal inheritance. Every object has an internal `[[Prototype]]` link that forms a chain. Property lookups walk this chain until the property is found or the chain ends at `null`.

`Object.create` sets the prototype of a new object directly, without invoking a constructor. This is cleaner than manipulating `.prototype` properties manually.

This example shows how `Object.create` establishes a prototype relationship.

```javascript
const animal = {
	speak() {
		return `${this.name} makes a sound`
	},
}

const dog = Object.create(animal)
dog.name = 'Rex'
dog.speak() // "Rex makes a sound"

Object.getPrototypeOf(dog) === animal // true
```

### The Four Rules of this Binding

The value of `this` depends on how a function is called, not where it is defined. These four rules are evaluated in order of precedence:

1. **new binding** — When called with `new`, `this` refers to the newly created object.
2. **Explicit binding** — `call`, `apply`, or `bind` set `this` to a specific object.
3. **Implicit binding** — When called as a method on an object (`obj.fn()`), `this` is the object.
4. **Default binding** — In non-strict mode, `this` is the global object. In strict mode, `this` is `undefined`.

Arrow functions are the exception. They do not have their own `this` and instead inherit it from the enclosing lexical scope.

### ESM vs CommonJS

ES Modules (ESM) use `import`/`export` syntax and are statically analyzable at parse time, which enables tree shaking. CommonJS uses `require()`/`module.exports` and is evaluated at runtime, meaning imports can appear inside conditionals or loops.

ESM exports are live bindings — if the exporting module changes a value, the importing module sees the updated value. CommonJS exports are value copies at the time `require()` runs. ESM is the standard for modern JavaScript; CommonJS remains dominant in Node.js legacy codebases.

## Advanced Techniques

### Microtasks vs Macrotasks

The event loop processes microtasks (Promise callbacks, `queueMicrotask`, `MutationObserver`) before moving to the next macrotask (`setTimeout`, `setInterval`, I/O). All microtasks in the queue are drained before any macrotask executes.

This example produces output that surprises many candidates. The key is that the Promise `.then` callback is a microtask and runs before the `setTimeout` macrotask.

```javascript
console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve().then(() => {
	console.log('3')
	Promise.resolve().then(() => console.log('4'))
})

console.log('5')

// Output: 1, 5, 3, 4, 2
```

Synchronous code (`1`, `5`) runs first. Then the microtask queue drains (`3`, and the nested microtask `4`). Finally, the macrotask (`2`) runs. Understanding this ordering is critical for debugging race conditions in production async code.

### Generators and Iterators

Generators are functions declared with `function*` that can pause execution with `yield` and resume later. They return an iterator object that conforms to the iterable protocol.

Generators are useful for lazy evaluation, custom iteration sequences, and implementing cooperative multitasking patterns. They also form the foundation of many async flow-control libraries.

This example demonstrates a generator that produces an infinite Fibonacci sequence, yielding values on demand.

```javascript
function* fibonacci() {
	let a = 0
	let b = 1
	while (true) {
		yield a
		;[a, b] = [b, a + b]
	}
}

const fib = fibonacci()
fib.next().value // 0
fib.next().value // 1
fib.next().value // 1
fib.next().value // 2
fib.next().value // 3
```

Because generators are lazy, this infinite sequence consumes no memory beyond the current state. You can consume values one at a time or use `for...of` to iterate a finite number of them.

### WeakMap and WeakSet

`WeakMap` holds key-value pairs where keys must be objects and are held weakly. If no other reference to the key exists, the entry is garbage collected automatically. `WeakSet` works the same way but stores only values (no key-value pairs).

Use `WeakMap` for associating metadata with objects without preventing garbage collection. Common use cases include caching computed results per DOM node, storing private data for class instances, and tracking visited objects during graph traversal.

This example attaches metadata to DOM elements without creating a memory leak.

```javascript
const elementData = new WeakMap()

function trackElement(el) {
	elementData.set(el, {
		clickCount: 0,
		lastInteraction: Date.now(),
	})
}

// When the DOM element is removed and no references remain,
// the WeakMap entry is automatically garbage collected.
```

Unlike `Map`, `WeakMap` is not iterable and has no `.size` property. This is by design — enumeration would expose garbage collection timing, which is non-deterministic.

### Structured Clone vs JSON Round-Trip

`JSON.parse(JSON.stringify(obj))` is a common deep-clone hack, but it silently drops `undefined`, functions, `Symbol` keys, `Date` objects (converts to strings), `Map`, `Set`, `RegExp`, and circular references (throws an error).

`structuredClone()` handles `Date`, `Map`, `Set`, `ArrayBuffer`, `RegExp`, `Error` objects, and circular references correctly. It does not handle functions, DOM nodes, or prototype chains.

This example highlights the differences.

```javascript
const original = {
	date: new Date(),
	set: new Set([1, 2, 3]),
	nested: { value: undefined },
}

const jsonClone = JSON.parse(JSON.stringify(original))
// jsonClone.date is a string, not a Date
// jsonClone.set is an empty object {}
// jsonClone.nested.value is missing entirely

const structuredCopy = structuredClone(original)
// structuredCopy.date is a Date object
// structuredCopy.set is a Set with values 1, 2, 3
// structuredCopy.nested.value is undefined (preserved)
```

Use `structuredClone` for data objects. If you need to clone objects with methods or class instances, implement a custom clone method or use a library.

## Scenario-Based Questions

**How would you debug an async race condition where stale data overwrites fresh data?**
Assign a monotonically increasing request ID or use an `AbortController`. Before applying the result, check whether the response corresponds to the latest request. In React, this pattern appears as the cleanup function in `useEffect` setting a `cancelled` flag. For standalone code, compare the request ID against the latest issued ID before updating state.

**How would you detect memory leaks caused by closures?**
Use Chrome DevTools heap snapshots. Take a snapshot, perform the suspected leaking operation, take another snapshot, then compare retained objects. Look for detached DOM trees and growing arrays. Closures cause leaks when they capture references to large objects (like DOM nodes or data arrays) and the closure itself is stored in a long-lived scope such as a module-level cache or an event listener that is never removed.

**How would you choose a module bundling strategy for a large application?**
Start by analyzing the dependency graph. Use code splitting at route boundaries to reduce initial bundle size. Enable tree shaking by ensuring all dependencies export ESM. For shared libraries used across micro-frontends, consider Module Federation or import maps. Measure the impact with Lighthouse and bundle analysis tools before and after changes. The goal is to minimize the critical path — total bundle size matters less than what loads on the initial request.

**How would you implement a retry mechanism with exponential backoff?**
Wrap the async operation in a loop with a configurable max retry count. On each failure, wait for `baseDelay * 2^attempt` milliseconds before retrying. Add jitter (random offset) to prevent thundering herd problems when many clients retry simultaneously. Cap the maximum delay to avoid excessively long waits. Always check whether the error is retryable — do not retry 4xx client errors.

## Rapid Fire

**What is `NaN === NaN`?**
`false`. Use `Number.isNaN()` to reliably check for `NaN`.

**What is the difference between `null` and `undefined`?**
`undefined` means a variable has been declared but not assigned. `null` is an intentional assignment representing "no value."

**What does `typeof null` return?**
`"object"`. This is a historical bug in JavaScript that has never been fixed for backward compatibility.

**What is the output of `0.1 + 0.2 === 0.3`?**
`false`. Floating-point arithmetic produces `0.30000000000000004`. Use a tolerance check or multiply to integers for comparison.

**What is the difference between `Object.freeze` and `Object.seal`?**
`Object.freeze` prevents adding, removing, and modifying properties. `Object.seal` prevents adding and removing but allows modification of existing properties.

**Can you use `await` at the top level?**
Yes, in ES modules. Top-level `await` is supported in ESM but not in CommonJS.

**What is event delegation?**
Attaching a single event listener to a parent element instead of individual listeners on each child. It relies on event bubbling and reduces memory usage for large lists.

**What is the temporal dead zone?**
The period between entering a block scope and the `let`/`const` declaration being evaluated. Accessing the variable in this zone throws a `ReferenceError`.

## Frequently Asked Questions

### What is the difference between microtasks and macrotasks?

Microtasks include Promise callbacks and `queueMicrotask` calls. Macrotasks include `setTimeout`, `setInterval`, and I/O events. The event loop drains the entire microtask queue after each macrotask completes, meaning microtasks always execute before the next macrotask begins.

### How do closures cause memory leaks?

A closure retains a reference to its entire outer scope, not just the variables it uses. If a closure captures a reference to a large data structure or a DOM node and that closure is stored in a long-lived location (such as a global event handler or a cache), the captured data cannot be garbage collected. Removing the event listener or nullifying the reference allows the garbage collector to reclaim the memory.

### What is the difference between == and ===?

The `==` operator performs type coercion before comparison, converting operands to a common type. The `===` operator checks both value and type without coercion. Senior codebases should use `===` exclusively, with the only common exception being `value == null` to check for both `null` and `undefined` in a single expression.

### When should you use WeakMap over Map?

Use `WeakMap` when the keys are objects whose lifecycle you do not control, such as DOM elements or third-party class instances. Since `WeakMap` keys are held weakly, entries are automatically removed when the key object is garbage collected. This prevents memory leaks in caches and metadata stores. Use `Map` when you need iteration, size tracking, or non-object keys.
