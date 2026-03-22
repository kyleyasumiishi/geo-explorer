import { useState, useRef, useEffect } from 'react'
import countries from '../data/countries.json'
import usStates from '../data/usStates.json'

function filterCountries(query) {
  const lower = query.toLowerCase()
  return countries.filter((c) => {
    if (c.name.common.toLowerCase().includes(lower)) return true
    if (c.name.official.toLowerCase().includes(lower)) return true
    return c.altSpellings?.some((s) => s.toLowerCase().includes(lower))
  })
}

function filterStates(query) {
  const lower = query.toLowerCase()
  return usStates.filter((s) =>
    s.name.toLowerCase().includes(lower) ||
    s.abbreviation.toLowerCase().includes(lower) ||
    s.capital.toLowerCase().includes(lower)
  )
}

export default function SearchBar({ onSelect, mapMode }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }, [mapMode])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const matches = mapMode === 'usa' ? filterStates(query) : filterCountries(query)
    setResults(matches.slice(0, 8))
    setHighlightIndex(0)
    setIsOpen(matches.length > 0)
  }, [query, mapMode])

  function selectItem(item) {
    onSelect(mapMode === 'usa' ? item.name : item.cca3)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  function handleKeyDown(e) {
    if (!isOpen) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[highlightIndex]) {
        selectItem(results[highlightIndex])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const placeholder = mapMode === 'usa' ? 'Search for a state...' : 'Search for a country...'

  return (
    <div className="relative w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-lg focus:outline-none"
        style={{
          backgroundColor: '#f1f5f9',
          color: '#1e293b',
          border: '1px solid #e2e8f0',
        }}
        onFocusCapture={(e) => e.target.style.borderColor = '#2563eb'}
        onBlurCapture={(e) => e.target.style.borderColor = '#e2e8f0'}
      />
      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          {results.map((item, i) => (
            <li
              key={item.cca3 || item.abbreviation}
              onClick={() => selectItem(item)}
              onMouseEnter={() => setHighlightIndex(i)}
              className="px-4 py-2 cursor-pointer flex items-center gap-3"
              style={{
                backgroundColor: i === highlightIndex ? '#f1f5f9' : 'transparent',
                color: '#1e293b',
              }}
            >
              {item.flags && (
                <img
                  src={item.flags.svg}
                  alt=""
                  className="w-6 h-4 object-cover rounded-sm"
                />
              )}
              <span>{item.name?.common || item.name}</span>
              {item.capital && mapMode === 'usa' && (
                <span style={{ color: '#64748b' }} className="text-sm">— {item.capital}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
