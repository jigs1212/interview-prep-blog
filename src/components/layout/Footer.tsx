export default function Footer() {
	const year = new Date().getFullYear()

	return (
		<footer className="border-t border-[var(--border)] mt-auto px-6 py-6 sm:px-10 lg:px-16 xl:px-24">
			<div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[var(--fg-muted)]">
				<p>
					Made with{' '}
					<span aria-label="love" className="text-red-500">♥</span>
					{' '}by{' '}
					<a
						href="https://jigarlodaya.online"
						target="_blank"
						rel="noopener noreferrer"
						className="text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline font-medium transition-colors"
					>
						Jigar Lodaya
					</a>
					{' '}· Built with Next.js SSG
				</p>
				<p>© {year} Interview Prep Hub</p>
			</div>
		</footer>
	)
}
