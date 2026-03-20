import { getPaginatedPosts } from '@/lib/posts'
import BlogList from '@/components/blog/BlogList'
import Pagination from '@/components/blog/Pagination'
import type { Metadata } from 'next'

const paginationBase = '/page'

export const metadata: Metadata = {
	title: 'Interview Prep Hub',
	description: 'Deep-dive articles for senior developer interviews',
}

export default function Home() {
	const { posts, totalPages } = getPaginatedPosts(1)

	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">All Posts</h1>
				<p className="text-[var(--fg-muted)]">
					Deep-dive articles for senior developer interviews
				</p>
			</div>
			<BlogList posts={posts} />
			<Pagination currentPage={1} totalPages={totalPages} basePath={paginationBase} />
		</>
	)
}
