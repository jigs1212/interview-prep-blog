'use client'

import Link from 'next/link'
import { useState } from 'react'
import SearchBar from '@/components/search/SearchBar'
import ThemeToggle from '@/components/ui/ThemeToggle'
import type { CategoryCount, TagCount } from '@/types/blog'

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
				<div className="flex items-center justify-between px-6 py-3 sm:px-10 lg:px-16 xl:px-24">
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
						<Link href="/" className="lg:hidden font-semibold text-[var(--fg)]">
							Interview Prep Hub
						</Link>
					</div>

					<SearchBar />
				<ThemeToggle />
				</div>
			</header>

			{/* Mobile menu overlay */}
			{mobileMenuOpen && (
				<div className="lg:hidden fixed inset-0 z-50">
					<div
						className="absolute inset-0 bg-black/50"
						onClick={() => setMobileMenuOpen(false)}
					/>
					<aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-sidebar text-sidebar-text overflow-y-auto sidebar-scroll p-6">
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
								href="/"
								onClick={() => setMobileMenuOpen(false)}
								className="block px-3 py-2 rounded text-sm mb-1 hover:bg-sidebar-hover hover:text-sidebar-active transition-colors"
							>
								All Posts
							</Link>

							<div className="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-text/60">
								Guides
							</div>
							<Link
								href="/senior-frontend-interview-questions/"
								onClick={() => setMobileMenuOpen(false)}
								className="flex items-center gap-2 px-3 py-2 rounded text-sm mb-1 hover:bg-sidebar-hover hover:text-sidebar-active transition-colors"
							>
								<svg className="w-3.5 h-3.5 shrink-0 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
								Senior Interview Guide
							</Link>

							{categories && categories.length > 0 && (
								<>
									<div className="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-text/60">
										Categories
									</div>
									{categories.map(cat => (
										<Link
											key={cat.name}
											href={`/category/${slugify(cat.name)}/`}
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
												href={`/tag/${encodeURIComponent(tag.name)}/`}
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
