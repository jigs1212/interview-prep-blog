import Link from 'next/link'

export default function PillarPageLink() {
	return (
		<aside className="mt-10 p-5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
			<p className="text-sm text-[var(--fg-muted)]">
				This article is part of our{' '}
				<Link
					href="/senior-frontend-interview-questions/"
					className="text-[var(--accent)] font-medium hover:underline"
				>
					Senior Frontend Interview Questions
				</Link>
				{' '}guide — a comprehensive resource covering React, TypeScript, Next.js, accessibility, system design, and more.
			</p>
		</aside>
	)
}
