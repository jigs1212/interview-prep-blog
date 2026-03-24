'use client'

import { useState, useEffect, useCallback } from 'react'
import TableOfContents from '@/components/blog/TableOfContents'
import ChatDrawer from '@/components/chat/ChatDrawer'
import type { TocItem } from '@/types/blog'

interface ArticleLayoutProps {
	slug: string
	toc: TocItem[]
	children: React.ReactNode
}

export default function ArticleLayout({ slug, toc, children }: ArticleLayoutProps) {
	const [drawerOpen, setDrawerOpen] = useState(true)

	useEffect(() => {
		const saved = localStorage.getItem('chatDrawerOpen')
		if (saved !== null) {
			setDrawerOpen(saved !== 'false')
		}
	}, [])

	const handleToggle = useCallback((open: boolean) => {
		setDrawerOpen(open)
	}, [])

	return (
		<div
			className={`transition-[margin] duration-300 lg:grid lg:gap-10 ${
				drawerOpen
					? 'lg:grid-cols-[1fr] xl:grid-cols-[240px_1fr] xl:mr-[320px]'
					: 'lg:grid-cols-[240px_1fr]'
			}`}
		>
			{/* TOC — hidden at lg when drawer is open, always visible at xl+ */}
			<aside
				className={`hidden xl:block ${
					drawerOpen ? '' : 'lg:block'
				}`}
			>
				<div className="sticky top-24">
					<TableOfContents toc={toc} />
				</div>
			</aside>

			{/* Main article content */}
			<article className="min-w-0">
				{children}
			</article>

			<ChatDrawer slug={slug} isOpen={drawerOpen} onToggle={handleToggle} />
		</div>
	)
}
