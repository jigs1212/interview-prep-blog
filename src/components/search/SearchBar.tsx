'use client'

import { useState, useEffect, useRef } from 'react'
import Fuse from 'fuse.js'
import { useDebounce } from '@/lib/hooks/useDebounce'
import type { SearchIndexItem } from '@/types/blog'

export default function SearchBar() {
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<SearchIndexItem[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const [loading, setLoading] = useState(true)
	const [activeIndex, setActiveIndex] = useState(-1)
	const fuseRef = useRef<Fuse<SearchIndexItem> | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const debouncedQuery = useDebounce(query, 300)

	useEffect(() => {
		fetch('/search-index.json')
			.then(res => res.json())
			.then((data: SearchIndexItem[]) => {
				fuseRef.current = new Fuse(data, {
					keys: ['title', 'description', 'tags', 'category'],
					threshold: 0.3,
				})
				setLoading(false)
			})
	}, [])

	useEffect(() => {
		if (!debouncedQuery.trim() || !fuseRef.current) {
			setResults([])
			setIsOpen(false)
			return
		}

		const matches = fuseRef.current.search(debouncedQuery).map(r => r.item)
		setResults(matches)
		setIsOpen(true)
		setActiveIndex(-1)
	}, [debouncedQuery])

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	function handleKeyDown(e: React.KeyboardEvent) {
		if (!isOpen || results.length === 0) return

		if (e.key === 'ArrowDown') {
			e.preventDefault()
			setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setActiveIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
		} else if (e.key === 'Enter' && activeIndex >= 0) {
			e.preventDefault()
			window.location.href = `/${results[activeIndex].slug}/`
		} else if (e.key === 'Escape') {
			setIsOpen(false)
		}
	}

	return (
		<div ref={containerRef} className="relative w-full max-w-md">
			<div className="relative">
				<svg
					className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)]"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					strokeWidth={2}
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.35-4.35" />
				</svg>
				<input
					type="text"
					value={query}
					onChange={e => setQuery(e.target.value)}
					onFocus={() => { if (results.length > 0) setIsOpen(true) }}
					onKeyDown={handleKeyDown}
					placeholder="Search posts..."
					className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
				/>
			</div>

			{isOpen && (
				<div className="absolute z-50 top-full mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
					{loading ? (
						<div className="p-4 space-y-3">
							{[1, 2, 3].map(i => (
								<div key={i} className="animate-pulse">
									<div className="h-4 bg-[var(--bg-secondary)] rounded w-3/4 mb-1" />
									<div className="h-3 bg-[var(--bg-secondary)] rounded w-1/2" />
								</div>
							))}
						</div>
					) : results.length === 0 ? (
						<p className="p-4 text-sm text-[var(--fg-muted)]">
							No results for &apos;{debouncedQuery}&apos;
						</p>
					) : (
						<ul>
							{results.map((item, index) => (
								<li key={item.slug}>
									<a
										href={`/${item.slug}/`}
										className={`block px-4 py-3 text-sm transition-colors ${
											index === activeIndex
												? 'bg-[var(--bg-secondary)]'
												: 'hover:bg-[var(--bg-secondary)]'
										}`}
									>
										<div className="flex items-center gap-2 mb-0.5">
											<span className="font-medium text-[var(--fg)]">{item.title}</span>
											<span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
												{item.category}
											</span>
										</div>
										<p className="text-[var(--fg-muted)] truncate">
											{item.description.slice(0, 80)}
										</p>
									</a>
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</div>
	)
}
