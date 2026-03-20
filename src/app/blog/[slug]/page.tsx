import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts'
import TableOfContents from '@/components/blog/TableOfContents'
import ShareButtons from '@/components/blog/ShareButtons'
import RelatedPosts from '@/components/blog/RelatedPosts'
import ReadingTime from '@/components/blog/ReadingTime'
import CategoryBadge from '@/components/ui/CategoryBadge'
import Tag from '@/components/ui/Tag'

const basePath = '/interview-prep-blog'

export function generateStaticParams() {
	return getAllPosts().map(post => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
	const post = getPostBySlug(params.slug)
	if (!post) return {}
	return {
		title: post.title,
		description: post.description,
	}
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
	const post = getPostBySlug(params.slug)
	if (!post) notFound()

	const related = getRelatedPosts(post.related)

	return (
		<div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10">
			<article>
				<header className="mb-8">
					<div className="flex items-center gap-3 mb-3">
						<CategoryBadge name={post.category} />
						<span className="text-sm text-[var(--fg-muted)]">{post.date}</span>
						<ReadingTime minutes={post.readingTime} />
					</div>
					<h1 className="text-3xl font-bold mb-3">{post.title}</h1>
					<p className="text-lg text-[var(--fg-muted)]">{post.description}</p>
					<div className="flex flex-wrap gap-1.5 mt-4">
						{post.tags.map(tag => (
							<Tag key={tag} name={tag} />
						))}
					</div>
				</header>

				<ShareButtons
					title={post.title}
					url={`${basePath}/blog/${post.slug}/`}
				/>

				<div
					className="prose mt-8"
					dangerouslySetInnerHTML={{ __html: post.content }}
				/>

				<RelatedPosts posts={related} />
			</article>

			<aside className="hidden lg:block">
				<TableOfContents toc={post.toc} />
			</aside>
		</div>
	)
}
