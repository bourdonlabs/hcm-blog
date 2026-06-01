import { useState } from 'react'
import { MTL_STYLE_GUIDE } from '../data/mtlStyleGuide.js'

const CATEGORIES = [
  'Eat & Drink',
  'News',
  'Things To Do',
  'Expat Life',
  'Nightlife',
  'Guides',
  'Real Estate',
  'Events',
]

const ANGLES = [
  'Breaking News',
  'Lifestyle Discovery',
  'Expat Survival',
  'Fun Weekend',
  'Serious Guide',
]

function buildSystemPrompt(styleGuide) {
  return `You are an expert writer for HCM Blog, Saigon's English-language news and lifestyle media for expats and culturally curious locals — modeled after MTL Blog in Montreal.

## WRITING STYLE GUIDE (based on MTL Blog analysis)

${styleGuide}

## HCM BLOG ADAPTATIONS
- All locations use Ho Chi Minh City neighborhoods: District 1, District 3, Thao Dien (District 2), Binh Thanh, Phu Nhuan, Go Vap, Thu Duc City, etc.
- Prices in VND (e.g. 150,000 VND / ~$6 USD). Always give both.
- Use local street names: Bui Vien, Dong Khoi, Nguyen Hue, Le Van Sy, Vo Thi Sau, Ham Nghi, etc.
- Audience: English-speaking expats, foreigners, and culturally curious locals aged 25–45
- Write in present tense throughout
- Paragraphs: maximum 3 sentences, punchy and direct
- Tone: enthusiastic but not cringe, insider knowledge, never tourist-brochure
- Use "Saigon" and "Ho Chi Minh City" / "HCMC" interchangeably (Saigon preferred for casual)

## OUTPUT FORMAT
Return ONLY a valid JSON object with these exact keys (no markdown code fences, just raw JSON):
{
  "frontmatter": {
    "title": "...",
    "subtitle": "...",
    "author": "Linh Nguyen",
    "authorRole": "Managing Editor, Vietnam",
    "authorAvatar": "/authors/linh-nguyen.jpg",
    "authorBio": "A Saigon native who has spent over a decade documenting the city's ever-changing food and culture scene.",
    "date": "YYYY-MM-DD",
    "category": "...",
    "tags": ["tag1", "tag2", "tag3", "tag4"],
    "heroImage": "https://images.unsplash.com/...",
    "readTime": "X min read",
    "slug": "slug-here"
  },
  "body": "Full article body in markdown (no frontmatter, no title). Use ## for section headers. Include an InfoBox for venue articles using this format:\\n\\n> **INFO BOX**\\n> **Address:** ...\\n> **Price:** ...\\n> **Hours:** ...\\n> **Best for:** ...",
  "facebookHooks": [
    "Hook 1 (under 30 words, punchy)",
    "Hook 2 (under 30 words, different angle)",
    "Hook 3 (under 30 words, curiosity-driven)",
    "Hook 4 (under 30 words, FOMO-driven)"
  ]
}`
}

function buildUserPrompt(category, topic, keyFacts, angle) {
  return `Write a complete HCM Blog article with the following brief:

**Category:** ${category}
**Topic/Venue:** ${topic}
**Target Angle:** ${angle}
**Key Facts:**
${keyFacts}

Generate the full article following the style guide exactly. Make it feel like it was written by someone who actually lives in Saigon and knows this place intimately. Today's date is ${new Date().toISOString().split('T')[0]}.`
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

function frontmatterToString(fm) {
  const tags = Array.isArray(fm.tags) ? `[${fm.tags.map(t => `"${t}"`).join(', ')}]` : '[]'
  return `---
title: "${fm.title}"
subtitle: "${fm.subtitle}"
author: "${fm.author}"
authorRole: "${fm.authorRole}"
authorAvatar: "${fm.authorAvatar}"
authorBio: "${fm.authorBio}"
date: "${fm.date}"
category: "${fm.category}"
tags: ${tags}
heroImage: "${fm.heroImage}"
readTime: "${fm.readTime}"
slug: "${fm.slug}"
---`
}

export default function AdminGeneratorPage() {
  const [form, setForm] = useState({
    category: 'Eat & Drink',
    topic: '',
    keyFacts: '',
    angle: 'Lifestyle Discovery',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleGenerate = async e => {
    e.preventDefault()
    if (!form.topic.trim() || !form.keyFacts.trim()) {
      setError('Topic and Key Facts are required.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: buildSystemPrompt(MTL_STYLE_GUIDE),
          userPrompt: buildUserPrompt(form.category, form.topic, form.keyFacts, form.angle),
        }),
      })

      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Generation failed')

      let parsed
      try {
        // Claude sometimes wraps in code fences — strip them
        const raw = data.content.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
        parsed = JSON.parse(raw)
      } catch {
        throw new Error('Could not parse Claude response as JSON. Raw output shown below.\n\n' + data.content)
      }

      // Ensure slug exists
      if (!parsed.frontmatter.slug) {
        parsed.frontmatter.slug = slugify(parsed.frontmatter.title || form.topic)
      }

      setResult(parsed)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fullMarkdown = result
    ? `${frontmatterToString(result.frontmatter)}\n\n${result.body}`
    : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(fullMarkdown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/Blog.png" alt="HCM Blog" className="h-8" style={{ filter: 'brightness(0) invert(1)' }} />
          <span className="text-gray-500 text-sm font-mono">/ admin / generator</span>
        </div>
        <a href="/" className="text-xs text-gray-500 hover:text-white transition-colors">← Back to site</a>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-1">Article Generator</h1>
          <p className="text-gray-400 text-sm">MTL Blog style · Adapted for Saigon · Powered by Claude</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <form onSubmit={handleGenerate} className="space-y-5">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Article Type</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Topic / Venue Name *</label>
                <input
                  type="text"
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Pho Hoa Pasteur, Metro Line 1, Weekend in Da Lat..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand transition-colors"
                />
              </div>

              {/* Key Facts */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Key Facts *</label>
                <textarea
                  name="keyFacts"
                  value={form.keyFacts}
                  onChange={handleChange}
                  required
                  rows={7}
                  placeholder={`Address: 260C Pasteur St, District 3\nPrice: Pho from 75,000 VND (~$3)\nOpen since: 1968\nSpecialty: Rare beef pho, family recipe\nUnique detail: Still run by original family, queue every morning\nQuote: "It's the kind of pho that makes you question every other bowl you've ever had"`}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand transition-colors resize-none font-mono"
                />
                <p className="text-xs text-gray-600 mt-1">Include address, price, what makes it special, quotes, context, any data points.</p>
              </div>

              {/* Angle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Target Angle</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ANGLES.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, angle: a }))}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                        form.angle === a
                          ? 'bg-brand border-brand text-white'
                          : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-sm text-red-300 whitespace-pre-wrap font-mono">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-white font-black py-4 rounded-xl hover:bg-red-700 transition-colors uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Generating...
                  </>
                ) : 'Generate Article'}
              </button>
            </form>
          </div>

          {/* Output */}
          <div className="space-y-5">
            {!result && !loading && (
              <div className="h-full flex items-center justify-center border border-dashed border-gray-800 rounded-2xl p-12 text-center">
                <div>
                  <p className="text-gray-600 text-sm">Fill in the form and hit Generate.</p>
                  <p className="text-gray-700 text-xs mt-1">Output appears here.</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center border border-gray-800 rounded-2xl p-12">
                <div className="text-center">
                  <svg className="animate-spin h-8 w-8 text-brand mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <p className="text-gray-400 text-sm">Claude is writing...</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Meta */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Article Meta</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-brand/20 text-brand text-xs font-bold px-2 py-1 rounded">{result.frontmatter.category}</span>
                    <span className="bg-gray-800 text-gray-300 text-xs font-mono px-2 py-1 rounded">{result.frontmatter.slug}</span>
                    <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">{result.frontmatter.readTime}</span>
                  </div>
                  <div className="flex gap-1 flex-wrap mt-2">
                    {(result.frontmatter.tags || []).map(t => (
                      <span key={t} className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Facebook Hooks */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Facebook Hooks</p>
                  <div className="space-y-2">
                    {(result.facebookHooks || []).map((hook, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-brand font-black text-xs mt-0.5 flex-shrink-0">{i + 1}</span>
                        <p className="text-sm text-gray-300 leading-snug">{hook}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Markdown */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Markdown</p>
                    <button
                      onClick={handleCopy}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        copied
                          ? 'bg-green-900 text-green-300'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                  </div>
                  <pre className="p-4 text-xs text-gray-400 overflow-auto max-h-96 whitespace-pre-wrap font-mono leading-relaxed">
                    {fullMarkdown}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
