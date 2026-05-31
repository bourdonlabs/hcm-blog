import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ArticleCard from '../components/ArticleCard.jsx'
import { searchArticles } from '../utils/contentLoader.js'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialQuery = searchParams.get('q') || ''
  const [inputValue, setInputValue] = useState(initialQuery)

  const results = initialQuery ? searchArticles(initialQuery) : []

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`)
    }
  }

  useEffect(() => {
    setInputValue(searchParams.get('q') || '')
  }, [searchParams])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Search header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-5">Search HCM Blog</h1>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Search for restaurants, events, guides..."
              className="flex-1 border-2 border-gray-200 rounded-xl px-5 py-3 text-base focus:outline-none focus:border-brand transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="bg-brand text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>

        {/* Results */}
        {initialQuery ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 text-sm">
                {results.length > 0
                  ? <><span className="font-bold text-gray-900">{results.length}</span> result{results.length !== 1 ? 's' : ''} for "<span className="font-bold text-gray-900">{initialQuery}</span>"</>
                  : <>No results for "<span className="font-bold text-gray-900">{initialQuery}</span>"</>
                }
              </p>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(article => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No results found</h2>
                <p className="text-gray-500 mb-6">Try different keywords or browse our categories.</p>
                <a href="/" className="inline-block bg-brand text-white font-bold px-6 py-3 rounded-full hover:bg-red-700 transition-colors">
                  Browse All Articles
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🏙️</div>
            <p className="text-lg">Start typing to search across all HCM Blog articles.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
