import fs from 'fs/promises'
import path from 'path'

const outputDir = path.join(process.cwd(), 'out')
const targetDir = path.join(outputDir, 'interview-prep-blog')

async function exists(dirPath) {
	try {
		await fs.access(dirPath)
		return true
	} catch {
		return false
	}
}

async function main() {
	if (!(await exists(outputDir))) {
		console.log('Skipping nesting: out directory does not exist.')
		return
	}

	await fs.rm(targetDir, { recursive: true, force: true })
	await fs.mkdir(targetDir, { recursive: true })

	const entries = await fs.readdir(outputDir, { withFileTypes: true })
	for (const entry of entries) {
		if (entry.name === 'interview-prep-blog') continue
		const src = path.join(outputDir, entry.name)
		const dest = path.join(targetDir, entry.name)
		await fs.rename(src, dest)
	}

	console.log('Nested static export under out/interview-prep-blog.')
}

main().catch(err => {
	console.error('Failed to nest export output:', err)
	process.exit(1)
})
