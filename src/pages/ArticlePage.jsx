import { useParams, Link, Navigate } from 'react-router-dom'
import { marked } from 'marked'
import { useRef } from 'react'
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

// Configure marked
marked.setOptions({ breaks: true, gfm: true })

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

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://hcmblog.com/${article.slug}`
  const htmlContent = marked.parse(article.content || '')

  return (
    <div className="min-h-screen bg-white">
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
