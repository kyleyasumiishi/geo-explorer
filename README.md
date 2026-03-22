# GeoExplorer

An interactive geography learning app built with React. Explore countries and US states on a map, test your knowledge with quizzes, and study with structured flashcards.

## Features

### Explorer Mode
- Click countries or US states on an interactive map to view details
- Search by name, official name, abbreviation, or capital
- View Wikipedia-sourced summaries covering overview, history, government, and economy
- Recently viewed list for quick navigation

### Quiz Mode
- Random country or state quizzes with two types: **Name** (identify the highlighted region) and **Capital** (name the capital)
- Score and streak tracking
- Accepts common names, official names, alternate spellings, and abbreviations

### Learn Mode
- Choose a geographic region and number of items to study
- Flashcard-style learning phase with detailed info
- Quiz phase testing only on the items you just learned
- Retry missed items to reinforce weak areas

## Tech Stack

- **React 19** (Vite 6)
- **react-simple-maps** — SVG world and US maps using TopoJSON
- **Tailwind CSS 4** — utility-first styling
- **Wikipedia API** — structured country/state summaries

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)

### Installation

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is needed because react-simple-maps hasn't updated its peer dependency to React 19 yet.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

## Data Sources

| Data | Source |
|------|--------|
| Country info | [REST Countries API](https://restcountries.com/) |
| US state info | Manual curation |
| World map | [world-atlas](https://github.com/topojson/world-atlas) (110m TopoJSON) |
| US map | [us-atlas](https://github.com/topojson/us-atlas) (10m TopoJSON) |
| Summaries | [Wikipedia](https://en.wikipedia.org/) via MediaWiki API |

## Project Structure

```
src/
├── components/
│   ├── WorldMap.jsx      # Interactive world map (Equal Earth projection)
│   ├── USAMap.jsx         # Interactive US map (Albers USA projection)
│   ├── SearchBar.jsx      # Search with keyboard navigation
│   ├── InfoPanel.jsx      # Country/state details + summaries
│   ├── QuizPanel.jsx      # Name and capital quizzes
│   └── LearnPanel.jsx     # Flashcard learning + quiz
├── data/
│   ├── countries.json     # 250 countries from REST Countries API
│   ├── usStates.json      # 50 US states
│   ├── mapCountries.js    # Filtered list of mappable countries
│   └── summaries.json     # Wikipedia summaries (overview, history, gov, economy)
└── App.jsx                # Root component, routing between modes
scripts/
└── fetch-summaries.mjs    # Wikipedia scraper for regenerating summaries
```

## License

MIT
