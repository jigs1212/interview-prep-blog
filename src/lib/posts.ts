import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import readingTime from 'reading-time'
import { addHeadingIds, extractToc } from './toc'
import type { BlogPost, PaginatedResult, CategoryCount, TagCount } from '@/types/blog'

export const POSTS_PER_PAGE = 10

const contentDir = path.join(process.cwd(), 'src/content')

let cachedPosts: BlogPost[] | null = null

function parseMarkdown(content: string): string {
	const result = remark()
		.use(remarkGfm)
		.use(remarkHtml, { sanitize: false })
		.processSync(content)
	return result.toString()
}

export function getAllPosts(): BlogPost[] {
	if (cachedPosts) return cachedPosts

	const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'))

	const posts = files.map(filename => {
		const filePath = path.join(contentDir, filename)
		const raw = fs.readFileSync(filePath, 'utf-8')
		const { data, content } = matter(raw)
		const html = addHeadingIds(parseMarkdown(content))
		const stats = readingTime(content)
		const toc = extractToc(html)

		return {
			slug: data.slug as string,
			title: data.title as string,
			description: data.description as string,
			category: data.category as string,
			subcategory: data.subcategory as string,
			tags: (data.tags ?? []) as string[],
			date: data.date as string,
			related: (data.related ?? []) as string[],
			content: html,
			readingTime: stats.text,
			toc,
		}
	})

	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

	cachedPosts = posts
	return posts
}

export function getPostBySlug(slug: string): BlogPost | null {
	return getAllPosts().find(p => p.slug === slug) ?? null
}

export function getPostsByCategory(category: string): BlogPost[] {
	return getAllPosts().filter(p => p.category === category)
}

export function getPostsByTag(tag: string): BlogPost[] {
	return getAllPosts().filter(p => p.tags.includes(tag))
}

export function getAllCategories(): CategoryCount[] {
	const counts = new Map<string, number>()
	for (const post of getAllPosts()) {
		counts.set(post.category, (counts.get(post.category) ?? 0) + 1)
	}
	return Array.from(counts, ([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count)
}

export function getAllTags(): TagCount[] {
	const counts = new Map<string, number>()
	for (const post of getAllPosts()) {
		for (const tag of post.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1)
		}
	}
	return Array.from(counts, ([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count)
}

export function getPaginatedPosts(page: number, perPage = POSTS_PER_PAGE): PaginatedResult {
	const all = getAllPosts()
	const total = all.length
	const totalPages = Math.ceil(total / perPage)
	const start = (page - 1) * perPage
	const posts = all.slice(start, start + perPage)
	return { posts, total, totalPages }
}

export function getRelatedPosts(slugs: string[]): BlogPost[] {
	const all = getAllPosts()
	return slugs
		.map(slug => all.find(p => p.slug === slug))
		.filter((p): p is BlogPost => p !== undefined)
}
