const FIELDS = [
  { key: 'price',      icon: '💰', label: 'Price',            span: 'half' },
  { key: 'cuisine',    icon: '🍜', label: 'Cuisine',          span: 'half' },
  { key: 'hours',      icon: '🕐', label: 'Hours',            span: 'full' },
  { key: 'address',    icon: '📍', label: 'Address',          span: 'full' },
  { key: 'phone',      icon: '📞', label: 'Phone',            span: 'half' },
  { key: 'bestFor',    icon: '✨', label: 'Best For',         span: 'full' },
  { key: 'whyGoThere', icon: '⭐', label: 'Why You Need To Go', span: 'full' },
  { key: 'website',    icon: '🌐', label: 'Website',          span: 'half', link: true },
  { key: 'instagram',  icon: '📸', label: 'Instagram',        span: 'half', link: true, linkLabel: '@handle' },
]

export default function InfoBox({ price, cuisine, address, whyGoThere, phone, hours, bestFor, website, instagram }) {
  const props = { price, cuisine, address, whyGoThere, phone, hours, bestFor, website, instagram }
  const active = FIELDS.filter(f => props[f.key])
  if (!active.length) return null

  const renderValue = (field) => {
    const val = props[field.key]
    if (field.link) {
      let label = val
      if (field.key === 'instagram') {
        try { label = '@' + new URL(val).pathname.replace(/\//g, '') } catch { label = val }
      } else {
        try { label = new URL(val).hostname.replace(/^www\./, '') } catch { label = val }
      }
      return (
        <a href={val} target="_blank" rel="noopener noreferrer"
          className="text-brand hover:underline font-semibold break-all">
          {label}
        </a>
      )
    }
    return <span className="text-gray-200 text-sm">{val}</span>
  }

  // Separate half-span fields into pairs for the 2-col grid
  const rows = []
  let i = 0
  while (i < active.length) {
    const f = active[i]
    if (f.span === 'full') {
      rows.push([f])
      i++
    } else {
      const next = active[i + 1]
      if (next && next.span === 'half') {
        rows.push([f, next])
        i += 2
      } else {
        rows.push([f])
        i++
      }
    }
  }

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden my-8 not-prose">
      {/* Header */}
      <div className="bg-brand px-5 py-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h4 className="font-black text-white text-sm uppercase tracking-widest">The Details</h4>
      </div>

      {/* Fields */}
      <div className="p-5 space-y-1">
        {rows.map((row, ri) => (
          <div key={ri} className={`grid gap-3 py-3 border-b border-gray-800 last:border-0 ${row.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {row.map(field => (
              <div key={field.key} className="flex items-start gap-2.5 min-w-0">
                <span className="text-base flex-shrink-0 mt-0.5">{field.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-0.5">{field.label}</p>
                  {renderValue(field)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
