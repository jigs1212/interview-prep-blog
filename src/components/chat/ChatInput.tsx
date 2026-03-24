'use client'

import { useState, useRef } from 'react'

interface ChatInputProps {
	onSend: (message: string) => void
	disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
	const [value, setValue] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const trimmed = value.trim()
		if (!trimmed || disabled) return
		onSend(trimmed)
		setValue('')
		inputRef.current?.focus()
	}

	return (
		<form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t border-[var(--border)]">
			<input
				ref={inputRef}
				type="text"
				value={value}
				onChange={e => setValue(e.target.value)}
				placeholder="Ask about this article..."
				disabled={disabled}
				className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-[var(--accent)]"
			/>
			<button
				type="submit"
				disabled={disabled || !value.trim()}
				className="px-3 py-2 bg-[var(--accent-muted)] border border-[var(--accent-border)] text-[var(--accent)] rounded-lg text-sm font-mono hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors disabled:opacity-50"
			>
				&#8594;
			</button>
		</form>
	)
}
