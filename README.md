# SimpleSilicon — Free VLSI Learning

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

SimpleSilicon is a free, independent learning project for VLSI and semiconductor
engineers. No paywalls, no premium tiers, no course selling, no login required.

> **Note:** Some curriculum sections (structured learning paths, interview
> banks) are temporarily not served while their content is being independently
> redeveloped. The Academy, video course library, and career resources below
> remain fully live.

This repository **is** the Next.js web application — the app lives at the repo
root (`src/`, `public/`, `package.json`), with support dirs (`project-bible/`) alongside.

## Features (live)

### VLSI Learning Academy (`/academy`)
- Self-paced learning tracks (Digital Logic, Verilog, SystemVerilog, UVM, RTL Design, Physical Design, Interview Prep)
- **Embedded video lectures per track**: inline YouTube playlist embeds + NPTEL course cards, mapped in `src/lib/video-references.ts`
- Day-by-day curricula with practice quizzes and progress tracking

### Free Video Course Library (`/learn/video-courses`)
- Curated NPTEL university courses and YouTube playlists
- Searchable, filterable by topic group

### Career Resources (`/resources`)
- VLSI role profiles and EDA toolchains, direct from tapeout experience

## Tech Stack

- **Framework:** Next.js 14 (App Router) — root of this repo
- **UI:** React 18 + TypeScript + Tailwind CSS (central design tokens in `src/styles/design-tokens.ts`)
- **Database:** Supabase (optional, with client-side fallbacks)
- **Hosting:** Vercel (root deployment, `vercel.json`), Docker image for self-hosting
- **CI:** GitHub Actions (gitleaks security scan + typecheck/test/build)

## Repo Layout

| Path | What it is |
|---|---|
| `src/` | The app: App Router pages, components, lib, styles |
| `public/` | Static assets (`llms.txt`, `manifest.json`, icons) |
| `supabase/` | 2 academy migrations (learning tracks/days/questions/results) |
| `project-bible/` | Architecture, security, changelog, product docs (owner mandate) |

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Open
http://localhost:3000
```

## Verification Gates

```bash
npm run typecheck   # tsc (app scope)
npm test            # jest suite (src/**/__tests__)
npm run build       # production build
```

## License

MIT