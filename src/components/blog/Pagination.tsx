import Link from 'next/link'

interface PaginationProps {
	currentPage: number
	totalPages: number
	basePath: string
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
	if (totalPages <= 1) return null

	function getPageNumbers(): (number | '...')[] {
		const pages: (number | '...')[] = []

		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) pages.push(i)
			return pages
		}

		pages.push(1)

		if (currentPage > 3) pages.push('...')

		const start = Math.max(2, currentPage - 1)
		const end = Math.min(totalPages - 1, currentPage + 1)
		for (let i = start; i <= end; i++) pages.push(i)

		if (currentPage < totalPages - 2) pages.push('...')

		pages.push(totalPages)
		return pages
	}

	const pages = getPageNumbers()

	return (
		<nav className="flex items-center justify-center gap-1 mt-10">
			{currentPage > 1 && (
				<Link
					href={`${basePath}/${currentPage - 1}/`}
					className="px-3 py-2 text-sm rounded border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
				>
					Previous
				</Link>
			)}

			{pages.map((page, i) =>
				page === '...' ? (
					<span key={`ellipsis-${i}`} className="px-2 py-2 text-sm text-[var(--fg-muted)]">
						...
					</span>
				) : (
					<Link
						key={page}
						href={`${basePath}/${page}/`}
						className={`px-3 py-2 text-sm rounded transition-colors ${
							page === currentPage
								? 'bg-[var(--accent)] text-[var(--bg)] font-medium'
								: 'border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)]'
						}`}
					>
						{page}
					</Link>
				)
			)}

			{currentPage < totalPages && (
				<Link
					href={`${basePath}/${currentPage + 1}/`}
					className="px-3 py-2 text-sm rounded border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
				>
					Next
				</Link>
			)}
		</nav>
	)
}
