import { getAllPosts } from './posts'
import type { SearchIndexItem } from '@/types/blog'

export function buildSearchIndex(): SearchIndexItem[] {
	return getAllPosts().map(({ slug, title, description, tags, category, date }) => ({
		slug,
		title,
		description,
		tags,
		category,
		date,
	}))
}
