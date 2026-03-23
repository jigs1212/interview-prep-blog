import { redirect } from 'next/navigation'
import { getAllPosts, getPaginatedPosts, POSTS_PER_PAGE } from '@/lib/posts'
import { SITE_URL } from '@/lib/seo'
import BlogList from '@/components/blog/BlogList'
import Pagination from '@/components/blog/Pagination'

const paginationBase = '/page'

export function generateStaticParams() {
	const total = getAllPosts().length
	const totalPages = Math.ceil(total / POSTS_PER_PAGE)
	return Array.from({ length: totalPages }, (_, i) => ({
		number: String(i + 1),
	}))
}

export function generateMetadata({ params }: { params: { number: string } }) {
	const page = parseInt(params.number)
	const { totalPages } = getPaginatedPosts(page)
	const url = `${SITE_URL}/page/${page}/`
	return {
		title: `Page ${page} of ${totalPages}`,
		description: `Senior developer interview prep articles — page ${page} of ${totalPages}.`,
		alternates: { canonical: url },
		robots: { index: false, follow: true },
	}
}

export default function PaginatedPage({ params }: { params: { number: string } }) {
	if (params.number === '1') {
		redirect('/')
	}

	const page = parseInt(params.number)
	const { posts, totalPages } = getPaginatedPosts(page)

	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">All Posts</h1>
				<p className="text-[var(--fg-muted)]">Page {page} of {totalPages}</p>
			</div>
			<BlogList posts={posts} />
			<Pagination currentPage={page} totalPages={totalPages} basePath={paginationBase} />
		</>
	)
}
