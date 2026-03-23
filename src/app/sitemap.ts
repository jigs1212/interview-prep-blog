import type { MetadataRoute } from 'next'
import { getAllPosts, getAllCategories, getAllTags, POSTS_PER_PAGE } from '@/lib/posts'
import { slugify } from '@/lib/utils'
import { SITE_URL } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
	const posts = getAllPosts()
	const categories = getAllCategories()
	const tags = getAllTags()
	const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

	const blogEntries: MetadataRoute.Sitemap = posts.map(post => ({
		url: `${SITE_URL}/${post.slug}/`,
		lastModified: new Date(post.date),
		priority: 0.8,
	}))

	const categoryEntries: MetadataRoute.Sitemap = categories.map(cat => ({
		url: `${SITE_URL}/category/${slugify(cat.name)}/`,
		priority: 0.6,
	}))

	const tagEntries: MetadataRoute.Sitemap = tags.map(tag => ({
		url: `${SITE_URL}/tag/${encodeURIComponent(tag.name)}/`,
		priority: 0.6,
	}))

	const pageEntries: MetadataRoute.Sitemap = Array.from(
		{ length: totalPages },
		(_, i) => ({
			url: `${SITE_URL}/page/${i + 1}/`,
			priority: 0.5,
		})
	)

	return [
		{ url: `${SITE_URL}/`, priority: 1.0 },
		{ url: `${SITE_URL}/senior-frontend-interview-questions/`, priority: 1.0, changeFrequency: 'weekly' },
		...blogEntries,
		...categoryEntries,
		...tagEntries,
		...pageEntries,
	]
}
