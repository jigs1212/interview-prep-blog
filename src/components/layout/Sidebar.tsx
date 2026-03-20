'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { CategoryCount, TagCount } from '@/types/blog'

interface SidebarProps {
	categories: CategoryCount[]
	tags: TagCount[]
}

const basePath = '/interview-prep-blog'

export default function Sidebar({ categories, tags }: SidebarProps) {
	const pathname = usePathname()

	return (
		<>
			{/* Desktop sidebar */}
			<aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-[260px] bg-sidebar text-sidebar-text overflow-y-auto">
				<div className="p-6">
					<Link href={`${basePath}/`} className="block mb-8">
						<h1 className="text-xl font-bold text-white">Interview Prep Hub</h1>
						<p className="text-xs text-sidebar-text mt-1">Senior dev interview guides</p>
					</Link>

					<nav>
						<Link
							href={`${basePath}/`}
							className={`block px-3 py-2 rounded text-sm mb-1 transition-colors ${
								pathname === `${basePath}` || pathname === `${basePath}/`
									? 'bg-sidebar-hover text-sidebar-active font-medium'
									: 'hover:bg-sidebar-hover hover:text-sidebar-active'
							}`}
						>
							All Posts
						</Link>

						<div className="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-text/60">
							Categories
						</div>
						{categories.map(cat => (
							<Link
								key={cat.name}
								href={`${basePath}/category/${encodeURIComponent(cat.name)}/`}
								className={`flex items-center justify-between px-3 py-2 rounded text-sm mb-0.5 transition-colors ${
									pathname === `${basePath}/category/${encodeURIComponent(cat.name)}` ||
									pathname === `${basePath}/category/${encodeURIComponent(cat.name)}/`
										? 'bg-sidebar-hover text-sidebar-active font-medium'
										: 'hover:bg-sidebar-hover hover:text-sidebar-active'
								}`}
							>
								<span>{cat.name}</span>
								<span className="text-xs bg-sidebar-hover rounded-full px-2 py-0.5">
									{cat.count}
								</span>
							</Link>
						))}

						<div className="mt-6 mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-text/60">
							Popular Tags
						</div>
						<div className="flex flex-wrap gap-1.5 px-3">
							{tags.map(tag => (
								<Link
									key={tag.name}
									href={`${basePath}/tag/${encodeURIComponent(tag.name)}/`}
									className={`text-xs px-2 py-1 rounded transition-colors ${
										pathname === `${basePath}/tag/${encodeURIComponent(tag.name)}` ||
										pathname === `${basePath}/tag/${encodeURIComponent(tag.name)}/`
											? 'bg-blue-600 text-white'
											: 'bg-sidebar-hover text-sidebar-text hover:text-sidebar-active'
									}`}
								>
									{tag.name}
								</Link>
							))}
						</div>
					</nav>
				</div>
			</aside>

			{/* Mobile sidebar rendered inside Header via toggle — see MobileSidebar */}
		</>
	)
}
