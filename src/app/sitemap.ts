import type { MetadataRoute } from 'next'
import { getAllPosts, getAllCategories, getAllTags, POSTS_PER_PAGE } from '@/lib/posts'
import { slugify } from '@/lib/utils'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.github.io/interview-prep-blog'

export default function sitemap(): MetadataRoute.Sitemap {
	const posts = getAllPosts()
	const categories = getAllCategories()
	const tags = getAllTags()
	const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

	const blogEntries: MetadataRoute.Sitemap = posts.map(post => ({
		url: `${siteUrl}/blog/${post.slug}/`,
		lastModified: new Date(post.date),
		priority: 0.8,
	}))

	const categoryEntries: MetadataRoute.Sitemap = categories.map(cat => ({
		url: `${siteUrl}/category/${slugify(cat.name)}/`,
		priority: 0.6,
	}))

	const tagEntries: MetadataRoute.Sitemap = tags.map(tag => ({
		url: `${siteUrl}/tag/${encodeURIComponent(tag.name)}/`,
		priority: 0.6,
	}))

	const pageEntries: MetadataRoute.Sitemap = Array.from(
		{ length: totalPages },
		(_, i) => ({
			url: `${siteUrl}/page/${i + 1}/`,
			priority: 0.5,
		})
	)

	return [
		{ url: `${siteUrl}/`, priority: 1.0 },
		...blogEntries,
		...categoryEntries,
		...tagEntries,
		...pageEntries,
	]
}
