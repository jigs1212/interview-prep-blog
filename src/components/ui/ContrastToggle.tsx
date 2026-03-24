'use client'

import { useState, useEffect } from 'react'

export default function ContrastToggle() {
	const [isHigh, setIsHigh] = useState(false)
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
		const contrast = localStorage.getItem('contrast')
		if (contrast === 'high') {
			setIsHigh(true)
		}
	}, [])

	const toggleContrast = () => {
		const next = !isHigh
		setIsHigh(next)
		const value = next ? 'high' : 'normal'
		document.documentElement.setAttribute('data-contrast', value)
		localStorage.setItem('contrast', value)
	}

	if (!isMounted) return null

	return (
		<button
			onClick={toggleContrast}
			className="p-2 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-secondary)] transition-colors"
			title={isHigh ? 'Standard contrast' : 'High contrast'}
			aria-label={isHigh ? 'Switch to standard contrast' : 'Switch to high contrast'}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<circle cx="12" cy="12" r="10" />
				<path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" />
			</svg>
		</button>
	)
}
