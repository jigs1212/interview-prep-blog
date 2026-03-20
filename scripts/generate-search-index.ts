import fs from 'fs'
import path from 'path'
import { buildSearchIndex } from '../src/lib/search'

const outDir = path.join(process.cwd(), 'public')
const outPath = path.join(outDir, 'search-index.json')

if (!fs.existsSync(outDir)) {
	fs.mkdirSync(outDir, { recursive: true })
}

const index = buildSearchIndex()
fs.writeFileSync(outPath, JSON.stringify(index, null, 2))

const count = index.length
process.stdout.write(`Search index generated: ${count} posts → ${outPath}\n`)
