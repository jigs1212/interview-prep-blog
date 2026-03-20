'use client'

import Link from 'next/link'
import { useState } from 'react'
import SearchBar from '@/components/search/SearchBar'
import type { CategoryCount, TagCount } from '@/types/blog'

const basePath = '/interview-prep-blog'

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim()
}

interface HeaderProps {
	categories?: CategoryCount[]
	tags?: TagCount[]
}

export default function Header({ categories, tags }: HeaderProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<>
			<header className="sticky top-0 z-40 bg-[var(--bg)]/95 backdrop-blur border-b border-[var(--border)]">
				<div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-10 max-w-4xl mx-auto">
					<div className="flex items-center gap-3">
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="lg:hidden p-2 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-secondary)] transition-colors"
							aria-label="Toggle menu"
						>
							{mobileMenuOpen ? (
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
									<path d="M6 18L18 6M6 6l12 12" />
								</svg>
							) : (
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
									<path d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							)}
						</button>
						<Link href={`${basePath}/`} className="lg:hidden font-semibold text-[var(--fg)]">
							Interview Prep Hub
						</Link>
					</div>

					<SearchBar />
				</div>
			</header>

			{/* Mobile menu overlay */}
			{mobileMenuOpen && (
				<div className="lg:hidden fixed inset-0 z-50">
					<div
						className="absolute inset-0 bg-black/50"
						onClick={() => setMobileMenuOpen(false)}
					/>
					<aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-sidebar text-sidebar-text overflow-y-auto p-6">
						<div className="flex items-center justify-between mb-8">
							<h2 className="text-lg font-bold text-white">Interview Prep Hub</h2>
							<button
								onClick={() => setMobileMenuOpen(false)}
								className="p-1 rounded text-sidebar-text hover:text-white"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
									<path d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<nav>
							<Link
								href={`${basePath}/`}
								onClick={() => setMobileMenuOpen(false)}
								className="block px-3 py-2 rounded text-sm mb-1 hover:bg-sidebar-hover hover:text-sidebar-active transition-colors"
							>
								All Posts
							</Link>

							{categories && categories.length > 0 && (
								<>
									<div className="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-text/60">
										Categories
									</div>
									{categories.map(cat => (
										<Link
											key={cat.name}
											href={`${basePath}/category/${slugify(cat.name)}/`}
											onClick={() => setMobileMenuOpen(false)}
											className="flex items-center justify-between px-3 py-2 rounded text-sm mb-0.5 hover:bg-sidebar-hover hover:text-sidebar-active transition-colors"
										>
											<span>{cat.name}</span>
											<span className="text-xs bg-sidebar-hover rounded-full px-2 py-0.5">{cat.count}</span>
										</Link>
									))}
								</>
							)}

							{tags && tags.length > 0 && (
								<>
									<div className="mt-6 mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-text/60">
										Tags
									</div>
									<div className="flex flex-wrap gap-1.5 px-3">
										{tags.map(tag => (
											<Link
												key={tag.name}
												href={`${basePath}/tag/${encodeURIComponent(tag.name)}/`}
												onClick={() => setMobileMenuOpen(false)}
												className="text-xs px-2 py-1 rounded bg-sidebar-hover text-sidebar-text hover:text-sidebar-active transition-colors"
											>
												{tag.name}
											</Link>
										))}
									</div>
								</>
							)}
						</nav>
					</aside>
				</div>
			)}
		</>
	)
}
