// Custom frontmatter parser — no gray-matter dependency
// Handles: strings, quoted strings, inline arrays [a, b], multiline arrays (- item)
function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return { data: {}, content: raw }
  const closeIdx = raw.indexOf('\n---', 3)
  if (closeIdx === -1) return { data: {}, content: raw }
  const yaml = raw.slice(4, closeIdx).trim()
  const content = raw.slice(closeIdx + 4).trim()
  const data = {}
  const lines = yaml.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const ci = line.indexOf(':')
    if (ci === -1) { i++; continue }
    const key = line.slice(0, ci).trim()
    const val = line.slice(ci + 1).trim()
    if (val === '') {
      const arr = []
      i++
      while (i < lines.length && /^\s*-\s/.test(lines[i])) {
        arr.push(lines[i].replace(/^\s*-\s*/, '').replace(/^['"]|['"]$/g, '').trim())
        i++
      }
      data[key] = arr
      continue
    }
    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val.slice(1, -1).split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''))
    } else {
      data[key] = val.replace(/^['"]|['"]$/g, '')
    }
    i++
  }
  return { data, content }
}

const rawModules = import.meta.glob('../../content/articles/*.md', { query: '?raw', import: 'default', eager: true })

export const allArticles = Object.entries(rawModules).map(([path, raw]) => {
  const { data, content } = parseFrontmatter(raw)
  return {
    ...data,
    content,
    slug: data.slug || path.split('/').pop().replace('.md', ''),
    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
    featured: data.featured === 'true' || data.featured === true,
  }
}).sort((a, b) => new Date(b.date) - new Date(a.date))

export function getArticleBySlug(slug) {
  return allArticles.find(a => a.slug === slug)
}

export function getArticlesByCategory(category) {
  return allArticles.filter(a => a.category === category)
}

export function getFeaturedArticle() {
  return allArticles.find(a => a.featured) || allArticles[0]
}

export function getTrendingArticles(limit = 5) {
  return allArticles.slice(0, limit)
}

export function searchArticles(query) {
  const q = query.toLowerCase()
  return allArticles.filter(a =>
    a.title?.toLowerCase().includes(q) ||
    a.subtitle?.toLowerCase().includes(q) ||
    (Array.isArray(a.tags) && a.tags.some(t => t.toLowerCase().includes(q))) ||
    a.category?.toLowerCase().includes(q)
  )
}

export const CATEGORIES = ['News', 'Eat & Drink', 'Things To Do', 'Expat Life', 'Nightlife', 'Guides', 'Events', 'Real Estate']

export const CATEGORY_COLORS = {
  'News': 'bg-red-600',
  'Eat & Drink': 'bg-orange-500',
  'Things To Do': 'bg-emerald-600',
  'Expat Life': 'bg-blue-600',
  'Nightlife': 'bg-purple-600',
  'Guides': 'bg-teal-600',
  'Events': 'bg-pink-600',
  'Real Estate': 'bg-amber-600',
}

export const CATEGORY_TEXT_COLORS = {
  'News': 'text-red-600',
  'Eat & Drink': 'text-orange-500',
  'Things To Do': 'text-emerald-600',
  'Expat Life': 'text-blue-600',
  'Nightlife': 'text-purple-600',
  'Guides': 'text-teal-600',
  'Events': 'text-pink-600',
  'Real Estate': 'text-amber-600',
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function categoryToSlug(cat) {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function slugToCategory(slug) {
  return CATEGORIES.find(c => categoryToSlug(c) === slug) || slug
}
