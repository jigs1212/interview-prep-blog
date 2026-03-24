import Link from 'next/link'

interface CategoryBadgeProps {
	name: string
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim()
}

export default function CategoryBadge({ name }: CategoryBadgeProps) {
	return (
		<Link
			href={`/category/${slugify(name)}/`}
			className="inline-block text-xs font-medium px-2.5 py-1 rounded bg-[var(--accent-muted)] text-[var(--accent)] hover:bg-[var(--accent-border)] transition-colors"
		>
			{name}
		</Link>
	)
}
