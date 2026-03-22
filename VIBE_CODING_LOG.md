# Vibe Coding Log: Building GeoExplorer with Claude

A retrospective on building an interactive geography learning app in a single session using Claude Code as an AI pair programmer.

## The Numbers

- **Total session time**: ~2.5 hours (1:58 PM to ~4:30 PM)
- **Commits**: 28
- **Lines of app code**: ~1,350 (across 8 components)
- **Lines of data**: ~10,800 (auto-fetched from APIs)
- **Bug fixes**: 10
- **Features shipped**: 3 major modes (Explorer, Quiz, Learn) + Wikipedia summaries

## How the Session Unfolded

### Phase 1: Planning and Setup (13:58 - 14:05)

I brainstormed vibe code project ideas and free APIs with Claude Sonnet on my phone while waiting in the car on Sunday morning during an errand run. During this planning stage I worked with Claude to develop a high-level project plan that I could copy/paste into Claude Code. Once I got home, I started by giving Claude Code in VS Code the detailed project plan — what I wanted, the modes, the tech stack. Rather than diving in, Claude gave feedback on the plan and suggested improvements. I asked to go step-by-step, reviewing each plan before execution. This "plan then build" rhythm became the pattern for the whole session.

**What I did**: Wrote the initial vision, asked questions, reviewed plans.
**What Claude did**: Scaffolded the project (Vite + React + Tailwind), fetched 250 countries from REST Countries API, created the US states data file, and built the initial world map.

**Git lesson**: I also wanted to use this project to refresh myself on git commands. This stage of the project is where I brushed up on `git init`, `git add`, `git commit`, `.gitignore`, `git status`, `git diff`, and `git log`. Claude taught these organically as we hit natural commit points.

### Phase 2: Core Explorer Features (14:05 - 14:26)

Built the main exploration features in rapid succession — roughly one feature per commit, one commit every 2-3 minutes:

1. Interactive world map with click highlighting
2. Search bar with autocomplete
3. Info panel with country details + recently viewed
4. Zoom-to-country on selection
5. USA map with state details and World/USA toggle

**First major bug** (14:12): The app showed a blank screen. The error was deep in the build tooling — Vite 8's new Rolldown bundler couldn't handle react-simple-maps' CommonJS imports. Claude tried two fixes (optimizeDeps, installing prop-types) before determining the root cause and downgrading to Vite 6. This was the longest single debugging stretch (~7 min).

**Second major bug** (14:25): Clicking countries on the world map didn't work. The TopoJSON data uses different names than our countries.json (e.g., "United States of America" vs "United States", "Dem. Rep. Congo" vs "DR Congo"). Claude created a MAP_NAME_FIXES mapping to bridge the two data sources. This pattern of "two data sources with different conventions" came up repeatedly.

**Pattern I noticed**: I'd say "looks good" or "proceed" and Claude would build. When something broke, I'd send a screenshot or describe the issue and Claude would diagnose and fix. The feedback loop was very tight.

### Phase 3: Mobile and Polish (14:26 - 14:55)

I mentioned I'd mostly use this on an iPad Mini and iPhone. This triggered a round of responsive design work:

- Switched from Mercator to Equal Earth map projection (less distortion)
- Added collapsible sidebar for mobile
- Responsive header layout
- Re-added zoom-to-country (I'd asked to remove it, then changed my mind)

**Color scheme**: I gave Claude a specific dark color scheme to apply across the whole app. This was a good example of a "batch change" — Claude updated all 7 component files in one pass.

**My approach to decisions**: I often deferred to Claude's judgment ("is there a way you'd recommend making it more viewable?", "what do you think?"). Other times I was specific about what I wanted. The balance worked well — Claude would suggest, I'd approve or redirect.

### Phase 4: Quiz Mode (14:36 - 15:17)

Built in sub-steps at my request (I asked "should we break this into smaller steps?"):

1. Mode toggle + placeholder panel
2. Name-the-country quiz with scoring
3. Capital quiz type + skip button
4. Bug fixes (multiple highlights, mobile text color)

**Design decision I made well**: When the quiz showed just Submit, I asked "should there be an IDK button?" Claude suggested Submit + Skip, which was exactly right.

**Bug pattern**: Several bugs came from state bleeding between modes — the explorer's `selected` state persisting into quiz mode, causing two countries to highlight simultaneously. Claude fixed this by conditionally passing `null` based on the active mode.

### Phase 5: Learn Mode (15:17 - 15:34)

The most complex feature — a four-phase learning flow (setup -> flashcards -> quiz -> results). Claude built this in two commits:

1. Setup screen with region/count selection
2. Learn, quiz, and results phases

**My contribution**: I asked for a custom number input after the preset options (5/10/15/20), which was a small but good UX addition.

**Unmappable countries bug**: Some countries in our data (small islands like Guadeloupe, Nauru) don't appear on the 110m TopoJSON map. When the learn mode tried to highlight them, nothing happened. Claude created a filtered `mappableCountries` list that excludes 75 small territories from quiz/learn modes while keeping them in explorer.

### Phase 6: Wikipedia Summaries (15:34 - 16:11)

The longest single feature. I asked "can we get more info about these countries?" Claude explored the Wikipedia API, and I pushed for more depth ("I want more than 2-3 sentences"). We iterated:

1. Claude wrote a US prototype with 4 sections (overview, history, government, economy)
2. I asked to make it 50% more concise — Claude trimmed each section
3. I approved the format
4. Claude wrote a scraper script to fetch all 250 countries + 50 states

**Rate limiting**: The first scraper run hit Wikipedia's rate limit (HTTP 429) after ~100 countries. Claude added retry logic with exponential backoff and a resume capability (reads existing data, skips already-fetched entries). The second run completed successfully.

**Performance question I asked**: "If we pull this for all countries, how much slower will the app be?" Claude's answer: ~200-300KB gzipped, parses in <10ms. Negligible. This was a good instinct to check before committing to the approach.

### Phase 7: Ship It (16:11 - 16:30)

- Added README
- Security audit (Claude checked for API keys, secrets, personal info — all clean)
- Learned `git remote add origin`, `git push`
- Set up GitHub Pages deployment (gh-pages package, base path config)
- Created a `light-theme` branch to test a new color scheme
- Merged and deployed

**Git branching lesson**: The light theme was done on a separate branch, which let me compare dark vs light by switching branches. This was a natural way to learn `git checkout`, `git merge`.

## My Prompting Patterns

Looking back, I used a few distinct patterns:

### 1. Vision Setting
> "Read this plan fully first. Give me feedback or thoughts about how to go about it better..."

I gave Claude the full picture upfront. This let Claude make architectural decisions (client-only, static JSON, react-simple-maps) that held up throughout.

### 2. Gate-Keeping
> "for each step, can you write a step by step plan for what you'll do, and i review that"

I insisted on reviewing plans before execution. This slowed things down slightly but meant I understood what was being built and could redirect early.

### 3. Screenshot-Driven Debugging
When something looked wrong, I sent screenshots rather than trying to describe the issue. This was more efficient — Claude could see exactly what I was seeing.

### 4. Taste-Based Feedback
> "i don't like how it zooms in when i click"
> "is there a different color scheme you think looks better?"
> "the borders are too light"

I gave subjective feedback and let Claude translate it into code. I didn't need to know CSS to direct the visual design.

### 5. Deferring to Claude
> "what do you think?"
> "is there a way you'd recommend making it more viewable?"
> "should we break this into smaller steps or can you handle?"

I trusted Claude's judgment on implementation details and asked for opinions on UX.

### 6. Scope Control
> "can you add the united states first to the app, before scraping everything"

I occasionally slowed Claude down to validate an approach at small scale before going big. This saved time on the Wikipedia scraping (we iterated on format before fetching 300 articles).

## What Went Well

- **Speed**: From zero to deployed app in ~2.5 hours. The tight "plan, build, review, commit" loop kept momentum high.
- **Bug fixing**: Claude diagnosed most bugs quickly from screenshots or descriptions. The TopoJSON name-matching issues were subtle and would have taken me much longer alone.
- **Learning git**: By committing at natural breakpoints throughout the session, I learned git commands in context rather than in the abstract.
- **Incremental complexity**: Features built on each other cleanly. The quiz mode reused the map highlighting from explorer. Learn mode reused quiz logic.
- **Mobile-first thinking**: Mentioning my target devices early meant responsive design was baked in, not bolted on.

## What I'd Do Differently

- **Test on mobile earlier**: I mentioned mobile pretty late. Some layout issues could have been caught sooner.
- **Color scheme earlier**: Applying the dark theme after building everything meant touching every file. Defining a color palette upfront (or using CSS variables/Tailwind theme) would have been cleaner.
- **Commit more granularly during debugging**: Some commits bundle a fix with a feature. Separating them would make the git history more useful.
- **Ask about data quality sooner**: I asked "how confident are you that the data is accurate?" — good instinct, should have done it right after the data was fetched.

## Tools and Tech Decisions

| Decision | Reasoning |
|----------|-----------|
| Vite (not CRA) | Modern, fast, recommended for new React projects |
| react-simple-maps | SVG maps with built-in TopoJSON support, clickable regions |
| Static JSON (not API) | No backend needed, instant loads, works offline |
| Tailwind CSS | Rapid styling without writing CSS files |
| Wikipedia API | Free, comprehensive, structured content for every country |
| gh-pages | Simple deployment, no CI/CD setup needed |
| Vite 6 (not 8) | Vite 8's Rolldown bundler had CJS compatibility issues with react-simple-maps |

## Session Stats

- **User messages**: ~60
- **Commits**: 28 (roughly 1 every 5 minutes)
- **Files created**: 15
- **Bugs encountered and fixed**: 10
- **Times I said "looks good"**: ~15
- **Times I said "proceed"**: ~8
- **Screenshots sent**: ~4
- **Branches created**: 2 (main, light-theme)
