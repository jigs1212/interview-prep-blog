import { getAllCategories, getPostsByCategory } from '@/lib/posts'
import BlogList from '@/components/blog/BlogList'

export function generateStaticParams() {
	return getAllCategories().map(cat => ({ name: cat.name }))
}

export function generateMetadata({ params }: { params: { name: string } }) {
	const name = decodeURIComponent(params.name)
	return {
		title: `${name} Posts`,
		description: `All posts in the ${name} category`,
	}
}

export default function CategoryPage({ params }: { params: { name: string } }) {
	const name = decodeURIComponent(params.name)
	const posts = getPostsByCategory(name)

	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">{name}</h1>
				<p className="text-[var(--fg-muted)]">
					{posts.length} post{posts.length !== 1 ? 's' : ''} in this category
				</p>
			</div>
			<BlogList posts={posts} />
		</>
	)
}
