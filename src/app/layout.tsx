import type { Metadata } from 'next'
import { getAllCategories, getAllTags } from '@/lib/posts'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	openGraph: {
		type: 'website',
		locale: 'en_US',
		siteName: SITE_NAME,
		url: SITE_URL,
	},
	alternates: {
		canonical: SITE_URL,
	},
}

// Inline script runs before React hydrates to avoid flash of wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const categories = getAllCategories()
	const tags = getAllTags()

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body className="antialiased bg-[var(--bg)] text-[var(--fg)]">
				<div className="flex min-h-screen flex-col">
					<div className="flex flex-1">
						<Sidebar categories={categories} tags={tags} />
						<div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
							<Header categories={categories} tags={tags} />
							<main className="flex-1 px-6 py-8 sm:px-10 lg:px-16 xl:px-24">
								{children}
							</main>
							<Footer />
						</div>
					</div>
				</div>
			</body>
		</html>
	)
}
