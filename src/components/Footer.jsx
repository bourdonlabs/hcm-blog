import { Link } from 'react-router-dom'
import { CATEGORIES, categoryToSlug } from '../utils/contentLoader.js'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a1a' }} className="text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top: Logo + Tagline */}
        <div className="mb-10 pb-8 border-b border-gray-700">
          <Link to="/">
            <img src="/Blog.svg" alt="HCM Blog" className="h-12 w-auto brightness-0 invert" />
          </Link>
          <p className="text-gray-400 mt-2 text-sm max-w-xs">
            Ho Chi Minh City's Best Local Guide — English-language news, food, nightlife and culture for Saigon's international community.
          </p>
        </div>

        {/* Middle grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <Link
                    to={`/category/${categoryToSlug(cat)}`}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link to="/advertise" className="text-gray-400 hover:text-white text-sm transition-colors">Advertise</Link></li>
              <li><Link to="/submit-tip" className="text-gray-400 hover:text-white text-sm transition-colors">Submit a Tip</Link></li>
              <li><a href="mailto:hello@hcmblog.com" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Follow Us</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.facebook.com/profile.php?id=100093419216024" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors group">
                  <span className="w-7 h-7 rounded-full bg-gray-700 group-hover:bg-brand flex items-center justify-center transition-colors text-xs font-bold">f</span>
                  Facebook
                </a>
              </li>
            </ul>

            {/* Newsletter signup */}
            <div className="mt-6">
              <p className="text-gray-400 text-xs mb-2">Get Saigon's top stories in your inbox.</p>
              <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-brand"
                />
                <button
                  type="submit"
                  className="bg-brand text-white text-xs font-semibold px-3 py-2 rounded-md hover:bg-red-700 transition-colors whitespace-nowrap"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} HCM Blog. All rights reserved.</p>
          <p>Made with ❤️ in Saigon</p>
        </div>
      </div>
    </footer>
  )
}
