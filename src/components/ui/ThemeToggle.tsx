'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
	const [dark, setDark] = useState(false)

	useEffect(() => {
		setDark(document.documentElement.classList.contains('dark'))
	}, [])

	function toggle() {
		const isDark = document.documentElement.classList.toggle('dark')
		const theme = isDark ? 'dark' : 'light'
		document.documentElement.setAttribute('data-theme', theme)
		setDark(isDark)
		try {
			localStorage.setItem('theme', theme)
		} catch {}
	}

	return (
		<button
			onClick={toggle}
			aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
			className="p-2 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-secondary)] transition-colors"
		>
			{dark ? (
				// Sun icon
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
					<circle cx="12" cy="12" r="4" />
					<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
				</svg>
			) : (
				// Moon icon
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
				</svg>
			)}
		</button>
	)
}
