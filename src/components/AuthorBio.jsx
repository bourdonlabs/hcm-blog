export default function AuthorBio({ author, authorRole, authorAvatar, authorBio }) {
  console.log('[AuthorBio] authorAvatar:', JSON.stringify(authorAvatar))

  if (!author) return null

  return (
    <div className="my-10">
      <hr className="border-gray-200 mb-8" />
      <div className="flex items-start gap-4">
        <img
          src={authorAvatar}
          alt={author}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-gray-100 shadow-sm"
        />
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Written by</p>
          <h4 className="font-black text-gray-900 text-lg leading-tight">{author}</h4>
          {authorRole && (
            <p className="text-brand text-sm font-semibold mt-0.5">{authorRole}</p>
          )}
          {authorBio && (
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">{authorBio}</p>
          )}
        </div>
      </div>
      <hr className="border-gray-200 mt-8" />
    </div>
  )
}
