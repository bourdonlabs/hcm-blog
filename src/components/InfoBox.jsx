export default function InfoBox({ price, cuisine, address, whyGoThere }) {
  if (!price && !cuisine && !address && !whyGoThere) return null

  return (
    <div className="border-l-4 border-brand bg-red-50 rounded-r-lg p-5 my-8">
      <h4 className="font-black text-gray-900 text-base uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-brand rounded-full inline-block"></span>
        The Details
      </h4>
      <dl className="space-y-3">
        {price && (
          <div className="flex items-start gap-3">
            <dt className="text-base flex-shrink-0">💰</dt>
            <div>
              <dt className="text-xs font-bold uppercase text-gray-500 tracking-wide">Price</dt>
              <dd className="text-sm text-gray-700 mt-0.5">{price}</dd>
            </div>
          </div>
        )}
        {cuisine && (
          <div className="flex items-start gap-3">
            <dt className="text-base flex-shrink-0">🍜</dt>
            <div>
              <dt className="text-xs font-bold uppercase text-gray-500 tracking-wide">Cuisine</dt>
              <dd className="text-sm text-gray-700 mt-0.5">{cuisine}</dd>
            </div>
          </div>
        )}
        {address && (
          <div className="flex items-start gap-3">
            <dt className="text-base flex-shrink-0">📍</dt>
            <div>
              <dt className="text-xs font-bold uppercase text-gray-500 tracking-wide">Address</dt>
              <dd className="text-sm text-gray-700 mt-0.5">{address}</dd>
            </div>
          </div>
        )}
        {whyGoThere && (
          <div className="flex items-start gap-3">
            <dt className="text-base flex-shrink-0">⭐</dt>
            <div>
              <dt className="text-xs font-bold uppercase text-gray-500 tracking-wide">Why You Need To Go</dt>
              <dd className="text-sm text-gray-700 mt-0.5 italic">{whyGoThere}</dd>
            </div>
          </div>
        )}
      </dl>
    </div>
  )
}
