import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useState } from 'react'

const AD_FORMATS = [
  {
    title: 'Homepage Banner',
    description: 'Full-width display banner on the HCM Blog homepage. Prime placement, maximum visibility.',
    formats: '1245×200px, desktop + mobile',
    price: 'From $350/month',
    icon: '🖥️',
  },
  {
    title: 'Sponsored Article',
    description: 'Native content written by our editorial team or supplied by you, published under a "Sponsored" label. Full distribution across our channels.',
    formats: 'Up to 1,200 words + photos',
    price: 'From $500/article',
    icon: '✍️',
  },
  {
    title: 'Newsletter Sponsorship',
    description: 'Feature your brand in our weekly HCM Digest newsletter, sent to thousands of English-speaking subscribers in Ho Chi Minh City.',
    formats: 'Header mention + 150-word blurb + logo',
    price: 'From $200/send',
    icon: '📨',
  },
  {
    title: 'Category Takeover',
    description: 'Own an entire category (e.g. Eat & Drink or Nightlife) with persistent sidebar and in-article banner ads for one full month.',
    formats: 'Multiple placements',
    price: 'From $800/month',
    icon: '🎯',
  },
]

const STATS = [
  { value: '45,000+', label: 'Monthly Readers' },
  { value: '12,000+', label: 'Newsletter Subscribers' },
  { value: '28,000+', label: 'Social Followers' },
  { value: '4.2 min', label: 'Avg. Time on Site' },
  { value: '7', label: 'Cities Around the World' },
]

export default function AdvertisePage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', _replyto: '', company: '', message: '' })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('https://formspree.io/f/xredwgga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Something went wrong. Please try again or email us directly.')
      }
    } catch {
      setError('Could not send your inquiry. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <div className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand text-xs font-bold uppercase tracking-widest mb-3">Partner With Us</p>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">Advertise With <span className="text-brand">HCM Blog</span></h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto leading-relaxed">
            Reach Ho Chi Minh City's most engaged English-speaking audience — expats, professionals, foodies, and culturally curious locals.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-14">
        {/* Reach stats */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Our Reach</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {STATS.map(stat => (
              <div key={stat.label} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                <p className="text-3xl font-black text-brand mb-1">{stat.value}</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">* All figures are estimates for illustrative purposes</p>
        </section>

        {/* Ad formats */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-gray-900 mb-8">Ad Formats & Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {AD_FORMATS.map(format => (
              <div key={format.title} className="border border-gray-200 rounded-xl p-6 hover:border-brand/40 hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{format.icon}</div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{format.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{format.description}</p>
                <p className="text-xs text-gray-400 mb-1"><span className="font-semibold">Formats:</span> {format.formats}</p>
                <p className="text-brand font-black text-sm mt-2">{format.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact form */}
        <section className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Get In Touch</h2>
          <p className="text-gray-500 text-sm mb-8">Tell us about your campaign and we'll get back to you within 24 hours.</p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-3">✅</div>
              <h3 className="font-black text-gray-900 text-xl mb-2">Thanks for reaching out!</h3>
              <p className="text-gray-600 text-sm">We've received your inquiry and will be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Email *</label>
                  <input
                    type="email"
                    name="_replyto"
                    required
                    value={form._replyto}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Company / Brand</label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Message *</label>
                <textarea
                  name="message"
                  required
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                  placeholder="Tell us about your campaign goals, preferred format, timeline and budget..."
                />
              </div>
              {error && (
                <p className="text-red-600 text-sm font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand text-white font-black py-3.5 rounded-xl hover:bg-red-700 transition-colors text-sm tracking-wide uppercase disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending…' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
