import { useState } from 'react'
import { mappableCountries } from '../data/mapCountries'
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

function normalize(str) {
  return str.toLowerCase().trim().replace(/[''.-]/g, '').replace(/\s+/g, ' ')
}

function checkAnswer(guess, target, mapMode) {
  const g = normalize(guess)
  if (mapMode === 'usa') {
    return normalize(target.name) === g || normalize(target.abbreviation) === g
  }
  if (normalize(target.name.common) === g) return true
  if (normalize(target.name.official) === g) return true
  return target.altSpellings?.some((s) => normalize(s) === g)
}

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
  // Quiz phase state
  const [quizOrder, setQuizOrder] = useState([])
  const [quizIndex, setQuizIndex] = useState(0)
  const [guess, setGuess] = useState('')
  const [quizResult, setQuizResult] = useState(null) // 'correct', 'wrong', null
  const [results, setResults] = useState([]) // { item, correct: bool }

  const regions = mapMode === 'usa' ? USA_REGIONS : WORLD_REGIONS

  function getAvailableCount() {
    const list = mapMode === 'usa' ? usStates : mappableCountries
    const filtered = region === 'all' ? list : list.filter((item) => item.region === region)
    return filtered.length
  }

  function handleStart() {
    const list = mapMode === 'usa' ? usStates : mappableCountries
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

  const current = learnSet[currentIndex]
  const isWorld = mapMode === 'world'

  function handleNext() {
    if (currentIndex < learnSet.length - 1) {
      const next = currentIndex + 1
      setCurrentIndex(next)
      onHighlight(learnSet[next])
    } else {
      // Done learning, move to quiz phase
      const shuffled = shuffle(learnSet)
      setQuizOrder(shuffled)
      setQuizIndex(0)
      setGuess('')
      setQuizResult(null)
      setResults([])
      setPhase('quiz')
      onHighlight(shuffled[0])
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      const prev = currentIndex - 1
      setCurrentIndex(prev)
      onHighlight(learnSet[prev])
    }
  }

  function handleBackToSetup() {
    setPhase('setup')
    setLearnSet([])
    setCurrentIndex(0)
    onHighlight(null)
  }

  if (phase === 'learn') {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToSetup}
            className="text-sm transition-colors"
            style={{ color: '#6a7f9a' }}
          >
            ← Back
          </button>
          <span className="text-sm" style={{ color: '#6a7f9a' }}>
            {currentIndex + 1} / {learnSet.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#243040' }}>
          <div
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: '#e11d48',
              width: `${((currentIndex + 1) / learnSet.length) * 100}%`,
            }}
          />
        </div>

        {current && isWorld && (
          <div className="space-y-3">
            <img
              src={current.flags.svg}
              alt={`Flag of ${current.name.common}`}
              className="w-full max-w-[180px] rounded shadow"
            />
            <h2 className="text-xl font-bold" style={{ color: '#e2e8f0' }}>
              {current.name.common}
            </h2>
            <dl className="space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt style={{ color: '#6a7f9a' }}>Capital:</dt>
                <dd style={{ color: '#e2e8f0' }}>{current.capital?.[0] || 'N/A'}</dd>
              </div>
              <div className="flex gap-2">
                <dt style={{ color: '#6a7f9a' }}>Region:</dt>
                <dd style={{ color: '#e2e8f0' }}>{current.region}</dd>
              </div>
              <div className="flex gap-2">
                <dt style={{ color: '#6a7f9a' }}>Subregion:</dt>
                <dd style={{ color: '#e2e8f0' }}>{current.subregion || 'N/A'}</dd>
              </div>
              <div className="flex gap-2">
                <dt style={{ color: '#6a7f9a' }}>Population:</dt>
                <dd style={{ color: '#e2e8f0' }}>{current.population.toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        )}

        {current && !isWorld && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold" style={{ color: '#e2e8f0' }}>
              {current.name}
            </h2>
            <dl className="space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt style={{ color: '#6a7f9a' }}>Abbreviation:</dt>
                <dd style={{ color: '#e2e8f0' }}>{current.abbreviation}</dd>
              </div>
              <div className="flex gap-2">
                <dt style={{ color: '#6a7f9a' }}>Capital:</dt>
                <dd style={{ color: '#e2e8f0' }}>{current.capital}</dd>
              </div>
              <div className="flex gap-2">
                <dt style={{ color: '#6a7f9a' }}>Region:</dt>
                <dd style={{ color: '#e2e8f0' }}>{current.region}</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex-1 px-4 py-2 font-medium rounded-lg transition-colors text-sm disabled:opacity-30"
            style={{ backgroundColor: '#243040', color: '#e2e8f0' }}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2 font-medium rounded-lg transition-colors text-sm"
            style={{ backgroundColor: '#e11d48', color: '#fff' }}
          >
            {currentIndex === learnSet.length - 1 ? 'Start Quiz' : 'Next'}
          </button>
        </div>
      </div>
    )
  }

  const quizTarget = quizOrder[quizIndex]
  const quizTargetName = isWorld ? quizTarget?.name?.common : quizTarget?.name
  const quizTargetCapital = isWorld ? quizTarget?.capital?.[0] : quizTarget?.capital

  function handleQuizSubmit(e) {
    if (e) e.preventDefault()
    if (!guess.trim() || !quizTarget) return

    const correct = checkAnswer(guess, quizTarget, mapMode)
    setQuizResult(correct ? 'correct' : 'wrong')
    setResults((prev) => [...prev, { item: quizTarget, correct }])
  }

  function handleQuizSkip() {
    setQuizResult('wrong')
    setResults((prev) => [...prev, { item: quizTarget, correct: false }])
  }

  function handleQuizNext() {
    if (quizIndex < quizOrder.length - 1) {
      const next = quizIndex + 1
      setQuizIndex(next)
      setGuess('')
      setQuizResult(null)
      onHighlight(quizOrder[next])
    } else {
      setPhase('results')
      onHighlight(null)
    }
  }

  if (phase === 'quiz') {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: '#e2e8f0' }}>Quiz</h2>
          <span className="text-sm" style={{ color: '#6a7f9a' }}>
            {quizIndex + 1} / {quizOrder.length}
          </span>
        </div>

        <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#243040' }}>
          <div
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: '#e11d48',
              width: `${((quizIndex + 1) / quizOrder.length) * 100}%`,
            }}
          />
        </div>

        <div>
          <p className="text-sm mb-1" style={{ color: '#6a7f9a' }}>
            Name the highlighted {isWorld ? 'country' : 'state'}:
          </p>
          <form onSubmit={handleQuizSubmit}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={quizResult !== null}
              placeholder="Your answer..."
              className="w-full px-4 py-2 rounded-lg focus:outline-none disabled:opacity-50"
              style={{
                backgroundColor: '#243040',
                color: '#e2e8f0',
                border: '1px solid #2d3f55',
              }}
            />
          </form>
          {!quizResult && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleQuizSubmit}
                className="flex-1 px-4 py-2 font-medium rounded-lg transition-colors text-sm"
                style={{ backgroundColor: '#e11d48', color: '#fff' }}
              >
                Submit
              </button>
              <button
                onClick={handleQuizSkip}
                className="flex-1 px-4 py-2 font-medium rounded-lg transition-colors text-sm"
                style={{ backgroundColor: '#243040', color: '#6a7f9a' }}
              >
                Skip
              </button>
            </div>
          )}
        </div>

        {quizResult === 'correct' && (
          <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <p className="font-medium" style={{ color: '#4ade80' }}>Correct!</p>
          </div>
        )}

        {quizResult === 'wrong' && (
          <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <p className="font-medium" style={{ color: '#f87171' }}>
              The answer was: <span style={{ color: '#e2e8f0' }}>{quizTargetName}</span>
            </p>
            <div className="text-sm" style={{ color: '#6a7f9a' }}>
              <p>Capital: {quizTargetCapital || 'N/A'}</p>
            </div>
          </div>
        )}

        {quizResult && (
          <button
            onClick={handleQuizNext}
            className="w-full px-4 py-2 font-medium rounded-lg transition-colors"
            style={{ backgroundColor: '#e11d48', color: '#fff' }}
          >
            {quizIndex === quizOrder.length - 1 ? 'See Results' : 'Next'}
          </button>
        )}
      </div>
    )
  }

  // Results phase
  const correctCount = results.filter((r) => r.correct).length
  const missed = results.filter((r) => !r.correct)

  function handleRetryMissed() {
    const missedItems = missed.map((r) => r.item)
    setLearnSet(missedItems)
    setCurrentIndex(0)
    setPhase('learn')
    onHighlight(missedItems[0])
  }

  return (
    <div className="p-6 space-y-5">
      <h2 className="text-lg font-bold" style={{ color: '#e2e8f0' }}>Results</h2>

      <div className="text-center py-4">
        <p className="text-3xl font-bold" style={{ color: '#e11d48' }}>
          {correctCount} / {results.length}
        </p>
        <p className="text-sm mt-1" style={{ color: '#6a7f9a' }}>correct</p>
      </div>

      {missed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: '#6a7f9a' }}>
            Missed
          </h3>
          <ul className="space-y-1">
            {missed.map((r) => (
              <li
                key={r.item.cca3 || r.item.abbreviation}
                className="flex items-center gap-2 px-3 py-2 rounded text-sm"
                style={{ backgroundColor: '#243040', color: '#e2e8f0' }}
              >
                {r.item.flags && (
                  <img src={r.item.flags.svg} alt="" className="w-5 h-3 object-cover rounded-sm" />
                )}
                <span>{r.item.name?.common || r.item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {missed.length > 0 && (
          <button
            onClick={handleRetryMissed}
            className="w-full px-4 py-2 font-medium rounded-lg transition-colors"
            style={{ backgroundColor: '#e11d48', color: '#fff' }}
          >
            Retry Missed ({missed.length})
          </button>
        )}
        <button
          onClick={handleBackToSetup}
          className="w-full px-4 py-2 font-medium rounded-lg transition-colors"
          style={{ backgroundColor: '#243040', color: '#e2e8f0' }}
        >
          New Session
        </button>
      </div>
    </div>
  )
}
