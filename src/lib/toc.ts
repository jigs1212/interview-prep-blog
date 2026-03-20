import type { TocItem } from '@/types/blog'

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim()
}

export function extractToc(htmlContent: string): TocItem[] {
	const headingRegex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi
	const items: TocItem[] = []
	let match: RegExpExecArray | null

	while ((match = headingRegex.exec(htmlContent)) !== null) {
		const level = parseInt(match[1]) as 2 | 3
		const text = match[2].replace(/<[^>]*>/g, '').trim()
		const id = slugify(text)

		if (level === 2) {
			items.push({ id, text, level, children: [] })
		} else if (level === 3 && items.length > 0) {
			items[items.length - 1].children.push({ id, text, level, children: [] })
		} else {
			items.push({ id, text, level, children: [] })
		}
	}

	return items
}

export function generateTocHtml(toc: TocItem[]): string {
	if (toc.length === 0) return ''

	const lis = toc.map(item => {
		let li = `<li><a href="#${item.id}">${item.text}</a>`
		if (item.children.length > 0) {
			const childLis = item.children
				.map(child => `<li><a href="#${child.id}">${child.text}</a></li>`)
				.join('')
			li += `<ul>${childLis}</ul>`
		}
		li += '</li>'
		return li
	}).join('')

	return `<ul>${lis}</ul>`
}
