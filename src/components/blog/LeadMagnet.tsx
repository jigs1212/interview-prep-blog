'use client'

import { useState } from 'react'

// Temporarily disabled — uncomment the body below to re-enable the PDF lead magnet.
export default function LeadMagnet() {
	return null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LeadMagnetInner() {
	const [email, setEmail] = useState('')
	const [submitted, setSubmitted] = useState(false)

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!email) return

		const existing = JSON.parse(localStorage.getItem('lead-emails') ?? '[]') as string[]
		if (!existing.includes(email)) {
			existing.push(email)
			localStorage.setItem('lead-emails', JSON.stringify(existing))
		}

		setSubmitted(true)
	}

	if (submitted) {
		return (
			<div className="my-10 p-6 rounded-lg border border-[var(--accent)] bg-[var(--bg-secondary)] text-center">
				<p className="font-semibold text-lg mb-1">Thank you!</p>
				<p className="text-sm text-[var(--fg-muted)]">
					Your download link has been sent. Check your inbox.
				</p>
			</div>
		)
	}

	return (
		<div className="my-10 p-6 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
			<h3 className="font-semibold text-lg mb-1">
				100 Senior Frontend Interview Questions
			</h3>
			<p className="text-sm text-[var(--fg-muted)] mb-4">
				Get a free PDF with 100 curated questions covering React, TypeScript, Next.js, system design, and more — with detailed answers.
			</p>
			<form onSubmit={handleSubmit} className="flex gap-2">
				<input
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					placeholder="you@example.com"
					required
					className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
				/>
				<button
					type="submit"
					className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
				>
					Download Free PDF
				</button>
			</form>
		</div>
	)
}
