'use client'

import { useState, useEffect, useRef } from 'react'
import type { TocItem } from '@/types/blog'

interface TableOfContentsProps {
	toc: TocItem[]
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const observerRef = useRef<IntersectionObserver | null>(null)

	useEffect(() => {
		const ids = toc.flatMap(item => [
			item.id,
			...item.children.map(c => c.id),
		])

		observerRef.current = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id)
						break
					}
				}
			},
			{ rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
		)

		for (const id of ids) {
			const el = document.getElementById(id)
			if (el) observerRef.current.observe(el)
		}

		return () => observerRef.current?.disconnect()
	}, [toc])

	function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
		e.preventDefault()
		const el = document.getElementById(id)
		if (el) {
			const headerHeight = (document.querySelector('header') as HTMLElement | null)?.offsetHeight ?? 56
			const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 8
			window.scrollTo({ top, behavior: 'smooth' })
			setActiveId(id)
			setIsOpen(false)
		}
	}

	if (toc.length === 0) return null

	return (
		<nav className="lg:sticky lg:top-8">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="lg:hidden flex items-center gap-2 text-sm font-medium text-[var(--fg-muted)] mb-3"
			>
				<span>Table of Contents</span>
				<svg
					className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					strokeWidth={2}
				>
					<path d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			<div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
				<h4 className="hidden lg:block text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
					On this page
				</h4>
				<ul className="space-y-1 text-sm border-l border-[var(--border)]">
					{toc.map(item => (
						<li key={item.id}>
							<a
								href={`#${item.id}`}
								onClick={e => handleClick(e, item.id)}
								className={`block pl-4 py-1 border-l-2 -ml-px transition-colors ${
									activeId === item.id
										? 'border-[var(--accent)] text-[var(--accent)] font-medium'
										: 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border)]'
								}`}
							>
								{item.text}
							</a>
							{item.children.length > 0 && (
								<ul className="space-y-1">
									{item.children.map(child => (
										<li key={child.id}>
											<a
												href={`#${child.id}`}
												onClick={e => handleClick(e, child.id)}
												className={`block pl-8 py-1 border-l-2 -ml-px transition-colors ${
													activeId === child.id
														? 'border-[var(--accent)] text-[var(--accent)] font-medium'
														: 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border)]'
												}`}
											>
												{child.text}
											</a>
										</li>
									))}
								</ul>
							)}
						</li>
					))}
				</ul>
			</div>
		</nav>
	)
}
