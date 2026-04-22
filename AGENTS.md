# AGENTS.md

## Project Overview

Philly Ward Leaders is a civic transparency web app showing Philadelphia's 69 Ward Leaders and their political influence. The frontend is a Vue 3 SPA that pulls data from Contentful CMS and static GeoJSON files. The `data-scripts/` subdirectory contains Python CLI tools for cleaning source data and importing it into Contentful.

## Common Commands

### Frontend (Node.js 20, run from repo root)

```bash
npm ci                     # Install dependencies
npm run dev                # Dev server on localhost:8080 (hot reload)
npm run build              # Production build to ./build
npm run lint               # ESLint (JS + Vue files)
npm run lint:fix           # ESLint auto-fix
npm run format:check       # Prettier check
npm run format             # Prettier auto-fix
npm run cy:run             # Cypress component tests (headless)
npm run cy:e2e             # Cypress e2e tests (needs serve-http running)
npm run cy:open            # Cypress interactive UI
```

### Data Scripts (Python 3 + pipenv, run from `data-scripts/`)

```bash
pipenv install             # Install dependencies
pipenv sync                # Install exact locked versions
pipenv run python cli.py --help          # Show available commands
pipenv run python cli.py leaders <csv>   # Convert leaders CSV to JSON
pipenv run python cli.py committee <csv> # Clean committee person data
pipenv run python cli.py divisions -o <outdir> <geojson>  # Split ward boundary GeoJSON
pipenv run python cli.py voters -r <registry> -t <turnout>  # Combine voter data
pipenv run python cli.py import <json> --space ID --content-type ID --apikey KEY
```

### Docker (alternative local dev)

```bash
docker compose build && docker compose up -d
docker compose exec ward-leaders bash    # Then run npm/pipenv commands inside
```

## CI Pipeline

GitHub Actions on push/PR to `master` (`.github/workflows/node.js.yml`):
1. `npm run format:check`
2. `npm run build`
3. `npm run cy:run` (component tests)
4. Cypress e2e tests (starts `serve-http`, runs e2e suite)

## Architecture

### Frontend (Vue 3 + Vite)

- **Entry:** `src/main.js` creates the Vue app with Vue Router and Vuex store
- **Views** (`src/views/`): Page-level components for each route — splash, ward-leader-list, ward-leader (detail), city-map, content-page (CMS-driven), feedback
- **Components** (`src/components/`): Reusable UI — ward-map (Leaflet), baseball-card, geocoder, nav-bar, stats-bar, notification
- **Store** (`src/store/`): Vuex with actions (async API calls), mutations, getters. Key state: leaders list, currentLeader, wardBoundaries, citywideBoundaries, contentPage
- **API** (`src/api/index.js`): Contentful SDK + axios wrapper
- **Config** (`src/config.js`): Public Contentful space/access token, AIS API key
- **Routing** (`src/router/index.js`): 7 routes including `/leaders/:party`, `/leaders/:party/:ward/:slug`, `/map`, and dynamic `/:slug` for CMS content
- **Styling:** SCSS with Bulma CSS framework
- **Maps:** Leaflet with vue-leaflet for interactive ward boundary maps
- **Build output:** `./build` directory

### Data Scripts (Python CLI)

- **`cli.py`**: Click CLI entry point grouping all subcommands
- **Processing modules**: `leaders.py`, `committee.py`, `divisions.py`, `registry.py`, `turnout.py` — each uses PETL for ETL pipelines
- **`contentful.py`**: Contentful Management API integration for import/drop operations
- **`input_data/`**: Source CSV and GeoJSON files

### Data Flow

Raw CSV/GeoJSON in `data-scripts/input_data/` -> Python scripts transform -> JSON output or Contentful import -> Frontend fetches from Contentful API at runtime + static GeoJSON from `public/data/`

## Linting

ESLint config (`.eslintrc.json`) extends: `plugin:vue/strongly-recommended`, `airbnb`, `plugin:cypress/recommended`, `prettier`. Prettier has final say on formatting.
