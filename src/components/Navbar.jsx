import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { CATEGORIES, categoryToSlug } from '../utils/contentLoader.js'

const CATEGORY_ICONS = {
  'News':          '📰',
  'Eat & Drink':   '🍜',
  'Things To Do':  '🎯',
  'Expat Life':    '✈️',
  'Nightlife':     '🌙',
  'Guides':        '🗺️',
  'Events':        '🎉',
  'Real Estate':   '🏠',
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen]         = useState(false)
  const [searchQuery, setSearchQuery]       = useState('')
  const searchInputRef = useRef(null)
  const navigate  = useNavigate()
  const location  = useLocation()

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [searchOpen])

  useEffect(() => {
    setMobileMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50">

      {/* ── Row 1: Black navbar ─────────────────────────────────────── */}
      <div className="bg-black">
        <div className="relative max-w-7xl mx-auto px-4 flex items-center justify-center" style={{ minHeight: '130px' }}>

          {/* Left: search + mobile hamburger */}
          <div className="absolute left-4 flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(v => !v)}
              className="p-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>

            <button
              className="lg:hidden p-2 text-white hover:text-gray-300 transition-colors"
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Center: logo */}
          <Link to="/" className="flex items-center justify-center">
            <img src="/Blog.png" alt="HCM Blog" style={{height: '120px', width: 'auto'}} />
          </Link>

          {/* Right: newsletter */}
          <div className="absolute right-4 flex items-center gap-2">
            <button className="hidden sm:block bg-brand text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-red-700 transition-colors whitespace-nowrap">
              Newsletter
            </button>
          </div>
        </div>

        {/* Expanding search bar */}
        {searchOpen && (
          <div className="border-t border-gray-800 px-4 py-3">
            <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto flex gap-2">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search HCM Blog…"
                className="flex-1 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand"
              />
              <button
                type="submit"
                className="bg-brand text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-red-700 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-gray-400 hover:text-white text-xl leading-none px-1"
                aria-label="Close search"
              >
                ✕
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── Row 2: Category pill row ─────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2.5">
            {CATEGORIES.map(cat => {
              const slug     = categoryToSlug(cat)
              const isActive = location.pathname === `/category/${slug}`
              return (
                <Link
                  key={cat}
                  to={`/category/${slug}`}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 flex-shrink-0 ${
                    isActive
                      ? 'bg-brand text-white border-brand shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand hover:text-brand'
                  }`}
                >
                  <span className="text-base leading-none">{CATEGORY_ICONS[cat]}</span>
                  <span>{cat}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile dropdown ──────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {CATEGORIES.map(cat => {
              const slug     = categoryToSlug(cat)
              const isActive = location.pathname === `/category/${slug}`
              return (
                <Link
                  key={cat}
                  to={`/category/${slug}`}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                    isActive ? 'text-brand bg-red-50' : 'text-gray-700 hover:text-brand hover:bg-gray-50'
                  }`}
                >
                  <span>{CATEGORY_ICONS[cat]}</span>
                  <span>{cat}</span>
                </Link>
              )
            })}
            <div className="border-t border-gray-100 mt-2 pt-2">
              <Link to="/about"       className="px-3 py-2.5 block text-sm text-gray-600 hover:text-brand">About</Link>
              <Link to="/advertise"   className="px-3 py-2.5 block text-sm text-gray-600 hover:text-brand">Advertise</Link>
              <Link to="/submit-tip"  className="px-3 py-2.5 block text-sm text-gray-600 hover:text-brand">Submit a Tip</Link>
            </div>
          </nav>
        </div>
      )}

    </header>
  )
}
