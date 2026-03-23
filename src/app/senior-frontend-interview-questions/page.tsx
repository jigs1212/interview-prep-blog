import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { SITE_URL, SITE_NAME, generateWebSiteJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo'
import LeadMagnet from '@/components/blog/LeadMagnet'

const PILLAR_TITLE = 'Senior Frontend Interview Questions — Complete Guide'
const PILLAR_DESCRIPTION = 'Comprehensive guide to senior frontend developer interview questions covering React, TypeScript, Next.js, accessibility, and system design with code examples.'
const PILLAR_URL = `${SITE_URL}/senior-frontend-interview-questions/`

export const metadata: Metadata = {
	title: PILLAR_TITLE,
	description: PILLAR_DESCRIPTION,
	keywords: [
		'senior frontend interview questions',
		'react interview questions',
		'typescript interview questions',
		'nextjs interview questions',
		'frontend developer interview prep',
		'senior developer interview preparation',
		'web accessibility interview',
		'frontend system design',
	],
	alternates: { canonical: PILLAR_URL },
	openGraph: {
		title: PILLAR_TITLE,
		description: PILLAR_DESCRIPTION,
		url: PILLAR_URL,
		type: 'article',
		siteName: SITE_NAME,
	},
	twitter: {
		card: 'summary_large_image',
		title: PILLAR_TITLE,
		description: PILLAR_DESCRIPTION,
	},
}

interface PillarQuestion {
	question: string
	answer: string
	code?: string
	codeLang?: string
}

interface TopicSection {
	title: string
	slug: string
	categoryMatch: string
	description: string
	questions: PillarQuestion[]
}

const topics: TopicSection[] = [
	{
		title: 'React',
		slug: 'react',
		categoryMatch: 'react',
		description: 'React remains the dominant UI library for frontend roles. Senior interviews test your understanding of hooks internals, rendering behavior, state management patterns, and performance optimization — not just API knowledge.',
		questions: [
			{
				question: 'How does React batching work, and how did it change in React 18?',
				answer: 'React batches multiple state updates into a single re-render for performance. Before React 18, batching only worked inside React event handlers. React 18 introduced automatic batching, which groups updates in promises, setTimeout, and native event handlers as well.',
			},
			{
				question: 'What causes stale closures in useEffect, and how do you fix them?',
				answer: 'Stale closures happen when a useEffect callback captures a variable from a previous render and never sees the updated value. This occurs when the dependency array is missing the variable. Fix it by adding the variable to the dependency array or by using a ref to hold the latest value.',
				code: `const latest = useRef(value)
latest.current = value

useEffect(() => {
	const id = setInterval(() => {
		console.log(latest.current) // always fresh
	}, 1000)
	return () => clearInterval(id)
}, [])`,
			},
			{
				question: 'When should you use useCallback vs useMemo vs React.memo?',
				answer: 'useCallback memoizes a function reference so child components receiving it as a prop do not re-render unnecessarily. useMemo memoizes a computed value to avoid expensive recalculations. React.memo wraps a component to skip re-rendering when its props are shallowly equal. Use them only when profiling shows a real performance issue.',
			},
			{
				question: 'How does the reconciliation algorithm (diffing) work?',
				answer: 'React compares the previous and next virtual DOM trees using a heuristic O(n) algorithm. It assumes elements of different types produce different trees, and uses keys to match children in lists. When a key or type changes, React unmounts the old subtree and mounts a new one rather than patching.',
			},
			{
				question: 'What are the tradeoffs between controlled and uncontrolled components?',
				answer: 'Controlled components store form state in React via useState and update on every change, giving you full control for validation and conditional logic. Uncontrolled components let the DOM manage state and read values via refs on submit. Controlled adds more re-renders but better predictability; uncontrolled is simpler for basic forms.',
			},
			{
				question: 'How do you architect state management for a large application?',
				answer: 'Keep state as close to where it is used as possible. Use component state for local UI, context for shared theme or auth data, and an external store like Zustand or Redux for complex cross-cutting state. Avoid putting everything in global state — co-locate state with the feature that owns it.',
			},
			{
				question: 'What is the difference between useLayoutEffect and useEffect?',
				answer: 'useEffect runs asynchronously after the browser paints, while useLayoutEffect runs synchronously after DOM mutations but before the browser paints. Use useLayoutEffect when you need to read layout measurements or make DOM changes that must be visible in the same frame to avoid visual flicker.',
				code: `useLayoutEffect(() => {
	const { height } = ref.current.getBoundingClientRect()
	setHeight(height) // updates before paint
}, [])`,
			},
			{
				question: 'How do you implement optimistic updates in React?',
				answer: 'Apply the expected change to local state immediately before the server responds. If the request succeeds, the UI is already correct. If it fails, roll back to the previous state and show an error. React 19 introduces the useOptimistic hook to streamline this pattern.',
				code: `const [items, setItems] = useState(initialItems)

async function handleDelete(id: string) {
	const prev = items
	setItems(items.filter(i => i.id !== id)) // optimistic
	try { await api.delete(id) }
	catch { setItems(prev) } // rollback
}`,
			},
		],
	},
	{
		title: 'TypeScript',
		slug: 'typescript',
		categoryMatch: 'typescript',
		description: 'TypeScript proficiency is expected at the senior level. Interviewers assess your ability to use generics, conditional types, mapped types, and type narrowing to write type-safe code — not just adding annotations to JavaScript.',
		questions: [
			{
				question: 'How do generics provide type safety without sacrificing flexibility?',
				answer: 'Generics let you write functions and types that work with any type while preserving the specific type information at each call site. The type parameter acts as a placeholder that gets filled in by the caller or inferred from arguments, so you get reusability without falling back to any.',
				code: `function first<T>(arr: T[]): T | undefined {
	return arr[0]
}
const n = first([1, 2, 3])  // inferred as number | undefined
const s = first(['a', 'b']) // inferred as string | undefined`,
			},
			{
				question: 'What are conditional types and when would you use them?',
				answer: 'Conditional types use the syntax T extends U ? X : Y to select a type based on a condition. They are powerful for building utility types that transform other types. Combined with infer, you can extract parts of a type, like pulling the return type from a function signature.',
				code: `type Unwrap<T> = T extends Promise<infer U> ? U : T
type A = Unwrap<Promise<string>> // string
type B = Unwrap<number>          // number`,
			},
			{
				question: 'How do mapped types like Partial, Required, and Pick work internally?',
				answer: 'Mapped types iterate over the keys of an existing type using the in keyof syntax and produce a new type with transformed properties. Partial adds the ? modifier to make all properties optional, Required removes it with -?, and Pick selects a subset of keys.',
			},
			{
				question: 'What is the difference between type and interface?',
				answer: 'Both define object shapes, but interface supports declaration merging and is extendable with extends. Type aliases are more flexible — they can represent unions, intersections, tuples, and mapped types. For object shapes either works, but interface is idiomatic for public API contracts and type for unions and computed types.',
			},
			{
				question: 'How does type narrowing work with discriminated unions?',
				answer: 'A discriminated union has a shared literal property (the discriminant) across all members. When you check the discriminant in a conditional, TypeScript narrows the type to the matching member automatically. This gives you exhaustive type safety without manual type assertions.',
				code: `type Result =
	| { status: 'ok'; data: string }
	| { status: 'error'; message: string }

function handle(r: Result) {
	if (r.status === 'ok') return r.data    // narrowed
	return r.message                         // narrowed
}`,
			},
			{
				question: 'What are template literal types and how are they useful?',
				answer: 'Template literal types use backtick syntax to construct string literal types from other types. They are useful for typing event names, CSS values, or route patterns where the string has a known structure. Combined with unions, they can generate many valid string combinations automatically.',
			},
			{
				question: 'How do you type higher-order components and render props?',
				answer: 'For HOCs, use generics to preserve the wrapped component props while adding or removing injected props. For render props, type the render function as a prop that accepts the data and returns ReactNode. Both patterns require careful generic signatures to maintain type inference at the call site.',
			},
			{
				question: 'What is declaration merging and when does it matter?',
				answer: 'Declaration merging is when TypeScript combines multiple declarations of the same name into a single definition. Interfaces with the same name merge their members, which is how you extend third-party types like Window or ProcessEnv. Type aliases do not merge — a duplicate name is a compile error.',
			},
		],
	},
	{
		title: 'Next.js',
		slug: 'nextjs',
		categoryMatch: 'next.js',
		description: 'Next.js is the leading React framework for production applications. Senior candidates should understand the App Router, server components, data fetching strategies, caching behavior, and how to optimize for performance and SEO.',
		questions: [
			{
				question: 'What is the difference between Server Components and Client Components?',
				answer: 'Server Components render on the server and send HTML to the client with zero JavaScript bundle cost. Client Components run in the browser and are needed for interactivity, hooks, and browser APIs. By default, all components in the App Router are Server Components unless you add the "use client" directive.',
			},
			{
				question: 'How does the App Router differ from the Pages Router?',
				answer: 'The App Router uses file-system conventions with layout.tsx, page.tsx, and loading.tsx for nested layouts and streaming. It defaults to Server Components and supports React Suspense natively. The Pages Router uses getStaticProps/getServerSideProps and ships all components as Client Components.',
			},
			{
				question: 'What are the different data fetching strategies and when do you use each?',
				answer: 'Use fetch with cache: "force-cache" for static data that rarely changes. Use cache: "no-store" for dynamic data that must be fresh on every request. Use revalidate for ISR where data is cached but refreshed at a time interval. Choose based on how fresh the data needs to be versus how fast the page needs to load.',
			},
			{
				question: 'How does Next.js caching work across the request lifecycle?',
				answer: 'Next.js has four cache layers: the Request Memoization cache deduplicates fetch calls within a single render, the Data Cache persists fetch results across requests, the Full Route Cache stores rendered HTML and RSC payloads, and the Router Cache stores prefetched routes on the client.',
				code: `// Data cache with revalidation
const data = await fetch('https://api.example.com/posts', {
	next: { revalidate: 3600 } // refresh every hour
})`,
			},
			{
				question: 'What is Incremental Static Regeneration and when is it useful?',
				answer: 'ISR lets you regenerate static pages after deployment without rebuilding the entire site. A page is served from cache until the revalidation period expires, then the next request triggers a background regeneration. It is ideal for content that updates periodically, like blog posts or product pages.',
			},
			{
				question: 'How do you handle authentication in a static export?',
				answer: 'In a static export, there is no server runtime, so authentication must happen entirely on the client. Use a third-party auth provider, store tokens in cookies or localStorage, and protect routes with a client-side auth wrapper component that redirects unauthenticated users. Server-side middleware is not available in static exports.',
			},
			{
				question: 'What is the purpose of route groups and parallel routes?',
				answer: 'Route groups, created with (folder) syntax, organize files without affecting the URL structure — useful for applying different layouts to subsets of routes. Parallel routes use @folder slots to render multiple pages in the same layout simultaneously, enabling dashboards or split views.',
				code: `// app/(marketing)/layout.tsx  — marketing layout
// app/(dashboard)/layout.tsx  — dashboard layout
// app/@modal/login/page.tsx   — parallel route slot`,
				codeLang: 'typescript',
			},
			{
				question: 'How do you optimize Core Web Vitals in a Next.js application?',
				answer: 'Use Server Components to reduce client-side JavaScript. Leverage next/image for automatic image optimization with lazy loading and proper sizing. Use next/font to eliminate font layout shift. Prefetch links, stream content with Suspense boundaries, and minimize client-side state that triggers re-renders.',
			},
		],
	},
	{
		title: 'Web Accessibility (A11y)',
		slug: 'web-accessibility',
		categoryMatch: 'web fundamentals',
		description: 'Accessibility is a core competency for senior frontend developers. Interviews test your knowledge of WCAG guidelines, ARIA patterns, keyboard navigation, and how to build inclusive interfaces that work with assistive technologies.',
		questions: [
			{
				question: 'What WCAG conformance level should a production app target and why?',
				answer: 'Most production apps should target WCAG 2.1 Level AA, which covers the majority of accessibility needs without the extreme constraints of Level AAA. Level AA includes requirements for color contrast (4.5:1 for normal text), keyboard operability, and screen reader compatibility that cover the widest range of disabilities.',
			},
			{
				question: 'What is the first rule of ARIA?',
				answer: 'The first rule of ARIA is: do not use ARIA if you can use a native HTML element that already has the semantics and behavior you need. A native button element already has role="button", keyboard handling, and focus management built in. ARIA should only supplement where native HTML falls short.',
			},
			{
				question: 'How do you implement focus trapping in a modal dialog?',
				answer: 'Focus trapping keeps keyboard focus inside the modal by intercepting Tab and Shift+Tab at the boundaries. On the last focusable element, Tab moves focus to the first; on the first, Shift+Tab moves to the last. Also move focus into the modal on open and restore it to the trigger element on close.',
				code: `<dialog ref={dialogRef} onKeyDown={(e) => {
	if (e.key !== 'Tab') return
	const focusable = dialogRef.current.querySelectorAll(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
	)
	const first = focusable[0] as HTMLElement
	const last = focusable[focusable.length - 1] as HTMLElement
	if (e.shiftKey && document.activeElement === first) {
		e.preventDefault(); last.focus()
	} else if (!e.shiftKey && document.activeElement === last) {
		e.preventDefault(); first.focus()
	}
}}>`,
			},
			{
				question: 'What is the accessibility tree and how does it relate to the DOM?',
				answer: 'The accessibility tree is a parallel structure the browser builds from the DOM, containing only semantically relevant nodes with their roles, names, states, and properties. Assistive technologies like screen readers interact with this tree, not the DOM directly. Using semantic HTML and correct ARIA attributes shapes what appears in this tree.',
			},
			{
				question: 'When should you use aria-live regions?',
				answer: 'Use aria-live regions to announce dynamic content changes that happen without a page reload, such as form validation errors, toast notifications, or live search result counts. Set aria-live="polite" for non-urgent updates that wait for the user to finish, and aria-live="assertive" for critical alerts that interrupt immediately.',
				code: `<div aria-live="polite" aria-atomic="true">
	{results.length} results found
</div>`,
			},
			{
				question: 'How do you make a custom dropdown accessible?',
				answer: 'Use the combobox or listbox ARIA pattern. The trigger needs role="combobox" or a button with aria-haspopup and aria-expanded. The list needs role="listbox" with role="option" children. Support arrow key navigation, Home/End, type-ahead search, and Escape to close. Manage aria-activedescendant to track the focused option.',
			},
			{
				question: 'What is the difference between aria-label, aria-labelledby, and aria-describedby?',
				answer: 'aria-label provides an inline accessible name as a string. aria-labelledby points to another element by ID whose text content becomes the accessible name, and it overrides aria-label. aria-describedby adds supplementary description text that screen readers announce after the name and role.',
			},
			{
				question: 'How do you test for accessibility in an automated CI pipeline?',
				answer: 'Use axe-core via testing-library or Playwright to catch rule violations in unit and integration tests. Add Lighthouse CI for page-level audits on every pull request. Automated tools catch about 30-40% of issues — supplement with manual keyboard testing and periodic screen reader audits for comprehensive coverage.',
			},
		],
	},
	{
		title: 'JavaScript Fundamentals',
		slug: 'javascript',
		categoryMatch: 'javascript',
		description: 'Even senior React developers get JavaScript fundamentals questions. The event loop, closures, prototypal inheritance, and async patterns are common territory — they reveal how deeply you understand the language beneath the frameworks.',
		questions: [
			{
				question: 'How does the JavaScript event loop work with microtasks and macrotasks?',
				answer: 'The event loop processes one macrotask (setTimeout, I/O) then drains the entire microtask queue (Promises, queueMicrotask, MutationObserver) before processing the next macrotask. This means Promise callbacks always run before the next setTimeout, even if the setTimeout was queued first.',
			},
			{
				question: 'What are closures and how can they cause memory leaks?',
				answer: 'A closure is a function that retains access to variables from its enclosing scope even after that scope has exited. Memory leaks happen when closures unintentionally hold references to large objects, DOM elements, or entire scopes that can never be garbage collected — common in event listeners and timers that are not cleaned up.',
				code: `function createHandler(heavyData: object) {
	return () => {
		// closure holds heavyData in memory
		console.log(heavyData)
	}
}
// If the returned function is never released,
// heavyData is never garbage collected`,
			},
			{
				question: 'How does prototypal inheritance differ from classical inheritance?',
				answer: 'JavaScript uses prototypal inheritance where objects delegate to other objects via the prototype chain, not class blueprints. When you access a property, the engine walks up the chain until it finds it or reaches null. ES6 classes are syntactic sugar over this mechanism — there are no true classes, just objects linked to prototypes.',
			},
			{
				question: 'What is the difference between Promise.all, Promise.allSettled, and Promise.race?',
				answer: 'Promise.all resolves when all promises resolve and rejects immediately if any one rejects — use it when all results are required. Promise.allSettled waits for all to complete regardless of success or failure, returning each outcome. Promise.race resolves or rejects with whichever promise settles first.',
				code: `const [a, b] = await Promise.all([fetchUser(), fetchPosts()])
// Both must succeed

const results = await Promise.allSettled([risky1(), risky2()])
// results[0].status === 'fulfilled' | 'rejected'`,
			},
			{
				question: 'How do generators and iterators work?',
				answer: 'A generator function (function*) returns an iterator that pauses at each yield expression. Calling next() resumes execution until the next yield or return. Generators implement the iterable protocol, so they work with for...of and spread syntax. They are useful for lazy sequences, async flow control, and custom iteration logic.',
			},
			{
				question: 'What are WeakMap and WeakSet, and when would you use them?',
				answer: 'WeakMap and WeakSet hold weak references to their object keys, meaning entries are garbage collected when no other reference to the key exists. Use them for caching metadata about DOM nodes or objects without preventing cleanup. They are not iterable and have no size property.',
			},
			{
				question: 'How does the module system (ESM vs CJS) work?',
				answer: 'ES Modules use import/export with static analysis at parse time, enabling tree shaking. CommonJS uses require/module.exports and evaluates synchronously at runtime. ESM imports are live bindings (reflect updates), while CJS exports are value copies. Most modern tooling targets ESM for better optimization.',
				code: `// ESM — static, tree-shakeable
import { sum } from './math'
export const double = (n: number) => sum(n, n)

// CJS — dynamic, evaluated at runtime
const { sum } = require('./math')
module.exports = { double: (n) => sum(n, n) }`,
				codeLang: 'typescript',
			},
			{
				question: 'What is structured cloning and how does it differ from JSON.parse/stringify?',
				answer: 'structuredClone() creates a deep copy that handles circular references, Maps, Sets, Dates, ArrayBuffers, and other types that JSON cannot serialize. JSON.parse(JSON.stringify()) drops undefined values, functions, and symbols, and throws on circular references. Use structuredClone for reliable deep cloning of complex data.',
			},
		],
	},
	{
		title: 'Frontend System Design',
		slug: 'system-design',
		categoryMatch: 'system design',
		description: 'Senior frontend interviews increasingly include system design rounds. You may be asked to design a component library, real-time dashboard, or collaborative editor — focusing on data flow, state management, API design, and scalability.',
		questions: [
			{
				question: 'How would you design a design system and component library?',
				answer: 'Start with a token layer (colors, spacing, typography) and build primitive components on top. Use a monorepo with packages for tokens, core components, and framework adapters. Version and publish via changesets, document with Storybook, and enforce visual regression tests. Prioritize composition over configuration to keep components flexible.',
			},
			{
				question: 'How would you architect a real-time collaborative editing feature?',
				answer: 'Use CRDTs or Operational Transformation to handle concurrent edits without conflicts. Connect clients via WebSockets with a central relay server that broadcasts operations. Each client applies remote operations to its local state, and the algorithm guarantees eventual consistency. Libraries like Yjs or Automerge simplify CRDT implementation.',
			},
			{
				question: 'How would you build an infinite scrolling feed with optimistic updates?',
				answer: 'Use a cursor-based pagination API and an IntersectionObserver to trigger loading the next page. Keep a normalized data store so items can be updated in place. For optimistic updates, insert or modify items in the local cache immediately, tag them as pending, and reconcile when the server responds or roll back on failure.',
			},
			{
				question: 'How do you design a micro-frontend architecture?',
				answer: 'Micro-frontends split a monolithic UI into independently deployable apps, each owned by a team. Use Module Federation, iframe isolation, or a custom app shell to compose them at runtime. Share a common design system but avoid shared mutable state. The tradeoffs are increased infrastructure complexity and potential UX inconsistency.',
			},
			{
				question: 'How would you implement client-side caching and offline support?',
				answer: 'Use a service worker to cache static assets and API responses with a stale-while-revalidate strategy. Store mutable data in IndexedDB for offline access. Queue mutations when offline and replay them when connectivity returns, resolving conflicts with a last-write-wins or server-reconciliation strategy.',
				code: `// Service worker cache-first strategy
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request)
			.then(cached => cached || fetch(event.request))
	)
})`,
				codeLang: 'javascript',
			},
			{
				question: 'How do you design a performant search autocomplete component?',
				answer: 'Debounce input by 200-300ms to reduce API calls. Cache previous query results in a Map keyed by the search string. Cancel in-flight requests when a new query fires using AbortController. Render results in a virtualized list if the dataset is large, and use aria-combobox for accessibility.',
			},
			{
				question: 'How would you architect feature flags for a large application?',
				answer: 'Use a feature flag service (LaunchDarkly, Unleash, or a custom solution) that evaluates flags server-side or at the edge for initial render. Cache flag values in the client, subscribe to real-time updates via SSE or polling, and wrap features in a FeatureGate component. Clean up dead flags regularly to avoid technical debt.',
				code: `function FeatureGate({ flag, children }: {
	flag: string
	children: React.ReactNode
}) {
	const { flags } = useFeatureFlags()
	if (!flags[flag]) return null
	return <>{children}</>
}`,
			},
			{
				question: 'How do you design an error tracking and monitoring system for the frontend?',
				answer: 'Capture unhandled errors with window.onerror and unhandledrejection listeners. Wrap React trees in Error Boundaries to catch render errors. Enrich error reports with user context, breadcrumbs, and source maps for stack trace readability. Send reports to a service like Sentry and set up alerts on error rate spikes.',
			},
		],
	},
	{
		title: 'CSS and Layout',
		slug: 'css',
		categoryMatch: 'css',
		description: 'CSS knowledge separates frontend specialists from full-stack generalists. Senior interviews cover layout mechanisms, responsive design, CSS architecture, and performance — areas where practical experience shows.',
		questions: [
			{
				question: 'What is the difference between Flexbox and CSS Grid, and when do you use each?',
				answer: 'Flexbox is one-dimensional — it controls layout along a single row or column. CSS Grid is two-dimensional, controlling both rows and columns simultaneously. Use Flexbox for navigation bars, card rows, and alignment within a container. Use Grid for page layouts, complex dashboards, and anything requiring explicit row and column placement.',
			},
			{
				question: 'How does the CSS cascade and specificity work?',
				answer: 'The cascade resolves which styles apply when multiple rules target the same element. Priority order is: origin (user-agent, author, user), specificity (inline > ID > class > element), and source order. Specificity is calculated as a tuple — one ID selector (1,0,0) beats any number of class selectors (0,n,0).',
				code: `/* Specificity: 0,1,0 — one class */
.button { color: blue }

/* Specificity: 1,0,0 — one ID, wins */
#submit { color: red }

/* Specificity: 0,2,0 — two classes */
.form .button { color: green }`,
				codeLang: 'css',
			},
			{
				question: 'What are CSS custom properties and how do they differ from preprocessor variables?',
				answer: 'CSS custom properties (--var-name) are live values resolved at runtime in the browser, cascade through the DOM, and can be changed dynamically with JavaScript. Sass/Less variables are compiled away at build time and produce static output. Custom properties enable theming, responsive changes, and component-scoped values that preprocessor variables cannot.',
			},
			{
				question: 'How do you implement a responsive design system?',
				answer: 'Define a spacing and typography scale using CSS custom properties. Use fluid typography with clamp() for smooth scaling between breakpoints. Set container-based breakpoints where possible instead of device-width media queries. Build components that adapt to their container width using CSS Grid auto-fit and minmax().',
				code: `/* Fluid typography with clamp */
:root {
	--text-base: clamp(1rem, 0.5vw + 0.875rem, 1.125rem);
	--text-lg: clamp(1.25rem, 1vw + 1rem, 1.5rem);
}`,
				codeLang: 'css',
			},
			{
				question: 'What is CSS containment and how does it improve performance?',
				answer: 'CSS containment (contain property) tells the browser that an element is independent from the rest of the page, allowing rendering optimizations. contain: layout prevents the element from affecting outside layout. contain: paint creates a new stacking context and clips overflow. content-visibility: auto skips rendering off-screen elements entirely.',
			},
			{
				question: 'How do CSS layers (@layer) help manage specificity?',
				answer: 'CSS @layer creates explicit specificity ordering independent of selector weight. Styles in earlier-declared layers are overridden by later layers regardless of selector specificity. This is powerful for frameworks — put reset styles in a base layer, component library in a middle layer, and app overrides in a top layer.',
				code: `@layer base, components, overrides;

@layer base {
	button { padding: 0.5rem 1rem }
}
@layer overrides {
	button { padding: 1rem 2rem } /* wins */
}`,
				codeLang: 'css',
			},
			{
				question: 'What are the best practices for CSS-in-JS vs utility-first CSS?',
				answer: 'CSS-in-JS (styled-components, Emotion) scopes styles to components and enables dynamic styling based on props, but adds runtime cost and bundle size. Utility-first CSS (Tailwind) generates small static stylesheets, avoids naming decisions, and enables fast prototyping, but can reduce readability in complex components. Choose based on team preference and performance requirements.',
			},
			{
				question: 'How do you handle CSS for component libraries across multiple applications?',
				answer: 'Use CSS custom properties for theming so each consuming app can override tokens. Ship styles alongside components rather than in a global stylesheet. Use CSS Modules or a naming convention like BEM to avoid collisions. Publish a separate tokens package so apps can use your design tokens without importing the full component CSS.',
			},
		],
	},
	{
		title: 'Performance Optimization',
		slug: 'performance',
		categoryMatch: 'performance',
		description: 'Performance is a senior-level responsibility. Interviewers expect you to understand Core Web Vitals, bundle optimization, rendering performance, and how to diagnose bottlenecks using browser DevTools and profiling.',
		questions: [
			{
				question: 'What are Core Web Vitals (LCP, CLS, INP) and how do you optimize each?',
				answer: 'LCP (Largest Contentful Paint) measures loading — optimize by preloading hero images and reducing server response time. CLS (Cumulative Layout Shift) measures visual stability — fix by setting explicit dimensions on images and embeds. INP (Interaction to Next Paint) measures responsiveness — optimize by keeping main thread work under 50ms and yielding during long tasks.',
			},
			{
				question: 'How does code splitting work and when should you use it?',
				answer: 'Code splitting breaks your bundle into smaller chunks loaded on demand. Use dynamic import() for route-level splitting and React.lazy for component-level splitting. Apply it to heavy features users may not visit (admin panels, modals, charts) to reduce initial bundle size and improve LCP.',
				code: `const Chart = lazy(() => import('./HeavyChart'))

function Dashboard() {
	return (
		<Suspense fallback={<Skeleton />}>
			<Chart data={data} />
		</Suspense>
	)
}`,
			},
			{
				question: 'What is tree shaking and how do you ensure it works?',
				answer: 'Tree shaking is dead-code elimination where the bundler removes unused exports from the final bundle. It requires ES modules (import/export) because they are statically analyzable. Ensure your package.json has "sideEffects": false, avoid barrel files that re-export everything, and do not use CommonJS require() in library code.',
			},
			{
				question: 'How do you diagnose and fix layout shifts?',
				answer: 'Use the Layout Shift regions in Chrome DevTools Performance panel or the Web Vitals extension to identify which elements shift. Common causes are images without width/height, dynamically injected content above the fold, and web fonts swapping. Fix by reserving space with aspect-ratio or explicit dimensions and using font-display: optional.',
			},
			{
				question: 'What is the critical rendering path and how do you optimize it?',
				answer: 'The critical rendering path is the sequence of steps from receiving HTML to rendering pixels: HTML parsing, CSSOM construction, render tree, layout, and paint. Optimize by inlining critical CSS, deferring non-essential scripts with async/defer, reducing render-blocking resources, and minimizing DOM depth.',
				code: `<!-- Inline critical CSS for above-the-fold content -->
<style>/* critical styles */</style>

<!-- Defer non-critical CSS -->
<link rel="preload" href="full.css" as="style"
	onload="this.rel='stylesheet'">

<!-- Defer non-critical JS -->
<script src="app.js" defer></script>`,
				codeLang: 'html',
			},
			{
				question: 'How do you implement virtualization for large lists?',
				answer: 'Virtualization renders only the visible items plus a small overscan buffer, replacing off-screen items with empty space. Libraries like react-window and TanStack Virtual calculate which items are visible based on scroll position and container height. This reduces DOM nodes from thousands to dozens, dramatically improving rendering performance.',
			},
			{
				question: 'What are the performance tradeoffs of SSR vs SSG vs CSR?',
				answer: 'SSG is fastest for end users — pages are pre-built and served from a CDN. SSR generates HTML per request, adding server latency but enabling fresh data. CSR ships a minimal HTML shell and renders in the browser, which is slowest for first paint but enables rich interactivity. Use SSG where possible, SSR for dynamic personalization, and CSR for highly interactive app shells.',
			},
			{
				question: 'How do you use the Performance API and Chrome DevTools to profile?',
				answer: 'Use performance.mark() and performance.measure() to instrument specific code paths. The Chrome Performance panel records a flame chart showing main thread activity, long tasks, and layout recalculations. The React Profiler identifies slow components. Use the Network panel to find waterfall bottlenecks and Lighthouse for automated auditing.',
				code: `performance.mark('fetch-start')
const data = await fetchData()
performance.mark('fetch-end')
performance.measure('data-fetch', 'fetch-start', 'fetch-end')
const [entry] = performance.getEntriesByName('data-fetch')
console.log(entry.duration) // ms`,
				codeLang: 'typescript',
			},
		],
	},
]

export default function PillarPage() {
	const posts = getAllPosts()
	const websiteJsonLd = generateWebSiteJsonLd()
	const breadcrumbJsonLd = generateBreadcrumbJsonLd([
		{ name: 'Home', url: SITE_URL },
		{ name: 'Senior Frontend Interview Questions' },
	])

	const faqJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: topics.flatMap(topic =>
			topic.questions.slice(0, 3).map(q => ({
				'@type': 'Question',
				name: q.question,
				acceptedAnswer: {
					'@type': 'Answer',
					text: q.answer,
				},
			}))
		),
	}

	const postsByCategory = new Map<string, typeof posts>()
	for (const post of posts) {
		const cat = post.category.toLowerCase()
		if (!postsByCategory.has(cat)) postsByCategory.set(cat, [])
		postsByCategory.get(cat)!.push(post)
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
			/>

			<div className="max-w-4xl">
				<header className="mb-12">
					<h1 className="text-4xl font-bold mb-4">
						Senior Frontend Interview Questions
					</h1>
					<p className="text-lg text-[var(--fg-muted)] mb-6">
						A comprehensive guide covering every topic senior frontend developers face in interviews — React, TypeScript, Next.js, accessibility, system design, performance, and more. Each section includes the most commonly asked questions with links to deep-dive articles.
					</p>
					<p className="text-[var(--fg-muted)]">
						This guide is structured as a learning path. Start with the fundamentals and work through each topic. Every question listed here has been asked in real senior frontend interviews at top tech companies.
					</p>
				</header>

				{/* Quick navigation */}
				<nav className="mb-12 p-6 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
					<h2 className="text-lg font-semibold mb-3">Topics Covered</h2>
					<div className="grid sm:grid-cols-2 gap-2">
						{topics.map(topic => (
							<a
								key={topic.slug}
								href={`#${topic.slug}`}
								className="text-[var(--accent)] hover:underline"
							>
								{topic.title}
							</a>
						))}
					</div>
				</nav>

				{/* Topic sections */}
				{topics.map(topic => {
					const catPosts = postsByCategory.get(topic.categoryMatch) ?? []

					return (
						<section key={topic.slug} id={topic.slug} className="mb-14">
							<h2 className="text-2xl font-bold mb-3">{topic.title} Interview Questions</h2>
							<p className="text-[var(--fg-muted)] mb-6">{topic.description}</p>

							<div className="space-y-4 mb-6">
								{topic.questions.map((q, i) => (
									<div key={i} className="p-4 rounded-lg border border-[var(--border)]">
										<div className="flex gap-3 mb-2">
											<span className="text-[var(--accent)] font-semibold shrink-0">Q{i + 1}.</span>
											<span className="font-medium">{q.question}</span>
										</div>
										<p className="text-sm text-[var(--fg-muted)] ml-10">{q.answer}</p>
										{q.code && (
											<pre className="mt-2 ml-10 p-3 rounded bg-[var(--bg-secondary)] overflow-x-auto">
												<code className={`text-xs language-${q.codeLang ?? 'tsx'}`}>{q.code}</code>
											</pre>
										)}
									</div>
								))}
							</div>

							{catPosts.length > 0 && (
								<div className="mt-4">
									<h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--fg-muted)] mb-3">
										Deep-Dive Articles
									</h3>
									<div className="grid gap-3">
										{catPosts.map(post => (
											<Link
												key={post.slug}
												href={`/${post.slug}/`}
												className="block p-4 rounded-lg border border-[var(--border)] hover:border-[var(--fg-muted)] hover:shadow-sm transition-all"
											>
												<h4 className="font-medium text-[var(--accent)]">{post.title}</h4>
												<p className="text-sm text-[var(--fg-muted)] mt-1">{post.description}</p>
											</Link>
										))}
									</div>
								</div>
							)}
						</section>
					)
				})}

				{/* How to use this guide */}
				<section className="mb-14">
					<h2 className="text-2xl font-bold mb-3">How to Use This Guide</h2>
					<p className="text-[var(--fg-muted)] mb-4">
						This pillar page serves as your central hub for senior frontend interview preparation. Each topic section links to dedicated deep-dive articles that cover the concepts in full detail with code examples, common pitfalls, and interviewer expectations.
					</p>
					<div className="space-y-4">
						<div className="p-4 rounded-lg border border-[var(--border)]">
							<h3 className="font-semibold mb-1">Start With Fundamentals</h3>
							<p className="text-sm text-[var(--fg-muted)]">
								Begin with JavaScript fundamentals and CSS layout if you need to refresh core concepts. These form the foundation that framework-specific questions build upon.
							</p>
						</div>
						<div className="p-4 rounded-lg border border-[var(--border)]">
							<h3 className="font-semibold mb-1">Go Deep on Your Stack</h3>
							<p className="text-sm text-[var(--fg-muted)]">
								Focus on React, TypeScript, and Next.js sections if you are interviewing for a role that uses these technologies. Read the linked deep-dive articles for each topic.
							</p>
						</div>
						<div className="p-4 rounded-lg border border-[var(--border)]">
							<h3 className="font-semibold mb-1">Practice System Design</h3>
							<p className="text-sm text-[var(--fg-muted)]">
								Senior roles almost always include a system design round. Review the frontend system design section and practice whiteboarding component architectures and data flow diagrams.
							</p>
						</div>
						<div className="p-4 rounded-lg border border-[var(--border)]">
							<h3 className="font-semibold mb-1">Do Not Skip Accessibility</h3>
							<p className="text-sm text-[var(--fg-muted)]">
								Accessibility knowledge is increasingly a differentiator. Knowing WCAG, ARIA, and keyboard patterns signals senior-level thinking about inclusive design.
							</p>
						</div>
					</div>
				</section>

				<LeadMagnet />

				{/* All articles */}
				<section className="mb-14">
					<h2 className="text-2xl font-bold mb-3">All Interview Prep Articles</h2>
					<p className="text-[var(--fg-muted)] mb-6">
						Every article on {SITE_NAME} is written for senior frontend developers preparing for interviews. Each covers a specific topic in depth with code examples and common interview questions.
					</p>
					<div className="grid gap-3">
						{posts.map(post => (
							<Link
								key={post.slug}
								href={`/${post.slug}/`}
								className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] hover:border-[var(--fg-muted)] hover:shadow-sm transition-all"
							>
								<div>
									<h3 className="font-medium text-[var(--accent)]">{post.title}</h3>
									<p className="text-sm text-[var(--fg-muted)] mt-1">{post.description}</p>
								</div>
								<span className="text-xs text-[var(--fg-muted)] shrink-0 ml-4">{post.category}</span>
							</Link>
						))}
					</div>
				</section>
			</div>
		</>
	)
}
