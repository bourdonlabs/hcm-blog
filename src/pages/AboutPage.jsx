import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const TEAM = [
  {
    name: 'Linh Nguyen',
    role: 'Managing Editor, Vietnam',
    avatar: '/authors/linh-nguyen.jpg',
    bio: "A Saigon native who has spent over a decade documenting the city's ever-changing food and culture scene. Linh knows every hidden alley, every legendary bowl, and every chef worth knowing in Ho Chi Minh City.",
  },
  {
    name: 'Zach Ferraro',
    role: 'Expat Life Editor',
    avatar: '/authors/zach-ferraro.jpg',
    bio: "Originally from Atlanta, Zach came to HCMC in 2018 to teach English, fell in love with the country and never left. He covers expat life, real estate, city news, and is one of the rare foreigners who actually speaks fluent Vietnamese.",
  },
  {
    name: 'Linda Pham',
    role: 'Nightlife Editor',
    avatar: '/authors/linda-pham.png',
    bio: "Vietnamese-Canadian who traded Vancouver for Saigon in 2022 and never looked back. Linda has made it her personal mission to explore every rooftop bar, underground club, and late-night hidden gem the city has to offer.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header image */}
      <div className="relative h-64 sm:h-80 overflow-hidden bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1245&h=500&fit=crop&q=80"
          alt="Ho Chi Minh City"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <h1 className="text-4xl sm:text-5xl font-black">About</h1>
              <img src="/Blog.png" alt="HCMBlog" style={{ height: '80px', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))' }} />
            </div>
            <p className="text-lg opacity-90 italic">Saigon's English Language News Media</p>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Mission */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-5 pb-3 border-b-2 border-gray-100">Our Mission</h2>
          <div className="prose">
            <p>
              HCM Blog was born out of a simple frustration: there was no single, trustworthy, English-language source for what's actually happening in Ho Chi Minh City. No honest restaurant reviews. No straight-talking expat advice. No coverage of the city's incredible arts, culture, and nightlife that didn't feel like it was written by a tourist brochure.
            </p>
            <p>
              We built HCM Blog to fix that. We're a team of writers, editors, and obsessive locals who cover the city the way it deserves — honestly, enthusiastically, and with real insider knowledge. Whether you're a long-time expat, a newly arrived foreigner navigating visa paperwork, or a curious visitor who wants to eat somewhere other than Bui Vien, we've got you.
            </p>
            <p>
              Modeled after the best city blogs in the world — think MTL Blog, Time Out, and Eater — we cover everything from the best pho in District 1 to the latest metro line developments, from rooftop cocktail bars to real estate market reports. If it's happening in Ho Chi Minh City and you need to know about it, you'll find it here.
            </p>
            <p>
              We believe good local journalism matters. We believe the English-speaking community in Saigon deserves more than generic travel content. And we believe the best city in Southeast Asia deserves a media outlet that keeps up with its relentless, wonderful energy.
            </p>
          </div>
        </section>

        {/* Team */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-5 pb-3 border-b-2 border-gray-100">Meet the Team</h2>
          <div className="space-y-6">
            {TEAM.map(member => (
              <div key={member.name} className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 hover:border-brand/30 transition-colors">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="font-black text-gray-900 text-lg">{member.name}</h3>
                  <p className="text-brand text-sm font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-3">Get In Touch</h2>
          <p className="text-gray-600 mb-5 text-sm leading-relaxed">
            Got a tip, a correction, or a restaurant recommendation? Want to advertise or pitch a story? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:hello@hcmblog.com"
              className="inline-flex items-center justify-center gap-2 bg-brand text-white font-bold px-5 py-3 rounded-full hover:bg-red-700 transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              hello@hcmblog.com
            </a>
            <a
              href="/submit-tip"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 font-bold px-5 py-3 rounded-full hover:border-brand hover:text-brand transition-colors text-sm"
            >
              Submit a Tip
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
