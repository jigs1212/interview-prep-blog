import type { ChatMessage as ChatMessageType } from '@/lib/chat/chatProvider'

interface ChatMessageProps {
	message: ChatMessageType
}

export default function ChatMessage({ message }: ChatMessageProps) {
	const isUser = message.role === 'user'

	return (
		<div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
					isUser
						? 'bg-[var(--accent-muted)] border border-[var(--accent-border)] text-[var(--fg)]'
						: 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--fg-muted)]'
				}`}
			>
				<div className="whitespace-pre-wrap break-words">{message.content}</div>
			</div>
		</div>
	)
}
