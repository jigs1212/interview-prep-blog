interface ReadingTimeProps {
	minutes: string
}

export default function ReadingTime({ minutes }: ReadingTimeProps) {
	return (
		<span className="inline-flex items-center gap-1 text-sm font-mono text-[var(--fg-muted)]">
			<svg
				className="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
			>
				<circle cx="12" cy="12" r="10" />
				<path d="M12 6v6l4 2" />
			</svg>
			{minutes}
		</span>
	)
}
