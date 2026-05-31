export default function ShareButtons({ url, title }) {
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  const twUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`

  const handleShare = (shareUrl) => {
    window.open(shareUrl, '_blank', 'width=600,height=450,noopener,noreferrer')
  }

  return (
    <>
      {/* Desktop: floating left sidebar */}
      <div
        className="hidden lg:flex flex-col gap-3 fixed left-4 z-40"
        style={{ top: '40vh', transform: 'translateY(-50%)' }}
        aria-label="Share this article"
      >
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest text-center mb-1" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Share</span>

        {/* Facebook */}
        <button
          onClick={() => handleShare(fbUrl)}
          className="w-10 h-10 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:opacity-90 shadow-md transition-opacity"
          aria-label="Share on Facebook"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>

        {/* Twitter / X */}
        <button
          onClick={() => handleShare(twUrl)}
          className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 shadow-md transition-opacity"
          aria-label="Share on X (Twitter)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>

        {/* Copy link */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(url).then(() => {
              alert('Link copied!')
            }).catch(() => {})
          }}
          className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 shadow-md transition-colors"
          aria-label="Copy link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
      </div>

      {/* Mobile: fixed bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl flex">
        <button
          onClick={() => handleShare(fbUrl)}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#1877f2] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          aria-label="Share on Facebook"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Share
        </button>
        <button
          onClick={() => handleShare(twUrl)}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-black text-white font-semibold text-sm hover:opacity-80 transition-opacity"
          aria-label="Share on X"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Tweet
        </button>
      </div>
    </>
  )
}
