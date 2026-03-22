import { useState, useRef, useEffect } from 'react'
import countries from '../data/countries.json'

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const lower = query.toLowerCase()
    const matches = countries.filter((c) => {
      if (c.name.common.toLowerCase().includes(lower)) return true
      if (c.name.official.toLowerCase().includes(lower)) return true
      return c.altSpellings?.some((s) => s.toLowerCase().includes(lower))
    })

    setResults(matches.slice(0, 8))
    setHighlightIndex(0)
    setIsOpen(matches.length > 0)
  }, [query])

  function selectCountry(country) {
    onSelect(country.cca3)
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
        selectCountry(results[highlightIndex])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
        placeholder="Search for a country..."
        className="w-full px-4 py-2 rounded-lg focus:outline-none"
        style={{
          backgroundColor: '#243040',
          color: '#e2e8f0',
          border: '1px solid #2d3f55',
        }}
        onFocusCapture={(e) => e.target.style.borderColor = '#e11d48'}
        onBlurCapture={(e) => e.target.style.borderColor = '#2d3f55'}
      />
      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: '#212d3d', border: '1px solid #2d3f55' }}>
          {results.map((country, i) => (
            <li
              key={country.cca3}
              onClick={() => selectCountry(country)}
              onMouseEnter={() => setHighlightIndex(i)}
              className="px-4 py-2 cursor-pointer flex items-center gap-3"
              style={{
                backgroundColor: i === highlightIndex ? '#243040' : 'transparent',
                color: '#e2e8f0',
              }}
            >
              <img
                src={country.flags.svg}
                alt=""
                className="w-6 h-4 object-cover rounded-sm"
              />
              <span>{country.name.common}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
