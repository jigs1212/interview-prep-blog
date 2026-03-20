import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts'
import TableOfContents from '@/components/blog/TableOfContents'
import ShareButtons from '@/components/blog/ShareButtons'
import RelatedPosts from '@/components/blog/RelatedPosts'
import ReadingTime from '@/components/blog/ReadingTime'
import CategoryBadge from '@/components/ui/CategoryBadge'
import Tag from '@/components/ui/Tag'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.github.io/interview-prep-blog'

export function generateStaticParams() {
	return getAllPosts().map(post => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
	const post = getPostBySlug(params.slug)
	if (!post) return {}

	const url = `${siteUrl}/blog/${post.slug}/`
	const ogImage = `${siteUrl}/og/${post.slug}.png`

	return {
		title: post.title,
		description: post.description,
		alternates: { canonical: url },
		openGraph: {
			title: post.title,
			description: post.description,
			url,
			type: 'article',
			images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
		},
		twitter: {
			card: 'summary_large_image',
			title: post.title,
			description: post.description,
			images: [ogImage],
		},
	}
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
	const post = getPostBySlug(params.slug)
	if (!post) notFound()

	const related = getRelatedPosts(post.related)

	return (
		<div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
			{/* Left column — TOC */}
			<aside className="hidden lg:block">
				<div className="sticky top-24">
					<TableOfContents toc={post.toc} />
				</div>
			</aside>

			{/* Main column — Article */}
			<article className="min-w-0">
				<header className="mb-8">
					<h1 className="text-3xl font-bold mb-3">{post.title}</h1>
					<div className="flex items-center flex-wrap gap-3 mb-4">
						<span className="text-sm text-[var(--fg-muted)]">{post.date}</span>
						<span className="text-[var(--fg-muted)]">·</span>
						<ReadingTime minutes={post.readingTime} />
						<span className="text-[var(--fg-muted)]">·</span>
						<CategoryBadge name={post.category} />
					</div>
					<div className="flex flex-wrap gap-1.5">
						{post.tags.map(tag => (
							<Tag key={tag} name={tag} />
						))}
					</div>
				</header>

				{/* Mobile TOC */}
				<div className="lg:hidden mb-8 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
					<TableOfContents toc={post.toc} />
				</div>

				<div
					className="prose max-w-none"
					dangerouslySetInnerHTML={{ __html: post.content }}
				/>

				<div className="mt-8 pt-6 border-t border-[var(--border)]">
					<ShareButtons
						title={post.title}
						url={`${siteUrl}/blog/${post.slug}/`}
					/>
				</div>

				<RelatedPosts posts={related} />
			</article>
		</div>
	)
}
