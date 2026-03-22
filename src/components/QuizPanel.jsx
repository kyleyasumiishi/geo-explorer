import { useState, useEffect, useRef } from 'react'
import { mappableCountries as countries } from '../data/mapCountries'
import usStates from '../data/usStates.json'

function getRandomItem(list, exclude) {
  let item
  do {
    item = list[Math.floor(Math.random() * list.length)]
  } while (exclude && item === exclude)
  return item
}

function normalize(str) {
  return str.toLowerCase().trim().replace(/[''.-]/g, '').replace(/\s+/g, ' ')
}

function checkAnswer(guess, target, mapMode, quizType) {
  const g = normalize(guess)
  if (quizType === 'capital') {
    const capital = mapMode === 'usa' ? target.capital : target.capital?.[0]
    return capital && normalize(capital) === g
  }
  if (mapMode === 'usa') {
    return normalize(target.name) === g || normalize(target.abbreviation) === g
  }
  if (normalize(target.name.common) === g) return true
  if (normalize(target.name.official) === g) return true
  return target.altSpellings?.some((s) => normalize(s) === g)
}

export default function QuizPanel({ mapMode, onHighlight }) {
  const [quizType, setQuizType] = useState('name') // 'name' or 'capital'
  const [target, setTarget] = useState(null)
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState(null) // 'correct', 'wrong', 'skipped', or null
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [total, setTotal] = useState(0)
  const inputRef = useRef(null)

  function pickNew(exclude) {
    const list = mapMode === 'usa' ? usStates : countries
    const item = getRandomItem(list, exclude)
    setTarget(item)
    setGuess('')
    setResult(null)
    onHighlight(item)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  useEffect(() => {
    setScore(0)
    setStreak(0)
    setTotal(0)
    pickNew()
  }, [mapMode, quizType])

  function handleSubmit(e) {
    if (e) e.preventDefault()
    if (!guess.trim() || !target) return

    setTotal((t) => t + 1)
    if (checkAnswer(guess, target, mapMode, quizType)) {
      setResult('correct')
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
    } else {
      setResult('wrong')
      setStreak(0)
    }
  }

  function handleSkip() {
    setResult('skipped')
  }

  function handleNext() {
    pickNew(target)
  }

  const targetName = mapMode === 'usa' ? target?.name : target?.name?.common
  const targetCapital = mapMode === 'usa' ? target?.capital : target?.capital?.[0]

  const prompt = quizType === 'capital'
    ? `What is the capital of ${targetName || '...'}?`
    : `Name the highlighted ${mapMode === 'usa' ? 'state' : 'country'}:`

  return (
    <div className="p-6 space-y-5">
      <div className="flex rounded-lg p-1" style={{ backgroundColor: '#243040' }}>
        <button
          onClick={() => setQuizType('name')}
          className="flex-1 px-3 py-1 rounded-md text-sm font-medium transition-colors"
          style={{
            backgroundColor: quizType === 'name' ? '#e11d48' : 'transparent',
            color: quizType === 'name' ? '#fff' : '#6a7f9a',
          }}
        >
          Name
        </button>
        <button
          onClick={() => setQuizType('capital')}
          className="flex-1 px-3 py-1 rounded-md text-sm font-medium transition-colors"
          style={{
            backgroundColor: quizType === 'capital' ? '#e11d48' : 'transparent',
            color: quizType === 'capital' ? '#fff' : '#6a7f9a',
          }}
        >
          Capital
        </button>
      </div>

      <div className="flex justify-between text-sm">
        <span style={{ color: '#6a7f9a' }}>
          Score: <span className="font-medium" style={{ color: '#e2e8f0' }}>{score}/{total}</span>
        </span>
        <span style={{ color: '#6a7f9a' }}>
          Streak: <span className="font-medium" style={{ color: '#e11d48' }}>{streak}</span>
        </span>
      </div>

      <div>
        <p className="text-sm mb-1" style={{ color: '#6a7f9a' }}>{prompt}</p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={result !== null}
            placeholder="Your answer..."
            className="w-full px-4 py-2 rounded-lg focus:outline-none disabled:opacity-50"
            style={{
              backgroundColor: '#243040',
              color: '#e2e8f0',
              border: '1px solid #2d3f55',
            }}
          />
        </form>
        {!result && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 font-medium rounded-lg transition-colors text-sm"
              style={{ backgroundColor: '#e11d48', color: '#fff' }}
            >
              Submit
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-2 font-medium rounded-lg transition-colors text-sm"
              style={{ backgroundColor: '#243040', color: '#6a7f9a' }}
            >
              Skip
            </button>
          </div>
        )}
      </div>

      {result === 'correct' && (
        <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
          <p className="font-medium" style={{ color: '#4ade80' }}>Correct!</p>
        </div>
      )}

      {result === 'wrong' && (
        <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <p className="font-medium" style={{ color: '#f87171' }}>
            The answer was: <span style={{ color: '#e2e8f0' }}>
              {quizType === 'capital' ? targetCapital : targetName}
            </span>
          </p>
          <div className="text-sm space-y-1" style={{ color: '#6a7f9a' }}>
            <p>{targetName}</p>
            <p>Capital: {targetCapital || 'N/A'}</p>
            {mapMode === 'world' && target && <p>Region: {target.region}</p>}
          </div>
        </div>
      )}

      {result === 'skipped' && (
        <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: '#243040', border: '1px solid #2d3f55' }}>
          <p className="font-medium" style={{ color: '#6a7f9a' }}>
            Answer: <span style={{ color: '#e2e8f0' }}>
              {quizType === 'capital' ? targetCapital : targetName}
            </span>
          </p>
          <div className="text-sm space-y-1" style={{ color: '#3a5070' }}>
            <p>{targetName}</p>
            <p>Capital: {targetCapital || 'N/A'}</p>
            {mapMode === 'world' && target && <p>Region: {target.region}</p>}
          </div>
        </div>
      )}

      {result && (
        <button
          onClick={handleNext}
          className="w-full px-4 py-2 font-medium rounded-lg transition-colors"
          style={{ backgroundColor: '#e11d48', color: '#fff' }}
        >
          Next
        </button>
      )}
    </div>
  )
}
