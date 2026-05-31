import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import HeroCard from '../components/HeroCard.jsx'
import ArticleCard from '../components/ArticleCard.jsx'
import {
  getFeaturedArticle,
  getTrendingArticles,
  getArticlesByCategory,
  categoryToSlug,
} from '../utils/contentLoader.js'

const HOME_CATEGORIES = ['News', 'Eat & Drink', 'Things To Do', 'Expat Life', 'Nightlife']

function TrendingRow({ articles }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative">
      {/* Left chevron */}
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center text-gray-700 hover:text-brand transition-colors -ml-4 hidden sm:flex"
        aria-label="Scroll left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1"
      >
        {articles.map(article => (
          <ArticleCard key={article.slug} article={article} size="small" />
        ))}
      </div>

      {/* Right chevron */}
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center text-gray-700 hover:text-brand transition-colors -mr-4 hidden sm:flex"
        aria-label="Scroll right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

function CategorySection({ category }) {
  const articles = getArticlesByCategory(category).slice(0, 4)
  if (articles.length === 0) return null

  const slug = categoryToSlug(category)

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{category}</h2>
        <Link
          to={`/category/${slug}`}
          className="text-brand text-sm font-bold hover:underline flex items-center gap-1"
        >
          See All
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {articles.length === 1 ? (
        <div className="max-w-lg">
          <ArticleCard article={articles[0]} size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {articles.map((article, idx) => (
            <div
              key={article.slug}
              className={idx === 0 ? 'sm:col-span-2' : ''}
            >
              <ArticleCard article={article} size={idx === 0 ? 'large' : 'default'} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default function HomePage() {
  const featured = getFeaturedArticle()
  const trending = getTrendingArticles(5)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero */}
        <HeroCard article={featured} />

        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Trending Now */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-1 h-7 bg-brand rounded-full"></span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Trending Now</h2>
            </div>
            <TrendingRow articles={trending} />
          </section>

          {/* Divider */}
          <div className="border-t-2 border-gray-100 mb-14" />

          {/* Category sections */}
          {HOME_CATEGORIES.map(cat => (
            <CategorySection key={cat} category={cat} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
