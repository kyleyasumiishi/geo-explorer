import { useState } from 'react'
import WorldMap from './components/WorldMap'
import SearchBar from './components/SearchBar'
import InfoPanel from './components/InfoPanel'
import countries from './data/countries.json'

function App() {
  const [selected, setSelected] = useState(null)
  const [recentlyViewed, setRecentlyViewed] = useState([])

  function handleSelect(code) {
    const country = countries.find((c) => c.cca3 === code)
    if (!country) return

    setSelected(country)
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((c) => c.cca3 !== country.cca3)
      return [country, ...filtered].slice(0, 5)
    })
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <header className="p-4 flex items-center gap-4 shrink-0">
        <h1 className="text-3xl font-bold">GeoExplorer</h1>
        <SearchBar onSelect={handleSelect} />
      </header>
      <div className="flex flex-1 min-h-0">
        <main className="flex-1">
          <WorldMap selected={selected} onSelect={handleSelect} />
        </main>
        <aside className="w-80 bg-gray-800 border-l border-gray-700 shrink-0">
          <InfoPanel
            selected={selected}
            recentlyViewed={recentlyViewed}
            onSelect={handleSelect}
          />
        </aside>
      </div>
    </div>
  )
}

export default App
