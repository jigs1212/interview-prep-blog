import type { BlogPost, FaqItem } from '@/types/blog'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://int-prep.jigarlodaya.online'
export const SITE_NAME = 'Interview Prep Hub'
export const SITE_DESCRIPTION = 'Deep-dive articles for senior developer interviews'

export function generateArticleJsonLd(post: BlogPost) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: post.title,
		description: post.description,
		datePublished: post.date,
		dateModified: post.date,
		author: {
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE_URL,
		},
		publisher: {
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE_URL,
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `${SITE_URL}/blog/${post.slug}/`,
		},
		image: `${SITE_URL}/og/${post.slug}.png`,
		articleSection: post.category,
		keywords: post.tags.join(', '),
	}
}

export function generateWebSiteJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		description: SITE_DESCRIPTION,
		url: SITE_URL,
	}
}

export function generateFaqJsonLd(faqs: FaqItem[]) {
	if (faqs.length === 0) return null
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map(faq => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer,
			},
		})),
	}
}

export function generateBreadcrumbJsonLd(items: { name: string, url?: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			...(item.url ? { item: item.url } : {}),
		})),
	}
}
