function FavoriteCities({ cities, onSelect, onRemove }) {
  if (cities.length === 0) return null

  return (
    <section aria-label="Favorite cities" className="mt-6">
      <h2 className="mb-3 text-sm font-semibold text-slate-400">
        Favorite cities
      </h2>

      <ul className="flex flex-wrap gap-2">
        {cities.map((city) => (
          <li
            key={city.id}
            className="flex overflow-hidden rounded-xl border border-white/10 bg-slate-800"
          >
            <button
              type="button"
              onClick={() => onSelect(city)}
              className="px-4 py-2 text-sm hover:bg-slate-700"
            >
              {city.name}
              {city.country && `, ${city.country}`}
            </button>

            <button
              type="button"
              onClick={() => onRemove(city.id)}
              aria-label={`Remove ${city.name} from favorites`}
              className="px-3 py-2 text-slate-400 hover:bg-slate-700 hover:text-white"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default FavoriteCities
