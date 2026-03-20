import Link from 'next/link'
import type { BlogPost } from '@/types/blog'
import CategoryBadge from '@/components/ui/CategoryBadge'

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
						href={`/blog/${post.slug}/`}
						className="block p-4 rounded-lg border border-[var(--border)] hover:border-[var(--fg-muted)] hover:shadow-sm transition-all"
					>
						<div className="mb-2">
							<CategoryBadge name={post.category} />
						</div>
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
