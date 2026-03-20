import Link from 'next/link'

interface CategoryBadgeProps {
	name: string
}

const basePath = '/interview-prep-blog'

export default function CategoryBadge({ name }: CategoryBadgeProps) {
	return (
		<Link
			href={`${basePath}/category/${encodeURIComponent(name)}/`}
			className="inline-block text-xs font-medium px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-300"
		>
			{name}
		</Link>
	)
}
