import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const countries = JSON.parse(readFileSync(join(__dirname, '../src/data/countries.json'), 'utf-8'))
const usStates = JSON.parse(readFileSync(join(__dirname, '../src/data/usStates.json'), 'utf-8'))

// Wikipedia article title overrides (common name -> Wikipedia title)
const WIKI_COUNTRY_TITLES = {
  'DR Congo': 'Democratic Republic of the Congo',
  'Republic of the Congo': 'Republic of the Congo',
  'Ivory Coast': "Côte d'Ivoire",
  'East Timor': 'East Timor',
  'Myanmar': 'Myanmar',
  'Czechia': 'Czech Republic',
  'Palestine': 'State of Palestine',
  'Kosovo': 'Kosovo',
  'North Korea': 'North Korea',
  'South Korea': 'South Korea',
  'Micronesia': 'Federated States of Micronesia',
  'São Tomé and Príncipe': 'São Tomé and Príncipe',
  'Curaçao': 'Curaçao',
  'Réunion': 'Réunion',
  'Saint Helena, Ascension and Tristan da Cunha': 'Saint Helena, Ascension and Tristan da Cunha',
  'Cocos (Keeling) Islands': 'Cocos (Keeling) Islands',
  'Caribbean Netherlands': 'Caribbean Netherlands',
  'United States': 'United States',
  'South Georgia': 'South Georgia and the South Sandwich Islands',
}

// US state Wikipedia title disambiguation
const WIKI_STATE_TITLES = {
  'Georgia': 'Georgia (U.S. state)',
  'Washington': 'Washington (state)',
  'New York': 'New York (state)',
}

const SECTION_NAMES = {
  history: ['History'],
  government: ['Government', 'Government and politics', 'Politics', 'Politics and government'],
  economy: ['Economy', 'Economy and infrastructure'],
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function truncateToSentences(text, maxSentences = 3) {
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim()
  // Split on sentence boundaries
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  return sentences.slice(0, maxSentences).join(' ').trim()
}

function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/\[.*?\]/g, '') // remove [1], [citation needed], etc.
    .replace(/&#\d+;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function wikiQuery(params, retries = 3) {
  const url = new URL('https://en.wikipedia.org/w/api.php')
  url.searchParams.set('format', 'json')
  url.searchParams.set('origin', '*')
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'GeoExplorer/1.0 (educational project; contact: geo-explorer@example.com)' }
    })
    if (res.status === 429) {
      const wait = (attempt + 1) * 5000
      console.log(`    Rate limited, waiting ${wait / 1000}s...`)
      await sleep(wait)
      continue
    }
    if (!res.ok) throw new Error(`Wikipedia API error: ${res.status}`)
    return res.json()
  }
  throw new Error('Rate limited after all retries')
}

async function getIntro(title) {
  const data = await wikiQuery({
    action: 'query',
    prop: 'extracts',
    exintro: '1',
    explaintext: '1',
    titles: title,
    redirects: '1',
  })
  const pages = data.query.pages
  const page = Object.values(pages)[0]
  if (!page || page.missing !== undefined) return null
  return truncateToSentences(page.extract, 3)
}

async function getSections(title) {
  const data = await wikiQuery({
    action: 'parse',
    page: title,
    prop: 'sections',
    redirects: '1',
  })
  if (data.error) return []
  return data.parse.sections
}

async function getSectionText(title, sectionIndex) {
  const data = await wikiQuery({
    action: 'parse',
    page: title,
    prop: 'text',
    section: sectionIndex.toString(),
    redirects: '1',
  })
  if (data.error) return null
  const html = data.parse.text['*']
  // Get only the first <p> tags content (skip sub-sections)
  const paragraphs = html.match(/<p>([\s\S]*?)<\/p>/g) || []
  const text = paragraphs.slice(0, 3).map(p => stripHtml(p)).filter(t => t.length > 20).join(' ')
  return truncateToSentences(text, 3)
}

async function fetchSummary(title) {
  try {
    // Get intro (overview)
    const overview = await getIntro(title)
    if (!overview) {
      console.log(`  ⚠ No article found for: ${title}`)
      return null
    }
    await sleep(300)

    // Get section list
    const sections = await getSections(title)
    await sleep(300)

    const result = { overview }

    // Find and fetch each target section
    for (const [key, names] of Object.entries(SECTION_NAMES)) {
      const section = sections.find(s =>
        names.some(n => s.line.toLowerCase() === n.toLowerCase())
      )
      if (section) {
        const text = await getSectionText(title, parseInt(section.index))
        if (text && text.length > 20) {
          result[key] = text
        }
        await sleep(300)
      }
    }

    return result
  } catch (err) {
    console.log(`  ⚠ Error fetching ${title}: ${err.message}`)
    return null
  }
}

async function main() {
  const outPath = join(__dirname, '../src/data/summaries.json')

  // Resume from existing data if available
  let summaries
  try {
    summaries = JSON.parse(readFileSync(outPath, 'utf-8'))
    console.log(`Resuming: ${Object.keys(summaries.countries).length} countries, ${Object.keys(summaries.states).length} states already fetched`)
  } catch {
    summaries = { countries: {}, states: {}, _meta: {} }
  }
  summaries._meta = {
    source: 'Wikipedia (en.wikipedia.org)',
    fetchedDate: new Date().toISOString().split('T')[0],
  }

  // Fetch country summaries
  console.log(`Fetching summaries for ${countries.length} countries...`)
  for (let i = 0; i < countries.length; i++) {
    const country = countries[i]
    const name = country.name.common
    if (summaries.countries[country.cca3]) {
      continue // already fetched
    }
    const wikiTitle = WIKI_COUNTRY_TITLES[name] || name
    console.log(`[${i + 1}/${countries.length}] ${name}`)

    const summary = await fetchSummary(wikiTitle)
    if (summary) {
      summaries.countries[country.cca3] = summary
    }
    await sleep(500) // rate limit - be more conservative
  }

  // Fetch US state summaries
  console.log(`\nFetching summaries for ${usStates.length} US states...`)
  for (let i = 0; i < usStates.length; i++) {
    const state = usStates[i]
    if (summaries.states[state.abbreviation]) {
      continue // already fetched
    }
    const wikiTitle = WIKI_STATE_TITLES[state.name] || state.name
    console.log(`[${i + 1}/${usStates.length}] ${state.name}`)

    const summary = await fetchSummary(wikiTitle)
    if (summary) {
      summaries.states[state.abbreviation] = summary
    }
    await sleep(500)
  }

  // Write output
  writeFileSync(outPath, JSON.stringify(summaries, null, 2))

  const countryCount = Object.keys(summaries.countries).length
  const stateCount = Object.keys(summaries.states).length
  console.log(`\nDone! Wrote ${countryCount} countries and ${stateCount} states to summaries.json`)
}

main()
