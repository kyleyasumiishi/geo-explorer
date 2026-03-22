import { useState } from 'react'
import WorldMap from './components/WorldMap'
import SearchBar from './components/SearchBar'
import countries from './data/countries.json'

function App() {
  const [selected, setSelected] = useState(null)

  function handleSelect(code) {
    const country = countries.find((c) => c.cca3 === code)
    setSelected(country || null)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-4 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">GeoExplorer</h1>
        <SearchBar onSelect={handleSelect} />
        {selected && (
          <p className="text-lg text-amber-400 whitespace-nowrap">
            {selected.name.common} — {selected.capital?.[0] || 'N/A'}
          </p>
        )}
      </header>
      <main className="w-full max-w-6xl mx-auto" style={{ height: '70vh' }}>
        <WorldMap selected={selected} onSelect={handleSelect} />
      </main>
    </div>
  )
}

export default App
