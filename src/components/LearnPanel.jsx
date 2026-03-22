import { useState } from 'react'
import countries from '../data/countries.json'
import usStates from '../data/usStates.json'

const WORLD_REGIONS = [
  { label: 'All', value: 'all' },
  { label: 'Africa', value: 'Africa' },
  { label: 'Americas', value: 'Americas' },
  { label: 'Asia', value: 'Asia' },
  { label: 'Europe', value: 'Europe' },
  { label: 'Oceania', value: 'Oceania' },
]

const USA_REGIONS = [
  { label: 'All', value: 'all' },
  { label: 'South', value: 'South' },
  { label: 'West', value: 'West' },
  { label: 'Midwest', value: 'Midwest' },
  { label: 'Northeast', value: 'Northeast' },
]

const COUNT_OPTIONS = [5, 10, 15, 20]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function LearnPanel({ mapMode, onHighlight }) {
  const [phase, setPhase] = useState('setup') // 'setup', 'learn', 'quiz', 'results'
  const [region, setRegion] = useState('all')
  const [count, setCount] = useState(10)
  const [learnSet, setLearnSet] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const regions = mapMode === 'usa' ? USA_REGIONS : WORLD_REGIONS

  function getAvailableCount() {
    const list = mapMode === 'usa' ? usStates : countries
    const filtered = region === 'all' ? list : list.filter((item) => item.region === region)
    return filtered.length
  }

  function handleStart() {
    const list = mapMode === 'usa' ? usStates : countries
    const filtered = region === 'all' ? list : list.filter((item) => item.region === region)
    const selected = shuffle(filtered).slice(0, count)
    setLearnSet(selected)
    setCurrentIndex(0)
    setPhase('learn')
    onHighlight(selected[0])
  }

  const available = getAvailableCount()

  if (phase === 'setup') {
    return (
      <div className="p-6 space-y-5">
        <h2 className="text-lg font-bold" style={{ color: '#e2e8f0' }}>Learn Mode</h2>

        <div>
          <p className="text-sm mb-2" style={{ color: '#6a7f9a' }}>Select a region:</p>
          <div className="flex flex-wrap gap-2">
            {regions.map((r) => (
              <button
                key={r.value}
                onClick={() => setRegion(r.value)}
                className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                style={{
                  backgroundColor: region === r.value ? '#e11d48' : '#243040',
                  color: region === r.value ? '#fff' : '#6a7f9a',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm mb-2" style={{ color: '#6a7f9a' }}>
            How many? <span style={{ color: '#3a5070' }}>({available} available)</span>
          </p>
          <div className="flex gap-2 items-center">
            {COUNT_OPTIONS.filter((c) => c <= available).map((c) => (
              <button
                key={c}
                onClick={() => setCount(c)}
                className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                style={{
                  backgroundColor: count === c ? '#e11d48' : '#243040',
                  color: count === c ? '#fff' : '#6a7f9a',
                }}
              >
                {c}
              </button>
            ))}
            {available > 20 && (
              <input
                type="number"
                min={1}
                max={available}
                value={!COUNT_OPTIONS.includes(count) ? count : ''}
                placeholder="Custom"
                onChange={(e) => {
                  const val = Math.min(Math.max(1, parseInt(e.target.value) || 1), available)
                  setCount(val)
                }}
                onFocus={() => { if (COUNT_OPTIONS.includes(count)) setCount('') }}
                className="w-20 px-2 py-1 rounded-md text-sm font-medium focus:outline-none"
                style={{
                  backgroundColor: '#243040',
                  color: '#e2e8f0',
                  border: `1px solid ${!COUNT_OPTIONS.includes(count) && count !== '' ? '#e11d48' : '#2d3f55'}`,
                }}
              />
            )}
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full px-4 py-2 font-medium rounded-lg transition-colors"
          style={{ backgroundColor: '#e11d48', color: '#fff' }}
        >
          Start Learning
        </button>
      </div>
    )
  }

  // Placeholder for learn/quiz/results phases
  return (
    <div className="p-6 text-center" style={{ color: '#6a7f9a' }}>
      <p>Phase: {phase} — coming next...</p>
    </div>
  )
}
