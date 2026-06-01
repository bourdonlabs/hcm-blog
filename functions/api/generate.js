export async function onRequest(context) {
  const { request, env } = context

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = env.ANTHROPIC_API_KEY
  if (!apiKey) {
    const availableKeys = Object.keys(env || {}).join(', ') || '(none)'
    return new Response(JSON.stringify({
      error: 'ANTHROPIC_API_KEY not configured',
      availableEnvKeys: availableKeys,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { systemPrompt, userPrompt } = body
  if (!systemPrompt || !userPrompt) {
    return new Response(JSON.stringify({ error: 'systemPrompt and userPrompt are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  const data = await anthropicResp.json()

  if (!anthropicResp.ok) {
    return new Response(JSON.stringify({ error: data.error?.message || 'Anthropic API error' }), {
      status: anthropicResp.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ content: data.content?.[0]?.text || '' }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
