'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { FuseProvider } from '@/lib/chat/fuseProvider'
import type { ChatMessage as ChatMessageType, ArticleSection } from '@/lib/chat/chatProvider'

interface ChatDrawerProps {
	slug: string
}

export default function ChatDrawer({ slug }: ChatDrawerProps) {
	const [isOpen, setIsOpen] = useState(true)
	const [messages, setMessages] = useState<ChatMessageType[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isMounted, setIsMounted] = useState(false)
	const providerRef = useRef(new FuseProvider())
	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		setIsMounted(true)
		const saved = localStorage.getItem('chatDrawerOpen')
		if (saved !== null) {
			setIsOpen(saved !== 'false')
		}
	}, [])

	useEffect(() => {
		async function loadSections() {
			try {
				const res = await fetch(`/article-sections/${slug}.json`)
				if (!res.ok) return
				const sections: ArticleSection[] = await res.json()
				providerRef.current.init(sections)
			} catch {
				// Sections not available for this article
			}
		}
		loadSections()
	}, [slug])

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const toggle = useCallback(() => {
		setIsOpen(prev => {
			const next = !prev
			localStorage.setItem('chatDrawerOpen', String(next))
			return next
		})
	}, [])

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
				e.preventDefault()
				toggle()
			}
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [toggle])

	const handleSend = async (question: string) => {
		const userMessage: ChatMessageType = { role: 'user', content: question }
		setMessages(prev => [...prev, userMessage])
		setIsLoading(true)

		try {
			const response = await providerRef.current.getAnswer(question, messages)
			const assistantMessage: ChatMessageType = {
				role: 'assistant',
				content: response.answer,
			}
			setMessages(prev => [...prev, assistantMessage])
		} catch {
			setMessages(prev => [
				...prev,
				{ role: 'assistant', content: 'Something went wrong. Please try again.' },
			])
		} finally {
			setIsLoading(false)
		}
	}

	if (!isMounted) return null

	return (
		<>
			{/* Drawer */}
			<div
				className={`fixed top-0 right-0 h-full w-[320px] bg-[var(--bg)] border-l border-[var(--border)] z-30 flex flex-col transition-transform duration-300 ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				} lg:w-[320px] max-lg:w-full`}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" style={{ boxShadow: '0 0 8px var(--accent-glow)' }} />
						<span className="text-xs font-mono font-semibold text-[var(--accent)] tracking-wider">AI CHAT</span>
					</div>
					<button
						onClick={toggle}
						className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors p-1"
						aria-label="Close chat"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 sidebar-scroll">
					{messages.length === 0 && (
						<div className="text-center text-[var(--fg-muted)] text-sm mt-8">
							<div className="font-mono text-[var(--accent)] mb-2">&#62;_</div>
							<p>Ask me anything about this article</p>
						</div>
					)}
					{messages.map((msg, i) => (
						<ChatMessage key={i} message={msg} />
					))}
					{isLoading && (
						<div className="flex justify-start">
							<div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--fg-muted)]">
								<span className="animate-pulse">Searching article...</span>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Input */}
				<ChatInput onSend={handleSend} disabled={isLoading} />
			</div>
		</>
	)
}
