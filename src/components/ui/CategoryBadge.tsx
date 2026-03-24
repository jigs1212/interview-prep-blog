import Link from 'next/link'
import { slugify } from '@/lib/utils'

interface CategoryBadgeProps {
	name: string
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
