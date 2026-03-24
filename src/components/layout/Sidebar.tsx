'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { slugify } from '@/lib/utils'
import type { CategoryCount, TagCount } from '@/types/blog'

interface SidebarProps {
	categories: CategoryCount[]
	tags: TagCount[]
}

export default function Sidebar({ categories, tags }: SidebarProps) {
	const pathname = usePathname()
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	const isActive = (path: string) => {
		if (!isMounted) return false
		return pathname === path || pathname === path + '/'
	}

	const isCategoryActive = (category: string) => {
		if (!isMounted) return false
		const slug = slugify(category)
		return pathname === `/category/${slug}` || pathname === `/category/${slug}/`
	}

	const isTagActive = (tag: string) => {
		if (!isMounted) return false
		const slug = slugify(tag)
		return pathname === `/tag/${slug}` || pathname === `/tag/${slug}/`
	}

	return (
		<aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-[260px] lg:flex lg:flex-col h-screen overflow-y-auto sidebar-scroll bg-[var(--bg)] border-r border-[var(--border)]">
			{/* Header */}
			<div className="px-5 pt-6 pb-4 border-b border-[var(--border)]">
				<Link href="/" className="block">
					<h1 className="text-[var(--fg)] text-base font-bold">
						<span className="text-[var(--accent)] font-mono">[</span>
						Interview Hub
						<span className="text-[var(--accent)] font-mono">]</span>
					</h1>
					<p className="text-xs font-mono text-[var(--accent)] mt-1">
						$ preparing --level senior
					</p>
				</Link>
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-3 py-4 space-y-1">
				<Link
					href="/"
					className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
						isActive('/')
							? 'bg-[var(--bg-secondary)] text-[var(--fg)] font-medium border-l-[3px] border-[var(--accent)]'
							: 'text-[var(--fg-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--fg)] border-l-[3px] border-transparent'
					}`}
				>
					All Posts
				</Link>
				<Link
					href="/senior-interview-guide"
					className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
						isActive('/senior-interview-guide')
							? 'bg-[var(--bg-secondary)] text-[var(--fg)] font-medium border-l-[3px] border-[var(--accent)]'
							: 'text-[var(--fg-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--fg)] border-l-[3px] border-transparent'
					}`}
				>
					<span className="text-yellow-400 mr-2">&#9733;</span>
					Senior Interview Guide
				</Link>

				{/* Categories */}
				<div className="pt-4">
					<div className="inline-block px-2 py-1 mb-2 bg-[var(--bg-secondary)] rounded">
						<span className="text-[10px] font-mono text-[var(--accent)] tracking-wider">{'// CATEGORIES'}</span>
					</div>
					{categories.map(({ name, count }) => (
						<Link
							key={name}
							href={`/category/${slugify(name)}`}
							className={`flex items-center justify-between px-3 py-1.5 rounded text-sm transition-colors ${
								isCategoryActive(name)
									? 'text-[var(--fg)] font-medium'
									: 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
							}`}
						>
							<span>{name}</span>
							<span className="font-mono text-xs text-[var(--accent)]">
								{String(count).padStart(2, '0')}
							</span>
						</Link>
					))}
				</div>

				{/* Tags */}
				<div className="pt-4">
					<div className="inline-block px-2 py-1 mb-2 bg-[var(--bg-secondary)] rounded">
						<span className="text-[10px] font-mono text-[var(--accent)] tracking-wider">{'// TAGS'}</span>
					</div>
					<div className="flex flex-wrap gap-1.5 px-1">
						{tags.slice(0, 15).map(({ name }) => (
							<Link
								key={name}
								href={`/tag/${slugify(name)}`}
								className={`inline-block px-2.5 py-0.5 text-[11px] font-mono rounded border transition-colors ${
									isTagActive(name)
										? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]'
										: 'border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
								}`}
							>
								{name}
							</Link>
						))}
					</div>
				</div>
			</nav>
		</aside>
	)
}
