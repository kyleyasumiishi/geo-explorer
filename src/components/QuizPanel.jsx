import { useState, useEffect, useRef } from 'react'
import countries from '../data/countries.json'
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
  const [result, setResult] = useState(null) // 'correct', 'wrong', or null
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
    e.preventDefault()
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
      <div className="flex bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setQuizType('name')}
          className={`flex-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            quizType === 'name'
              ? 'bg-amber-500 text-gray-900'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Name
        </button>
        <button
          onClick={() => setQuizType('capital')}
          className={`flex-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            quizType === 'capital'
              ? 'bg-amber-500 text-gray-900'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Capital
        </button>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-400">
          Score: <span className="text-white font-medium">{score}/{total}</span>
        </span>
        <span className="text-gray-400">
          Streak: <span className="text-amber-400 font-medium">{streak}</span>
        </span>
      </div>

      <div>
        <p className="text-sm text-gray-400 mb-1">{prompt}</p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={result !== null}
            placeholder="Your answer..."
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-400 focus:outline-none disabled:opacity-50"
          />
        </form>
        {!result && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-amber-500 text-gray-900 font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm"
            >
              Submit
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-2 bg-gray-600 text-gray-200 font-medium rounded-lg hover:bg-gray-500 transition-colors text-sm"
            >
              Skip
            </button>
          </div>
        )}
      </div>

      {result === 'correct' && (
        <div className="bg-green-900/40 border border-green-700 rounded-lg p-3">
          <p className="text-green-400 font-medium">Correct!</p>
        </div>
      )}

      {result === 'wrong' && (
        <div className="bg-red-900/40 border border-red-700 rounded-lg p-3 space-y-2">
          <p className="text-red-400 font-medium">
            The answer was: <span className="text-white">
              {quizType === 'capital' ? targetCapital : targetName}
            </span>
          </p>
          <div className="text-sm text-gray-300 space-y-1">
            <p>{targetName}</p>
            <p>Capital: {targetCapital || 'N/A'}</p>
            {mapMode === 'world' && target && <p>Region: {target.region}</p>}
          </div>
        </div>
      )}

      {result === 'skipped' && (
        <div className="bg-gray-700/40 border border-gray-600 rounded-lg p-3 space-y-2">
          <p className="text-gray-300 font-medium">
            Answer: <span className="text-white">
              {quizType === 'capital' ? targetCapital : targetName}
            </span>
          </p>
          <div className="text-sm text-gray-400 space-y-1">
            <p>{targetName}</p>
            <p>Capital: {targetCapital || 'N/A'}</p>
            {mapMode === 'world' && target && <p>Region: {target.region}</p>}
          </div>
        </div>
      )}

      {result && (
        <button
          onClick={handleNext}
          className="w-full px-4 py-2 bg-amber-500 text-gray-900 font-medium rounded-lg hover:bg-amber-400 transition-colors"
        >
          Next
        </button>
      )}
    </div>
  )
}
