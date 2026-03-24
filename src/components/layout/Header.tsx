'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import SearchBar from '@/components/search/SearchBar'
import ThemeToggle from '@/components/ui/ThemeToggle'
import ContrastToggle from '@/components/ui/ContrastToggle'
import { slugify } from '@/lib/utils'
import type { CategoryCount, TagCount } from '@/types/blog'

interface HeaderProps {
	categories?: CategoryCount[]
	tags?: TagCount[]
}

const NON_ARTICLE_PREFIXES = ['/', '/category/', '/tag/', '/page/', '/senior-']

function isArticlePath(pathname: string): boolean {
	if (pathname === '/') return false
	return !NON_ARTICLE_PREFIXES.some(prefix =>
		prefix === '/' ? pathname === '/' : pathname.startsWith(prefix)
	)
}

export default function Header({ categories, tags }: HeaderProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [isMac, setIsMac] = useState(false)
	const pathname = usePathname()
	const showShortcut = isArticlePath(pathname)

	useEffect(() => {
		setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform))
	}, [])

	return (
		<>
			<header className="sticky top-0 z-40 bg-[var(--bg)]/95 backdrop-blur">
				<div className="flex items-center justify-between h-[60px] px-6 sm:px-10 lg:px-16 xl:px-24 border-b border-[var(--border)]">
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
					</div>

				<SearchBar />
			<div className="flex items-center gap-1 ml-2">
				{showShortcut && (
					<span className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono rounded border border-[var(--accent-border)] bg-[var(--accent-muted)] text-[var(--accent)] mr-1 select-none">
						<span className="opacity-70">AI</span>
						<span className="border-l border-[var(--accent-border)] pl-1">{isMac ? '⌘L' : 'Ctrl+L'}</span>
					</span>
				)}
				<ContrastToggle />
				<ThemeToggle />
			</div>
				</div>
			</header>

			{/* Mobile menu overlay */}
			{mobileMenuOpen && (
				<div className="lg:hidden fixed inset-0 z-[60]">
					<div
						className="absolute inset-0 bg-black/50"
						onClick={() => setMobileMenuOpen(false)}
					/>
					<aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-[var(--bg)] overflow-y-auto sidebar-scroll border-r border-[var(--border)]">
					{/* Header */}
					<div className="px-5 h-[60px] flex flex-col justify-center border-b border-[var(--border)]">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-[var(--fg)] text-base font-bold">
										<span className="text-[var(--accent)] font-mono">[</span>
										Interview Hub
										<span className="text-[var(--accent)] font-mono">]</span>
									</h2>
									<p className="text-xs font-mono text-[var(--accent)] mt-1">
										$ preparing --level senior
									</p>
								</div>
								<button
									onClick={() => setMobileMenuOpen(false)}
									className="p-1 rounded text-[var(--fg-muted)] hover:text-[var(--fg)]"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
										<path d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
						</div>

						<nav className="flex-1 px-3 py-4 space-y-1">
							<Link
								href="/"
								onClick={() => setMobileMenuOpen(false)}
								className="flex items-center px-3 py-2 rounded-md text-sm text-[var(--fg-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--fg)] border-l-[3px] border-transparent transition-colors"
							>
								All Posts
							</Link>
							<Link
								href="/senior-interview-guide"
								onClick={() => setMobileMenuOpen(false)}
								className="flex items-center px-3 py-2 rounded-md text-sm text-[var(--fg-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--fg)] border-l-[3px] border-transparent transition-colors"
							>
								<span className="text-yellow-400 mr-2">&#9733;</span>
								Senior Interview Guide
							</Link>

							{categories && categories.length > 0 && (
								<div className="pt-4">
									<div className="inline-block px-2 py-1 mb-2 bg-[var(--bg-secondary)] rounded">
										<span className="text-[10px] font-mono text-[var(--accent)] tracking-wider">{'// CATEGORIES'}</span>
									</div>
									{categories.map(({ name, count }) => (
										<Link
											key={name}
											href={`/category/${slugify(name)}`}
											onClick={() => setMobileMenuOpen(false)}
											className="flex items-center justify-between px-3 py-1.5 rounded text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
										>
											<span>{name}</span>
											<span className="font-mono text-xs text-[var(--accent)]">
												{String(count).padStart(2, '0')}
											</span>
										</Link>
									))}
								</div>
							)}

							{tags && tags.length > 0 && (
								<div className="pt-4">
									<div className="inline-block px-2 py-1 mb-2 bg-[var(--bg-secondary)] rounded">
										<span className="text-[10px] font-mono text-[var(--accent)] tracking-wider">{'// TAGS'}</span>
									</div>
									<div className="flex flex-wrap gap-1.5 px-1">
										{tags.slice(0, 15).map(({ name }) => (
											<Link
												key={name}
												href={`/tag/${slugify(name)}`}
												onClick={() => setMobileMenuOpen(false)}
												className="inline-block px-2.5 py-0.5 text-[11px] font-mono rounded border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
											>
												{name}
											</Link>
										))}
									</div>
								</div>
							)}
						</nav>
					</aside>
				</div>
			)}
		</>
	)
}
