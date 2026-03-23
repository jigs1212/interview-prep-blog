import { getAllTags, getPostsByTag } from '@/lib/posts'
import { SITE_URL } from '@/lib/seo'
import BlogList from '@/components/blog/BlogList'
import type { Metadata } from 'next'

export function generateStaticParams() {
	return getAllTags().map(tag => ({ tag: tag.name }))
}

export function generateMetadata({ params }: { params: { tag: string } }): Metadata {
	const tag = decodeURIComponent(params.tag)
	const url = `${SITE_URL}/tag/${encodeURIComponent(tag)}/`
	return {
		title: `${tag} — Interview Prep Articles`,
		description: `Interview preparation articles tagged with "${tag}" — covering concepts, code examples, and common interview questions.`,
		alternates: { canonical: url },
		openGraph: { url },
	}
}

export default function TagPage({ params }: { params: { tag: string } }) {
	const tag = decodeURIComponent(params.tag)
	const posts = getPostsByTag(tag)

	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">#{tag}</h1>
				<p className="text-[var(--fg-muted)]">
					{posts.length === 0
						? 'No posts with this tag yet.'
						: `${posts.length} post${posts.length !== 1 ? 's' : ''} with this tag`}
				</p>
			</div>
			<BlogList posts={posts} />
		</>
	)
}
