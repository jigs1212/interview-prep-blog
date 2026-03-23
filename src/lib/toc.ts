import type { TocItem, FaqItem } from '@/types/blog'

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim()
}

export function addHeadingIds(htmlContent: string): string {
	return htmlContent.replace(/<h([23])([^>]*)>(.*?)<\/h[23]>/gi, (_match, level, attrs, inner) => {
		const text = inner.replace(/<[^>]*>/g, '').trim()
		const id = slugify(text)
		return `<h${level}${attrs} id="${id}">${inner}</h${level}>`
	})
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

export function extractFaqs(htmlContent: string): FaqItem[] {
	const faqs: FaqItem[] = []
	const faqRegex = /<h[23][^>]*>(.*?\?)<\/h[23]>([\s\S]*?)(?=<h[23][^>]*>|$)/gi
	let match: RegExpExecArray | null

	while ((match = faqRegex.exec(htmlContent)) !== null) {
		const question = match[1].replace(/<[^>]*>/g, '').trim()
		const answerHtml = match[2].trim()
		const answer = answerHtml
			.replace(/<[^>]*>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()

		if (question && answer) {
			faqs.push({ question, answer: answer.slice(0, 500) })
		}
	}

	return faqs
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
