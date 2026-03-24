import Link from 'next/link'
import type { BlogPost } from '@/types/blog'

interface RelatedPostsProps {
	posts: BlogPost[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
	if (posts.length === 0) return null

	return (
		<section className="mt-12 pt-8 border-t border-[var(--border)]">
			<h3 className="text-lg font-semibold mb-4">Related Posts</h3>
			<div className="grid sm:grid-cols-2 gap-4">
				{posts.map(post => (
					<Link
						key={post.slug}
						href={`/${post.slug}/`}
						className="block p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-border)] hover:shadow-[0_0_16px_var(--accent-glow)] transition-all"
					>
						<span className="inline-block text-xs font-medium px-2.5 py-1 rounded mb-2 bg-[var(--accent-muted)] text-[var(--accent)]">
							{post.category}
						</span>
						<h4 className="font-medium mb-1">{post.title}</h4>
						<p className="text-sm text-[var(--fg-muted)] line-clamp-2">
							{post.description}
						</p>
					</Link>
				))}
			</div>
		</section>
	)
}
