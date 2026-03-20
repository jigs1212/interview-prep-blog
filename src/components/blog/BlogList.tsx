import type { BlogPost } from '@/types/blog'
import BlogCard from './BlogCard'

interface BlogListProps {
	posts: BlogPost[]
}

export default function BlogList({ posts }: BlogListProps) {
	if (posts.length === 0) {
		return (
			<p className="text-[var(--fg-muted)] text-center py-12">
				No posts found.
			</p>
		)
	}

	return (
		<div className="grid gap-6">
			{posts.map(post => (
				<BlogCard key={post.slug} post={post} />
			))}
		</div>
	)
}
