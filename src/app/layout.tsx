import type { Metadata } from 'next'
import { getAllCategories, getAllTags } from '@/lib/posts'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import './globals.css'

export const metadata: Metadata = {
	title: {
		default: 'Interview Prep Hub',
		template: '%s | Interview Prep Hub',
	},
	description: 'Deep-dive articles for senior developer interviews',
	openGraph: {
		type: 'website',
		locale: 'en_US',
		siteName: 'Interview Prep Hub',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const categories = getAllCategories()
	const tags = getAllTags()

	return (
		<html lang="en">
			<body className="antialiased bg-[var(--bg)] text-[var(--fg)]">
				<div className="flex min-h-screen">
					<Sidebar categories={categories} tags={tags} />
					<div className="flex-1 lg:ml-[260px]">
						<Header categories={categories} tags={tags} />
						<main className="px-6 py-8 sm:px-10 lg:px-16 xl:px-24">
							{children}
						</main>
					</div>
				</div>
			</body>
		</html>
	)
}
