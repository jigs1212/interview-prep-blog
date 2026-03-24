export interface ArticleSection {
	heading: string
	content: string
	level: number
}

export interface ChatMessage {
	role: 'user' | 'assistant'
	content: string
}

export interface ChatResponse {
	answer: string
	relevantSections: string[]
	confidence: number
	error?: string
}

export interface ChatProvider {
	init(sections: ArticleSection[]): void
	getAnswer(question: string, history?: ChatMessage[]): Promise<ChatResponse>
}
