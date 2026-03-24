'use client'

import TableOfContents from '@/components/blog/TableOfContents'
import ChatDrawer from '@/components/chat/ChatDrawer'
import type { TocItem } from '@/types/blog'

interface ArticleLayoutProps {
	slug: string
	toc: TocItem[]
	children: React.ReactNode
}

export default function ArticleLayout({ slug, toc, children }: ArticleLayoutProps) {

	return (
		<div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
			{/* TOC — sticky, scrollable, always visible at lg+ */}
			<aside className="hidden lg:block">
				<div className="sticky top-24 overflow-y-auto sidebar-scroll" style={{ maxHeight: 'calc(100vh - 7rem)' }}>
					<TableOfContents toc={toc} />
				</div>
			</aside>

			{/* Main article content — drawer overlays, never shifts content */}
			<article className="min-w-0">
				{children}
			</article>

			{/* Chat drawer is position:fixed — overlays content without affecting grid */}
			<ChatDrawer slug={slug} />
		</div>
	)
}
