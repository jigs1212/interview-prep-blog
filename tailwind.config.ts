import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				sidebar: '#0f172a',
				'sidebar-hover': '#1e293b',
				'sidebar-text': '#94a3b8',
				'sidebar-active': '#e2e8f0',
			},
			fontSize: {
				body: ['1.125rem', { lineHeight: '1.75rem' }],
			},
		},
	},
	plugins: [],
}
export default config
