import { getAllCategories, getPostsByCategory } from '@/lib/posts'
import { slugify } from '@/lib/utils'
import { SITE_URL } from '@/lib/seo'
import BlogList from '@/components/blog/BlogList'
import type { Metadata } from 'next'

export function generateStaticParams() {
	return getAllCategories().map(cat => ({ name: slugify(cat.name) }))
}

export function generateMetadata({ params }: { params: { name: string } }): Metadata {
	const category = findCategoryBySlug(params.name)
	const url = `${SITE_URL}/category/${params.name}/`
	return {
		title: `${category} Interview Questions & Answers`,
		description: `Senior developer interview preparation articles covering ${category} concepts, patterns, and best practices.`,
		alternates: { canonical: url },
		openGraph: { url },
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
