import { getAllCategories, getPostsByCategory } from '@/lib/posts'
import { slugify } from '@/lib/utils'
import BlogList from '@/components/blog/BlogList'
import type { Metadata } from 'next'

export function generateStaticParams() {
	return getAllCategories().map(cat => ({ name: slugify(cat.name) }))
}

export function generateMetadata({ params }: { params: { name: string } }): Metadata {
	const category = findCategoryBySlug(params.name)
	return {
		title: `${category} Interview Prep Articles — Interview Prep Hub`,
		description: `All posts in the ${category} category`,
	}
}

function findCategoryBySlug(slug: string): string {
	const categories = getAllCategories()
	const match = categories.find(c => slugify(c.name) === slug)
	return match?.name ?? decodeURIComponent(slug)
}

export default function CategoryPage({ params }: { params: { name: string } }) {
	const name = findCategoryBySlug(params.name)
	const posts = getPostsByCategory(name)

	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">{name}</h1>
				<p className="text-[var(--fg-muted)]">
					{posts.length === 0
						? 'No posts in this category yet.'
						: `${posts.length} post${posts.length !== 1 ? 's' : ''} in this category`}
				</p>
			</div>
			<BlogList posts={posts} />
		</>
	)
}
