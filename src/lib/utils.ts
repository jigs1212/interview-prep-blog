import { format, parseISO } from 'date-fns'

export function formatDate(date: string): string {
	return format(parseISO(date), 'MMMM d, yyyy')
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim()
}
