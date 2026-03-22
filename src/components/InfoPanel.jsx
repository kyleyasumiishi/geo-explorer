import summaries from '../data/summaries.json'

export default function InfoPanel({ selected, recentlyViewed, onSelect, mapMode }) {
  const isState = mapMode === 'usa'

  if (!selected && recentlyViewed.length === 0) {
    return (
      <div className="p-6 text-center" style={{ color: '#64748b' }}>
        <p>Click {isState ? 'a state' : 'a country'} on the map or use the search bar to explore.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {selected && !isState && (
        <div className="space-y-4">
          <img
            src={selected.flags.svg}
            alt={`Flag of ${selected.name.common}`}
            className="w-full max-w-[200px] rounded shadow"
          />
          <h2 className="text-2xl font-bold" style={{ color: '#1e293b' }}>{selected.name.common}</h2>
          <p className="text-sm" style={{ color: '#64748b' }}>{selected.name.official}</p>
          <dl className="space-y-2 text-sm">
            <div className="flex gap-2">
              <dt style={{ color: '#64748b' }}>Capital:</dt>
              <dd style={{ color: '#1e293b' }}>{selected.capital?.[0] || 'N/A'}</dd>
            </div>
            <div className="flex gap-2">
              <dt style={{ color: '#64748b' }}>Region:</dt>
              <dd style={{ color: '#1e293b' }}>{selected.region}</dd>
            </div>
            <div className="flex gap-2">
              <dt style={{ color: '#64748b' }}>Subregion:</dt>
              <dd style={{ color: '#1e293b' }}>{selected.subregion || 'N/A'}</dd>
            </div>
            <div className="flex gap-2">
              <dt style={{ color: '#64748b' }}>Population:</dt>
              <dd style={{ color: '#1e293b' }}>{selected.population.toLocaleString()}</dd>
            </div>
          </dl>
          {summaries.countries[selected.cca3] && (
            <div className="space-y-4 pt-2">
              {Object.entries(summaries.countries[selected.cca3]).map(([section, text]) => (
                <div key={section}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide mb-1" style={{ color: '#64748b' }}>
                    {section}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selected && isState && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold" style={{ color: '#1e293b' }}>{selected.name}</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex gap-2">
              <dt style={{ color: '#64748b' }}>Abbreviation:</dt>
              <dd style={{ color: '#1e293b' }}>{selected.abbreviation}</dd>
            </div>
            <div className="flex gap-2">
              <dt style={{ color: '#64748b' }}>Capital:</dt>
              <dd style={{ color: '#1e293b' }}>{selected.capital}</dd>
            </div>
            <div className="flex gap-2">
              <dt style={{ color: '#64748b' }}>Region:</dt>
              <dd style={{ color: '#1e293b' }}>{selected.region}</dd>
            </div>
          </dl>
          {summaries.states[selected.abbreviation] && (
            <div className="space-y-4 pt-2">
              {Object.entries(summaries.states[selected.abbreviation]).map(([section, text]) => (
                <div key={section}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide mb-1" style={{ color: '#64748b' }}>
                    {section}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {recentlyViewed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: '#64748b' }}>
            Recently Viewed
          </h3>
          <ul className="space-y-1">
            {recentlyViewed.map((item) => (
              <li
                key={item.cca3 || item.abbreviation}
                onClick={() => onSelect(item.cca3 || item.name)}
                className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer text-sm transition-colors"
                style={{ color: '#1e293b' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {item.flags && (
                  <img
                    src={item.flags.svg}
                    alt=""
                    className="w-5 h-3 object-cover rounded-sm"
                  />
                )}
                <span>{item.name?.common || item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
