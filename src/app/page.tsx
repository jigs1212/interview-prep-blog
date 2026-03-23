import { getPaginatedPosts } from '@/lib/posts'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, generateWebSiteJsonLd } from '@/lib/seo'
import BlogList from '@/components/blog/BlogList'
import Pagination from '@/components/blog/Pagination'
import type { Metadata } from 'next'

const paginationBase = '/page'

export const metadata: Metadata = {
	title: SITE_NAME,
	description: SITE_DESCRIPTION,
	keywords: ['senior frontend interview questions', 'react interview questions', 'typescript interview questions', 'nextjs interview questions', 'frontend developer interview prep'],
	alternates: { canonical: `${SITE_URL}/` },
}

export default function Home() {
	const { posts, totalPages } = getPaginatedPosts(1)
	const websiteJsonLd = generateWebSiteJsonLd()

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
			/>
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">All Posts</h1>
				<p className="text-[var(--fg-muted)]">
					{SITE_DESCRIPTION}
				</p>
			</div>
			<BlogList posts={posts} />
			<Pagination currentPage={1} totalPages={totalPages} basePath={paginationBase} />
		</>
	)
}
