import { getAllPosts } from '@/lib/posts'
import BlogList from '@/components/blog/BlogList'

export default function Home() {
	const posts = getAllPosts()

	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">All Posts</h1>
				<p className="text-[var(--fg-muted)]">
					Deep-dive articles for senior developer interviews
				</p>
			</div>
			<BlogList posts={posts} />
		</>
	)
}
