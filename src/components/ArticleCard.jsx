import { Link } from 'react-router-dom'
import { CATEGORY_COLORS, CATEGORY_TEXT_COLORS, formatDate } from '../utils/contentLoader.js'

export function CategoryTag({ category, className = '' }) {
  if (!category) return null
  const bgColor = CATEGORY_COLORS[category] || 'bg-gray-600'
  return (
    <Link
      to={`/category/${category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
      className={`inline-block text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm ${bgColor} hover:opacity-90 transition-opacity ${className}`}
      onClick={e => e.stopPropagation()}
    >
      {category}
    </Link>
  )
}

export default function ArticleCard({ article, size = 'default' }) {
  if (!article) return null

  if (size === 'small') {
    return (
      <article className="flex-shrink-0 w-64 group">
        <Link to={`/${article.slug}`}>
          <div className="aspect-[16/9] overflow-hidden rounded-md bg-gray-100">
            <img
              src={article.heroImage}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="pt-2.5">
            <CategoryTag category={article.category} />
            <h3 className="font-bold text-gray-900 mt-2 text-sm leading-tight line-clamp-2 group-hover:text-brand transition-colors">
              {article.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
              <span>{article.author}</span>
              <span>·</span>
              <span>{formatDate(article.date)}</span>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  if (size === 'large') {
    return (
      <article className="group">
        <Link to={`/${article.slug}`}>
          <div className="aspect-[16/9] overflow-hidden rounded-md bg-gray-100">
            <img
              src={article.heroImage}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="pt-4">
            <CategoryTag category={article.category} />
            <h3 className="font-black text-gray-900 mt-2 text-xl leading-tight line-clamp-2 group-hover:text-brand transition-colors">
              {article.title}
            </h3>
            <p className="text-sm text-gray-500 italic mt-1.5 line-clamp-2">{article.subtitle}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <span>{article.author}</span>
              <span>·</span>
              <span>{formatDate(article.date)}</span>
              {article.readTime && (
                <>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </>
              )}
            </div>
          </div>
        </Link>
      </article>
    )
  }

  // Default size
  return (
    <article className="group">
      <Link to={`/${article.slug}`}>
        <div className="aspect-[16/9] overflow-hidden rounded-md bg-gray-100">
          <img
            src={article.heroImage}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="pt-3">
        <CategoryTag category={article.category} />
        <Link to={`/${article.slug}`}>
          <h3 className="font-bold text-gray-900 mt-2 leading-tight line-clamp-2 hover:text-brand transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 italic mt-1 line-clamp-1">{article.subtitle}</p>
        </Link>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <span>{article.author}</span>
          <span>·</span>
          <span>{formatDate(article.date)}</span>
          {article.readTime && (
            <>
              <span>·</span>
              <span>{article.readTime}</span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
