const SOCIAL_CRAWLERS = /facebookexternalhit|Twitterbot|WhatsApp|LinkedInBot|Slackbot|TelegramBot|Discordbot|Googlebot/i

const STATIC_EXT = /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|json|txt|xml|map)$/i

function escapeHtml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildOgHtml({ title, subtitle, heroImage, url }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)} — HCM Blog</title>
  <meta name="description" content="${escapeHtml(subtitle)}" />
  <meta property="og:site_name" content="HCM Blog" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(subtitle)}" />
  <meta property="og:image" content="${escapeHtml(heroImage)}" />
  <meta property="og:url" content="${escapeHtml(url)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(subtitle)}" />
  <meta name="twitter:image" content="${escapeHtml(heroImage)}" />
</head>
<body></body>
</html>`
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url)
  const ua = request.headers.get('user-agent') || ''

  // Always pass through requests for static assets
  if (STATIC_EXT.test(url.pathname)) {
    return env.ASSETS.fetch(request)
  }

  // Only intercept social media crawlers
  if (!SOCIAL_CRAWLERS.test(ua)) {
    return env.ASSETS.fetch(request)
  }

  // Extract the slug: strip leading slash and any trailing slash
  const slug = url.pathname.replace(/^\//, '').replace(/\/$/, '')

  // Non-article paths (home, category, search, about, etc.) fall through
  if (!slug || slug.includes('/')) {
    return env.ASSETS.fetch(request)
  }

  // Fetch the OG manifest from static assets
  let manifest = {}
  try {
    const manifestResp = await env.ASSETS.fetch(
      new Request(new URL('/og-manifest.json', url).toString())
    )
    if (manifestResp.ok) {
      manifest = await manifestResp.json()
    }
  } catch {
    return env.ASSETS.fetch(request)
  }

  const article = manifest[slug]
  if (!article) {
    return env.ASSETS.fetch(request)
  }

  return new Response(
    buildOgHtml({ ...article, url: url.toString() }),
    { headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'public, max-age=3600' } }
  )
}
