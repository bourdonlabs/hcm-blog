import { Link } from 'react-router-dom'
import { CategoryTag } from './ArticleCard.jsx'
import { formatDate } from '../utils/contentLoader.js'

export default function HeroCard({ article }) {
  if (!article) return null

  return (
    <div className="relative w-full min-h-[300px] md:min-h-[500px] overflow-hidden bg-gray-900 group">
      {/* Background image */}
      <img
        src={article.heroImage}
        alt={article.title}
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full min-h-[300px] md:min-h-[500px] px-5 pb-8 pt-16 md:px-10 md:pb-12 max-w-4xl">
        <CategoryTag category={article.category} />

        <Link to={`/${article.slug}`}>
          <h2 className="font-black text-white text-2xl sm:text-3xl md:text-5xl leading-tight mt-3 mb-3 hover:opacity-90 transition-opacity">
            {article.title}
          </h2>
        </Link>

        {article.subtitle && (
          <p className="text-gray-200 italic text-base md:text-xl mb-5 max-w-2xl leading-snug">
            {article.subtitle}
          </p>
        )}

        <div className="flex items-center gap-3 text-sm text-gray-300">
          {article.authorAvatar && (
            <img
              src={article.authorAvatar}
              alt={article.author}
              className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
            />
          )}
          <span className="font-semibold text-white">{article.author}</span>
          <span className="opacity-60">·</span>
          <span>{formatDate(article.date)}</span>
          {article.readTime && (
            <>
              <span className="opacity-60">·</span>
              <span>{article.readTime}</span>
            </>
          )}
        </div>
      </div>

      {/* Featured label */}
      <div className="absolute top-4 right-4 bg-white/90 text-brand text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
        Featured
      </div>
    </div>
  )
}
