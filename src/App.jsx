import { useState } from 'react'
import WorldMap from './components/WorldMap'
import USAMap from './components/USAMap'
import SearchBar from './components/SearchBar'
import InfoPanel from './components/InfoPanel'
import QuizPanel from './components/QuizPanel'
import LearnPanel from './components/LearnPanel'
import countries from './data/countries.json'
import usStates from './data/usStates.json'

// Map abbreviated TopoJSON names to countries.json common names
// (TopoJSON name -> our data name)
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
  'United States of America': 'United States',
  'Côte d\'Ivoire': 'Ivory Coast',
  'Congo': 'Republic of the Congo',
}

function App() {
  const [mapMode, setMapMode] = useState('world')
  const [selected, setSelected] = useState(null)
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [appMode, setAppMode] = useState('explorer') // 'explorer' or 'quiz'
  const [highlighted, setHighlighted] = useState(null) // quiz target

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

    // Resolve the TopoJSON map name for highlighting
    const reverseFixes = Object.fromEntries(
      Object.entries(MAP_NAME_FIXES).map(([k, v]) => [v, k])
    )
    const mapName = reverseFixes[country.name.common] || country.name.common
    const entry = { ...country, mapName }
    setSelected(entry)
    setPanelOpen(true)
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((c) => c.cca3 !== country.cca3)
      return [entry, ...filtered].slice(0, 5)
    })
  }

  function handleSelectState(name) {
    const state = usStates.find((s) => s.name === name)
    if (!state) return

    setSelected(state)
    setPanelOpen(true)
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((s) => s.abbreviation !== state.abbreviation)
      return [state, ...filtered].slice(0, 5)
    })
  }

  function handleHighlight(item) {
    if (mapMode === 'usa') {
      setHighlighted(item)
    } else {
      // Need to find the TopoJSON map name for this country
      const reverseFixes = Object.fromEntries(
        Object.entries(MAP_NAME_FIXES).map(([k, v]) => [v, k])
      )
      const mapName = reverseFixes[item.name.common] || item.name.common
      setHighlighted({ ...item, mapName })
    }
  }

  function handleToggleMode(mode) {
    setMapMode(mode)
    setSelected(null)
    setHighlighted(null)
    setRecentlyViewed([])
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#1c2433', color: '#e2e8f0' }}>
      <header className="p-3 md:p-4 flex flex-col md:flex-row items-center gap-3 md:gap-4 shrink-0">
        <h1
          className="text-2xl md:text-3xl font-bold cursor-pointer transition-colors"
          style={{ color: '#e2e8f0' }}
          onMouseEnter={(e) => e.target.style.color = '#e11d48'}
          onMouseLeave={(e) => e.target.style.color = '#e2e8f0'}
          onClick={() => setSelected(null)}
          title="Reset map view"
        >
          GeoExplorer
        </h1>
        <div className="flex md:contents gap-3">
        <div className="flex rounded-lg p-1" style={{ backgroundColor: '#212d3d' }}>
          <button
            onClick={() => handleToggleMode('world')}
            className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: mapMode === 'world' ? '#e11d48' : 'transparent',
              color: mapMode === 'world' ? '#fff' : '#6a7f9a',
            }}
          >
            World
          </button>
          <button
            onClick={() => handleToggleMode('usa')}
            className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: mapMode === 'usa' ? '#e11d48' : 'transparent',
              color: mapMode === 'usa' ? '#fff' : '#6a7f9a',
            }}
          >
            USA
          </button>
        </div>
        <div className="flex rounded-lg p-1" style={{ backgroundColor: '#212d3d' }}>
          <button
            onClick={() => { setAppMode('explorer'); setHighlighted(null) }}
            className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: appMode === 'explorer' ? '#e11d48' : 'transparent',
              color: appMode === 'explorer' ? '#fff' : '#6a7f9a',
            }}
          >
            Explorer
          </button>
          <button
            onClick={() => { setAppMode('quiz'); setSelected(null) }}
            className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: appMode === 'quiz' ? '#e11d48' : 'transparent',
              color: appMode === 'quiz' ? '#fff' : '#6a7f9a',
            }}
          >
            Quiz
          </button>
          <button
            onClick={() => { setAppMode('learn'); setSelected(null); setHighlighted(null) }}
            className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: appMode === 'learn' ? '#e11d48' : 'transparent',
              color: appMode === 'learn' ? '#fff' : '#6a7f9a',
            }}
          >
            Learn
          </button>
        </div>
        </div>
        {appMode === 'explorer' && (
          <div className="w-full md:w-auto md:flex-1">
            <SearchBar
              onSelect={mapMode === 'world' ? handleSelectCountry : handleSelectState}
              mapMode={mapMode}
            />
          </div>
        )}
      </header>
      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <main className="flex-1 min-h-[40vh] md:min-h-0">
          {mapMode === 'world' ? (
            <WorldMap selected={appMode === 'explorer' ? selected : null} highlighted={appMode !== 'explorer' ? highlighted : null} onSelect={handleSelectCountry} />
          ) : (
            <USAMap selected={appMode === 'explorer' ? selected : null} highlighted={appMode !== 'explorer' ? highlighted : null} onSelect={handleSelectState} />
          )}
        </main>
        <aside className="w-full md:w-80 shrink-0 md:max-h-none md:overflow-y-auto" style={{ backgroundColor: '#212d3d', borderColor: '#2d3f55', borderLeftWidth: '1px', borderTopWidth: '1px' }}>
          {/* Mobile: collapsible bar */}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="md:hidden w-full px-4 py-3 flex items-center justify-between text-sm font-medium"
          >
            <span style={{ color: '#e2e8f0' }}>
              {appMode === 'explorer'
                ? (selected ? selected.name?.common || selected.name : 'No selection')
                : (highlighted ? highlighted.name?.common || highlighted.name : appMode === 'quiz' ? 'Quiz' : 'Learn')}
            </span>
            <span style={{ color: '#6a7f9a' }}>{panelOpen ? '▼' : '▲'}</span>
          </button>
          <div className={`${panelOpen ? 'max-h-[50vh]' : 'max-h-0'} md:max-h-none overflow-y-auto transition-all duration-300`}>
            {appMode === 'explorer' && (
              <InfoPanel
                selected={selected}
                recentlyViewed={recentlyViewed}
                onSelect={mapMode === 'world' ? handleSelectCountry : handleSelectState}
                mapMode={mapMode}
              />
            )}
            {appMode === 'quiz' && (
              <QuizPanel
                mapMode={mapMode}
                onHighlight={handleHighlight}
              />
            )}
            {appMode === 'learn' && (
              <LearnPanel
                mapMode={mapMode}
                onHighlight={handleHighlight}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default App
