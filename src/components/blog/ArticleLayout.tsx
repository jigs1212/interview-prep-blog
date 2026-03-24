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
		<div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
			{/* TOC — sticky, scrollable, backdrop-blur so grid texture shows behind text */}
			<aside className="hidden lg:block">
				<div
					className="sticky top-24 overflow-y-auto sidebar-scroll rounded-lg px-3 py-3 bg-[var(--bg)]/80 backdrop-blur-sm border border-[var(--border)]"
					style={{ maxHeight: 'calc(100vh - 7rem)' }}
				>
					<TableOfContents toc={toc} />
				</div>
			</aside>

			{/* Main article content — semi-transparent backdrop so grid shows through */}
			<article className="min-w-0 rounded-lg px-6 py-6 bg-[var(--bg)]/80 backdrop-blur-sm">
				{children}
			</article>

			{/* Chat drawer is position:fixed — overlays content without affecting grid */}
			<ChatDrawer slug={slug} />
		</div>
	)
}
