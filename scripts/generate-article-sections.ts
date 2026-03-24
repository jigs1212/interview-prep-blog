import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface ArticleSection {
	heading: string
	content: string
	level: number
}

const contentDir = path.join(process.cwd(), 'src/content')
const outDir = path.join(process.cwd(), 'public/article-sections')

if (!fs.existsSync(outDir)) {
	fs.mkdirSync(outDir, { recursive: true })
}

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'))

let totalSections = 0

for (const filename of files) {
	const filePath = path.join(contentDir, filename)
	const raw = fs.readFileSync(filePath, 'utf-8')
	const { data, content } = matter(raw)
	const slug = data.slug as string

	const sections: ArticleSection[] = []
	const lines = content.split('\n')
	let currentHeading = data.title as string
	let currentLevel = 1
	let currentContent: string[] = []

	for (const line of lines) {
		const h2Match = line.match(/^## (.+)/)
		const h3Match = line.match(/^### (.+)/)

		if (h2Match || h3Match) {
			if (currentContent.length > 0) {
				sections.push({
					heading: currentHeading,
					content: currentContent.join('\n').trim(),
					level: currentLevel,
				})
			}
			currentHeading = (h2Match ? h2Match[1] : h3Match![1]).trim()
			currentLevel = h2Match ? 2 : 3
			currentContent = []
		} else {
			currentContent.push(line)
		}
	}

	if (currentContent.length > 0) {
		sections.push({
			heading: currentHeading,
			content: currentContent.join('\n').trim(),
			level: currentLevel,
		})
	}

	const outPath = path.join(outDir, `${slug}.json`)
	fs.writeFileSync(outPath, JSON.stringify(sections, null, 2))
	totalSections += sections.length
}

process.stdout.write(`Article sections generated: ${files.length} articles, ${totalSections} sections → ${outDir}\n`)
