import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ArticleCard from '../components/ArticleCard.jsx'
import {
  getArticlesByCategory,
  slugToCategory,
  CATEGORY_COLORS,
} from '../utils/contentLoader.js'

const PAGE_SIZE = 12

export default function CategoryPage() {
  const { category: categorySlug } = useParams()
  const [page, setPage] = useState(1)

  const categoryName = slugToCategory(categorySlug)
  const articles = getArticlesByCategory(categoryName)

  const totalPages = Math.ceil(articles.length / PAGE_SIZE)
  const paged = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const bgClass = CATEGORY_COLORS[categoryName] || 'bg-gray-700'

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Category banner */}
      <div className={`${bgClass} text-white py-12 px-4`}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Category</p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">{categoryName}</h1>
          <p className="mt-2 opacity-80 text-sm font-medium">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">No articles in this category yet.</p>
            <Link to="/" className="text-brand font-bold hover:underline">Back to Home</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {paged.map(article => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className={`w-9 h-9 rounded-full text-sm font-bold transition-colors ${
                      p === page
                        ? 'bg-brand text-white'
                        : 'border border-gray-300 text-gray-700 hover:border-brand hover:text-brand'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
