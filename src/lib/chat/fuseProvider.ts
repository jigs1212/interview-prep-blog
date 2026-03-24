import Fuse from 'fuse.js'
import type { ArticleSection, ChatProvider, ChatMessage, ChatResponse } from './chatProvider'

export class FuseProvider implements ChatProvider {
	private fuse: Fuse<ArticleSection> | null = null
	private sections: ArticleSection[] = []

	init(sections: ArticleSection[]): void {
		this.sections = sections
		this.fuse = new Fuse(sections, {
			keys: [
				{ name: 'heading', weight: 0.4 },
				{ name: 'content', weight: 0.6 },
			],
			threshold: 0.4,
			includeScore: true,
			minMatchCharLength: 2,
		})
	}

	async getAnswer(question: string, _history?: ChatMessage[]): Promise<ChatResponse> {
		if (!this.fuse || this.sections.length === 0) {
			return {
				answer: 'No article content loaded yet.',
				relevantSections: [],
				confidence: 0,
				error: 'Provider not initialized',
			}
		}

		const results = this.fuse.search(question, { limit: 3 })

		if (results.length === 0) {
			return {
				answer: 'I couldn\'t find relevant information about that in this article. Try rephrasing your question.',
				relevantSections: [],
				confidence: 0,
			}
		}

		const topResults = results.slice(0, 3)
		const bestScore = 1 - (topResults[0].score ?? 1)

		const answer = topResults
			.map(r => {
				const section = r.item
				const preview = section.content.length > 300
					? section.content.slice(0, 300) + '...'
					: section.content
				return `**${section.heading}**\n${preview}`
			})
			.join('\n\n---\n\n')

		return {
			answer,
			relevantSections: topResults.map(r => r.item.heading),
			confidence: bestScore,
		}
	}
}
