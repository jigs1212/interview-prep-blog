export interface TocItem {
	id: string
	text: string
	level: 2 | 3
	children: TocItem[]
}

export interface BlogPost {
	slug: string
	title: string
	description: string
	category: string
	subcategory: string
	tags: string[]
	date: string
	related: string[]
	content: string
	readingTime: string
	toc: TocItem[]
}

export interface SearchIndexItem {
	slug: string
	title: string
	description: string
	tags: string[]
	category: string
	date: string
}

export interface PaginatedResult {
	posts: BlogPost[]
	total: number
	totalPages: number
}

export interface CategoryCount {
	name: string
	count: number
}

export interface TagCount {
	name: string
	count: number
}
