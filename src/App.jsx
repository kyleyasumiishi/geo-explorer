import { useState } from 'react'
import WorldMap from './components/WorldMap'
import USAMap from './components/USAMap'
import SearchBar from './components/SearchBar'
import InfoPanel from './components/InfoPanel'
import countries from './data/countries.json'
import usStates from './data/usStates.json'

// Map abbreviated TopoJSON names to countries.json common names
const MAP_NAME_FIXES = {
  'W. Sahara': 'Western Sahara',
  'Dem. Rep. Congo': 'DR Congo',
  'Dominican Rep.': 'Dominican Republic',
  'Falkland Is.': 'Falkland Islands',
  'Fr. S. Antarctic Lands': 'French Southern and Antarctic Lands',
  'Central African Rep.': 'Central African Republic',
  'Eq. Guinea': 'Equatorial Guinea',
  'eSwatini': 'Eswatini',
  'Solomon Is.': 'Solomon Islands',
  'Bosnia and Herz.': 'Bosnia and Herzegovina',
  'Macedonia': 'North Macedonia',
  'S. Sudan': 'South Sudan',
}

function App() {
  const [mapMode, setMapMode] = useState('world')
  const [selected, setSelected] = useState(null)
  const [recentlyViewed, setRecentlyViewed] = useState([])

  function handleSelectCountry(nameOrCode) {
    const resolved = MAP_NAME_FIXES[nameOrCode] || nameOrCode
    const country = countries.find(
      (c) =>
        c.cca3 === resolved ||
        c.name.common === resolved ||
        c.name.official === resolved ||
        c.altSpellings?.some((s) => s === resolved)
    )
    if (!country) return

    const entry = { ...country, mapName: nameOrCode }
    setSelected(entry)
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((c) => c.cca3 !== country.cca3)
      return [entry, ...filtered].slice(0, 5)
    })
  }

  function handleSelectState(name) {
    const state = usStates.find((s) => s.name === name)
    if (!state) return

    setSelected(state)
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((s) => s.abbreviation !== state.abbreviation)
      return [state, ...filtered].slice(0, 5)
    })
  }

  function handleToggleMode(mode) {
    setMapMode(mode)
    setSelected(null)
    setRecentlyViewed([])
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <header className="p-4 flex items-center gap-4 shrink-0">
        <h1
          className="text-3xl font-bold cursor-pointer hover:text-amber-400 transition-colors"
          onClick={() => setSelected(null)}
          title="Reset map view"
        >
          GeoExplorer
        </h1>
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => handleToggleMode('world')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              mapMode === 'world'
                ? 'bg-amber-500 text-gray-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            World
          </button>
          <button
            onClick={() => handleToggleMode('usa')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              mapMode === 'usa'
                ? 'bg-amber-500 text-gray-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            USA
          </button>
        </div>
        {mapMode === 'world' && <SearchBar onSelect={handleSelectCountry} />}
      </header>
      <div className="flex flex-1 min-h-0">
        <main className="flex-1">
          {mapMode === 'world' ? (
            <WorldMap selected={selected} onSelect={handleSelectCountry} />
          ) : (
            <USAMap selected={selected} onSelect={handleSelectState} />
          )}
        </main>
        <aside className="w-80 bg-gray-800 border-l border-gray-700 shrink-0">
          <InfoPanel
            selected={selected}
            recentlyViewed={recentlyViewed}
            onSelect={mapMode === 'world' ? handleSelectCountry : handleSelectState}
            mapMode={mapMode}
          />
        </aside>
      </div>
    </div>
  )
}

export default App
