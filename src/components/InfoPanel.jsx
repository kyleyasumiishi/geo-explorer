export default function InfoPanel({ selected, recentlyViewed, onSelect }) {
  if (!selected && recentlyViewed.length === 0) {
    return (
      <div className="p-6 text-gray-400 text-center">
        <p>Click a country on the map or use the search bar to explore.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {selected && (
        <div className="space-y-4">
          <img
            src={selected.flags.svg}
            alt={`Flag of ${selected.name.common}`}
            className="w-full max-w-[200px] rounded shadow"
          />
          <h2 className="text-2xl font-bold text-white">{selected.name.common}</h2>
          <p className="text-sm text-gray-400">{selected.name.official}</p>
          <dl className="space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-gray-400">Capital:</dt>
              <dd className="text-white">{selected.capital?.[0] || 'N/A'}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-400">Region:</dt>
              <dd className="text-white">{selected.region}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-400">Subregion:</dt>
              <dd className="text-white">{selected.subregion || 'N/A'}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-400">Population:</dt>
              <dd className="text-white">{selected.population.toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      )}

      {recentlyViewed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Recently Viewed
          </h3>
          <ul className="space-y-1">
            {recentlyViewed.map((country) => (
              <li
                key={country.cca3}
                onClick={() => onSelect(country.cca3)}
                className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer hover:bg-gray-700 text-sm"
              >
                <img
                  src={country.flags.svg}
                  alt=""
                  className="w-5 h-3 object-cover rounded-sm"
                />
                <span className="text-white">{country.name.common}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
