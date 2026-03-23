import Link from 'next/link'
import type { BlogPost } from '@/types/blog'
import CategoryBadge from '@/components/ui/CategoryBadge'
import Tag from '@/components/ui/Tag'
import ReadingTime from './ReadingTime'

interface BlogCardProps {
	post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
	return (
		<article className="group relative border border-[var(--border)] rounded-lg p-6 hover:shadow-md hover:border-[var(--fg-muted)] transition-all">
			<div className="flex items-center gap-3 mb-3 relative z-10">
				<CategoryBadge name={post.category} />
				<span className="text-sm text-[var(--fg-muted)]">{post.date}</span>
				<ReadingTime minutes={post.readingTime} />
			</div>

			<Link href={`/${post.slug}/`} className="block">
				<h2 className="text-xl font-semibold mb-2 text-[var(--accent)] group-hover:underline transition-colors">
					{post.title}
				</h2>
				<p className="text-[var(--fg-muted)] mb-4 line-clamp-2">
					{post.description}
				</p>
			</Link>

			<div className="flex flex-wrap gap-1.5 relative z-10">
				{post.tags.map(tag => (
					<Tag key={tag} name={tag} />
				))}
			</div>

			{/* Full card click area */}
			<Link
			href={`/${post.slug}/`}
			className="absolute inset-0 z-0"
				aria-hidden="true"
				tabIndex={-1}
			/>
		</article>
	)
}
