import Link from 'next/link'

interface TagProps {
	name: string
}

const basePath = '/interview-prep-blog'

export default function Tag({ name }: TagProps) {
	return (
		<Link
			href={`${basePath}/tag/${encodeURIComponent(name)}/`}
			className="inline-block text-xs px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--fg-muted)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
		>
			{name}
		</Link>
	)
}
