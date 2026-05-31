import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function SubmitTipPage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    _replyto: '',
    tip: '',
    imageUrl: '',
  })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const url = 'https://formspree.io/f/mjgzqvvj'
      console.log('Fetching:', url)
      const res = await fetch(url, {
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
      setError('Could not send your tip. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-brand text-xs font-bold uppercase tracking-widest mb-2">Community</p>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Submit a Tip</h1>
          <p className="text-gray-500 leading-relaxed">
            You know something we don't? Tell us! Got the scoop on a new restaurant opening, a hidden gem that deserves more love, a neighbourhood event, or something newsworthy happening in Saigon? Drop it below — our editors review every submission.
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
            <div className="text-6xl mb-4">🙌</div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Thanks for the tip!</h2>
            <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
              We've received your submission. Our editors will review it and may reach out if we'd like more details. You're helping make HCM Blog better for everyone in Saigon.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', _replyto: '', tip: '', imageUrl: '' }) }}
              className="mt-6 text-brand font-bold text-sm hover:underline"
            >
              Submit another tip
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="First and last name"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="_replyto"
                required
                value={form._replyto}
                onChange={handleChange}
                placeholder="we'll contact you if we need more info"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">We won't publish your email or share it with third parties.</p>
            </div>

            {/* Tip */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Your Tip *
              </label>
              <textarea
                name="tip"
                required
                value={form.tip}
                onChange={handleChange}
                rows={6}
                placeholder="Describe what you've seen, heard, or want to share. The more detail, the better — include addresses, names, dates, links or anything else that might help our editors verify the tip."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{form.tip.length} characters. Minimum 50 recommended.</p>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Image URL <span className="text-gray-400 normal-case font-normal">(optional)</span>
              </label>
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">Got a photo? Paste a direct link to an image (Google Drive, Imgur, etc.)</p>
            </div>

            {/* Image preview */}
            {form.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full max-h-48 object-cover"
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand text-white font-black py-4 rounded-xl hover:bg-red-700 transition-colors uppercase tracking-wide text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sending…' : 'Submit My Tip'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By submitting, you agree that HCM Blog may publish your tip (without your personal details) and verify it independently.
            </p>
          </form>
        )}
      </main>

      <Footer />
    </div>
  )
}
