const SOCIAL_CRAWLERS = /facebookexternalhit|Twitterbot|WhatsApp|LinkedInBot|Slackbot|TelegramBot|Discordbot|Googlebot/i

const STATIC_EXT = /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|xml|map)$/i

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

export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const ua = request.headers.get('user-agent') || ''

  // Pass through static asset requests directly
  if (STATIC_EXT.test(url.pathname)) {
    return env.ASSETS.fetch(new Request(request.url, request))
  }

  // Only intercept recognised social media crawlers
  if (!SOCIAL_CRAWLERS.test(ua)) {
    return env.ASSETS.fetch(new Request(request.url, request))
  }

  // Extract slug: strip leading/trailing slashes
  const slug = url.pathname.replace(/^\//, '').replace(/\/$/, '')

  // Pass through non-article paths (home, /category/*, /search, /about, etc.)
  if (!slug || slug.includes('/')) {
    return env.ASSETS.fetch(new Request(request.url, request))
  }

  // Fetch the OG manifest from static assets
  let manifest = {}
  try {
    const manifestUrl = new URL('/og-manifest.json', url).toString()
    const manifestResp = await env.ASSETS.fetch(new Request(manifestUrl))
    if (manifestResp.ok) {
      manifest = await manifestResp.json()
    }
  } catch {
    return env.ASSETS.fetch(new Request(request.url, request))
  }

  const article = manifest[slug]
  if (!article) {
    return env.ASSETS.fetch(new Request(request.url, request))
  }

  return new Response(
    buildOgHtml({ ...article, url: url.toString() }),
    {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  )
}
