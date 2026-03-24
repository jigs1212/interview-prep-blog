import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts'
import { SITE_URL, SITE_NAME, generateArticleJsonLd, generateBreadcrumbJsonLd, generateFaqJsonLd } from '@/lib/seo'
import ArticleLayout from '@/components/blog/ArticleLayout'
import ShareButtons from '@/components/blog/ShareButtons'
import RelatedPosts from '@/components/blog/RelatedPosts'
import ReadingTime from '@/components/blog/ReadingTime'
import CategoryBadge from '@/components/ui/CategoryBadge'
import Tag from '@/components/ui/Tag'
import PillarPageLink from '@/components/blog/PillarPageLink'
import LeadMagnet from '@/components/blog/LeadMagnet'
import TableOfContents from '@/components/blog/TableOfContents'

export function generateStaticParams() {
	return getAllPosts().map(post => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
	const post = getPostBySlug(params.slug)
	if (!post) return {}

	const url = `${SITE_URL}/${post.slug}/`
	const ogImage = `${SITE_URL}/og/${post.slug}.png`

	return {
		title: post.title,
		description: post.description,
		keywords: [...post.tags, post.category.toLowerCase(), 'interview questions', 'senior developer'],
		alternates: { canonical: url },
		openGraph: {
			title: post.title,
			description: post.description,
			url,
			type: 'article',
			publishedTime: post.date,
			modifiedTime: post.date,
			section: post.category,
			tags: post.tags,
			siteName: SITE_NAME,
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
	const articleJsonLd = generateArticleJsonLd(post)
	const breadcrumbJsonLd = generateBreadcrumbJsonLd([
		{ name: 'Home', url: SITE_URL },
		{ name: post.category, url: `${SITE_URL}/category/${post.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}/` },
		{ name: post.title },
	])
	const faqJsonLd = generateFaqJsonLd(post.faqs)

	return (
		<>
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
		/>
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
		/>
		{faqJsonLd && (
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
			/>
		)}
		<ArticleLayout slug={post.slug} toc={post.toc}>
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
					url={`${SITE_URL}/${post.slug}/`}
				/>
			</div>

			<PillarPageLink />
			<LeadMagnet />
			<RelatedPosts posts={related} />
		</ArticleLayout>
		</>
	)
}
