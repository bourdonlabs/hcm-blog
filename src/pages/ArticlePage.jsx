import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { marked } from 'marked'
import { useRef, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ShareButtons from '../components/ShareButtons.jsx'
import InfoBox from '../components/InfoBox.jsx'
import AuthorBio from '../components/AuthorBio.jsx'
import ArticleCard from '../components/ArticleCard.jsx'
import { CategoryTag } from '../components/ArticleCard.jsx'
import { formatDate } from '../utils/contentLoader.js'
import {
  getArticleBySlug,
  getArticlesByCategory,
  allArticles,
} from '../utils/contentLoader.js'

// Custom renderer: images with optional "caption | @handle | url" title become <figure>
const renderer = new marked.Renderer()
renderer.image = (token) => {
  const src = token.href || token.src || ''
  const alt = token.text || token.alt || ''
  const title = token.title || ''
  if (!title) {
    return `<figure><img src="${src}" alt="${alt}" style="max-width:100%;border-radius:0.5rem;margin:0;" /></figure>`
  }
  const parts = title.split('|').map(s => s.trim())
  const caption = parts[0] || ''
  const handle = parts[1] || ''
  const link = parts[2] || ''
  const handleHtml = handle && link
    ? `<a href="${link}" target="_blank" rel="noopener noreferrer">${handle}</a>`
    : handle || ''
  const sep = caption && handleHtml ? ' | ' : ''
  return `<figure><img src="${src}" alt="${alt}" style="max-width:100%;border-radius:0.5rem;margin:0;" /><figcaption>${caption}${sep}${handleHtml}</figcaption></figure>`
}

marked.setOptions({ breaks: true, gfm: true, renderer })

function RelatedRow({ articles }) {
  const scrollRef = useRef(null)
  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' })
    }
  }

  if (!articles.length) return null

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-md rounded-full items-center justify-center text-gray-700 hover:text-brand -ml-4 hidden sm:flex"
        aria-label="Scroll left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1">
        {articles.map(a => (
          <ArticleCard key={a.slug} article={a} size="small" />
        ))}
      </div>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-md rounded-full items-center justify-center text-gray-700 hover:text-brand -mr-4 hidden sm:flex"
        aria-label="Scroll right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default function ArticlePage() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug)

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-500 mb-8">The article you're looking for doesn't exist or may have been moved.</p>
          <Link to="/" className="inline-block bg-brand text-white font-bold px-6 py-3 rounded-full hover:bg-red-700 transition-colors">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  // Related articles: same category, exclude self, up to 5; fall back to latest
  const sameCategory = getArticlesByCategory(article.category).filter(a => a.slug !== article.slug)
  const related = sameCategory.length >= 3
    ? sameCategory.slice(0, 5)
    : [...sameCategory, ...allArticles.filter(a => a.slug !== article.slug && a.category !== article.category)].slice(0, 5)

  const currentUrl = typeof window !== 'undefined'
    ? window.location.origin + window.location.pathname
    : `https://hcmblog.com/${article.slug}`

  // Pre-process Instagram shortcodes before markdown parsing
  const processedContent = (article.content || '').replace(
    /\{\{instagram:\s*(https?:\/\/www\.instagram\.com\/p\/[^\s}]+)\s*\}\}/g,
    (_, url) =>
      `<blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14" style="background:#FFF;border:0;border-radius:3px;box-shadow:0 0 1px 0 rgba(0,0,0,.5),0 1px 10px 0 rgba(0,0,0,.15);margin:1px;max-width:540px;min-width:326px;padding:0;width:calc(100% - 2px);"></blockquote>`
  )
  const htmlContent = marked.parse(processedContent)

  // Load Instagram embed script once per article render
  useEffect(() => {
    if (!htmlContent.includes('instagram-media')) return
    if (window.instgrm) {
      window.instgrm.Embeds.process()
    } else {
      const script = document.createElement('script')
      script.src = 'https://www.instagram.com/embed.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [htmlContent])

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{article.title} — HCM Blog</title>
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.subtitle} />
        <meta property="og:image" content={article.heroImage} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="article" />
      </Helmet>
      <Navbar />

      <main>
        <article className="max-w-[780px] mx-auto px-4 py-8 pb-24 lg:pb-8">
          {/* Category tag */}
          <CategoryTag category={article.category} />

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mt-3 mb-3 text-gray-900">
            {article.title}
          </h1>

          {/* Subtitle */}
          {article.subtitle && (
            <p className="text-lg sm:text-xl italic text-gray-500 mb-6 leading-snug">
              {article.subtitle}
            </p>
          )}

          {/* Author row */}
          <div className="flex items-center gap-3 py-4 border-t border-b border-gray-100 mb-6">
            {article.authorAvatar && (
              <img
                src={article.authorAvatar}
                alt={article.author}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-bold text-gray-900 text-sm">{article.author}</span>
                {article.authorRole && (
                  <span className="text-brand text-xs font-semibold">{article.authorRole}</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-0.5">
                <span>{formatDate(article.date)}</span>
                {article.readTime && (
                  <>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </>
                )}
              </div>
            </div>
            {/* Email share */}
            <a
              href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(currentUrl)}`}
              className="text-gray-400 hover:text-brand transition-colors p-1.5 rounded-full hover:bg-gray-100"
              aria-label="Share via email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>

          {/* Hero image */}
          {article.heroImage && (
            <div className="mb-6 -mx-4 sm:mx-0 sm:rounded-md overflow-hidden">
              <img
                src={article.heroImage}
                alt={article.title}
                loading="eager"
                className="w-full object-cover"
                style={{ maxHeight: '500px' }}
              />
            </div>
          )}

          {/* Article body */}
          <div
            className="prose mt-6"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Info Box */}
          <InfoBox
            price={article.price}
            cuisine={article.cuisine}
            address={article.address}
            whyGoThere={article.whyGoThere}
          />

          {/* Tags */}
          {Array.isArray(article.tags) && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              <span className="text-xs font-bold uppercase text-gray-400 tracking-widest self-center mr-1">Tags:</span>
              {article.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/search?q=${encodeURIComponent(tag)}`}
                  className="text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-brand hover:text-white px-3 py-1.5 rounded-full transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Compact share row */}
          <div className="flex items-center gap-2 mt-8 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mr-1">Share</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="w-9 h-9 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="w-9 h-9 rounded-full bg-[#25d366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X"
              className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(currentUrl)}`}
              aria-label="Share via Email"
              className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </a>
          </div>

          {/* Author bio */}
          {console.log('[ArticlePage] article.authorAvatar:', JSON.stringify(article.authorAvatar), '| full article keys:', Object.keys(article))}
          <AuthorBio
            author={article.author}
            authorRole={article.authorRole}
            authorAvatar={article.authorAvatar}
            authorBio={article.authorBio}
          />

          {/* Related articles */}
          {related.length > 0 && (
            <section className="mt-4">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-1 h-6 bg-brand rounded-full"></span>
                <h2 className="text-xl font-black text-gray-900">More From HCM Blog</h2>
              </div>
              <RelatedRow articles={related} />
            </section>
          )}
        </article>
      </main>

      <ShareButtons url={currentUrl} title={article.title} />
      <Footer />
    </div>
  )
}
