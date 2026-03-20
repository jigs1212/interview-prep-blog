import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { getAllPosts } from '../src/lib/posts'

const outDir = path.join(process.cwd(), 'public/og')

if (!fs.existsSync(outDir)) {
	fs.mkdirSync(outDir, { recursive: true })
}

function wrapText(text: string, maxChars: number): string[] {
	const words = text.split(' ')
	const lines: string[] = []
	let current = ''

	for (const word of words) {
		if ((current + ' ' + word).trim().length > maxChars) {
			if (current) lines.push(current.trim())
			current = word
		} else {
			current = current ? current + ' ' + word : word
		}
	}
	if (current) lines.push(current.trim())

	return lines.slice(0, 2)
}

async function generateImage(slug: string, title: string, category: string) {
	const outPath = path.join(outDir, `${slug}.png`)

	if (fs.existsSync(outPath)) {
		process.stdout.write(`Skipped (cached): ${slug}\n`)
		return
	}

	const width = 1200
	const height = 630
	const titleLines = wrapText(title, 40)

	const titleSvg = titleLines
		.map((line, i) => `<text x="80" y="${260 + i * 60}" font-family="sans-serif" font-size="48" font-weight="bold" fill="white">${escapeXml(line)}</text>`)
		.join('')

	const svg = `
		<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
					<path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
				</pattern>
			</defs>

			<rect width="${width}" height="${height}" fill="#0f172a"/>
			<rect width="${width}" height="${height}" fill="url(#grid)"/>

			<!-- Category badge -->
			<rect x="80" y="160" width="${category.length * 14 + 32}" height="36" rx="6" fill="#2563eb"/>
			<text x="96" y="184" font-family="sans-serif" font-size="16" font-weight="600" fill="white">${escapeXml(category)}</text>

			<!-- Title -->
			${titleSvg}

			<!-- Site name -->
			<text x="${width - 80}" y="${height - 60}" font-family="sans-serif" font-size="18" fill="#64748b" text-anchor="end">Interview Prep Hub</text>

			<!-- Bottom accent line -->
			<rect x="0" y="${height - 4}" width="${width}" height="4" fill="#2563eb"/>
		</svg>
	`

	await sharp(Buffer.from(svg))
		.png()
		.toFile(outPath)

	process.stdout.write(`Generated: ${slug}\n`)
}

function escapeXml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
}

async function main() {
	const posts = getAllPosts()

	for (const post of posts) {
		await generateImage(post.slug, post.title, post.category)
	}

	process.stdout.write(`\nOG images: ${posts.length} posts processed\n`)
}

main()
