import { getAllPosts, getPaginatedPosts, POSTS_PER_PAGE } from '@/lib/posts'
import BlogList from '@/components/blog/BlogList'
import Pagination from '@/components/blog/Pagination'

const basePath = '/interview-prep-blog/page'

export function generateStaticParams() {
	const total = getAllPosts().length
	const totalPages = Math.ceil(total / POSTS_PER_PAGE)
	return Array.from({ length: totalPages }, (_, i) => ({
		number: String(i + 1),
	}))
}

export function generateMetadata({ params }: { params: { number: string } }) {
	return {
		title: `Page ${params.number}`,
		description: `Blog posts — page ${params.number}`,
	}
}

export default function PaginatedPage({ params }: { params: { number: string } }) {
	const page = parseInt(params.number)
	const { posts, totalPages } = getPaginatedPosts(page)

	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">All Posts</h1>
				<p className="text-[var(--fg-muted)]">Page {page} of {totalPages}</p>
			</div>
			<BlogList posts={posts} />
			<Pagination currentPage={page} totalPages={totalPages} basePath={basePath} />
		</>
	)
}
