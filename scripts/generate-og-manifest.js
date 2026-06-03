import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const articlesDir = join(__dirname, '../content/articles')
const outputPath = join(__dirname, '../public/og-manifest.json')

function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return {}
  const closeIdx = raw.indexOf('\n---', 3)
  if (closeIdx === -1) return {}
  const yaml = raw.slice(4, closeIdx).trim()
  const data = {}
  for (const line of yaml.split('\n')) {
    const ci = line.indexOf(':')
    if (ci === -1) continue
    const key = line.slice(0, ci).trim()
    const val = line.slice(ci + 1).trim().replace(/^['"]|['"]$/g, '')
    if (val) data[key] = val
  }
  return data
}

const manifest = {}
for (const file of readdirSync(articlesDir)) {
  if (!file.endsWith('.md')) continue
  const raw = readFileSync(join(articlesDir, file), 'utf-8')
  const data = parseFrontmatter(raw)
  const slug = data.slug || file.replace('.md', '')
  manifest[slug] = {
    title: data.title || '',
    subtitle: data.subtitle || '',
    heroImage: data.ogImage || data.heroImage || '',
  }
}

writeFileSync(outputPath, JSON.stringify(manifest, null, 2))
console.log(`OG manifest written with ${Object.keys(manifest).length} articles.`)
