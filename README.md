# Satriyo Portfolio

A game-themed portfolio for Satriyo, Senior Backend & Infrastructure Engineer. The site is built like a voxel sandbox world: each section is a "page" you travel to from a hotbar, a live 3D voxel island renders behind the content, and an arcade page hosts a playable mining minigame.

Live site: https://satset19.github.io/satriyo-portofolio/

## Features

- Voxel world backdrop rendered with three.js and @react-three/fiber: terrain, water, clouds, torches, a beacon, ambient particles, a day/night toggle, and breakable blocks.
- Hash-based navigation (`#/spawn`, `#/pipeline`, `#/quests`, ...) with a loading-screen transition, a hotbar, an XP bar that tracks visited pages, and achievement toasts.
- Pipeline page with an interactive architecture flow (several topologies) and a multi-agent simulator.
- Quests (projects), Skills, Lore (about), and Contact pages.
- Arcade page with Voxel Miner, a canvas mining game with ores, dynamite, power-ups, and a persisted high score.
- Guide character with per-page hints, plus sound effects with a mute toggle.
- Accessibility and performance: honours `prefers-reduced-motion` (static sky, no transition delay), falls back when WebGL is unavailable, skips the 3D scene when Save-Data is on, caps render resolution on low-power devices, and stops rendering while the tab is hidden.

## Tech stack

| Area | Tools |
| --- | --- |
| UI | React 19, TypeScript 6 |
| Build | Vite 8 (Rolldown), pnpm |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| 3D | three.js, @react-three/fiber |
| Icons | lucide-react |
| Lint | oxlint |
| Hosting | GitHub Pages via GitHub Actions |

## Getting started

Requirements: Node.js 20.19+ or 22+, and pnpm (`corepack enable` sets it up).

```bash
pnpm install
pnpm dev        # dev server at http://localhost:5173/
```

The dev server serves from `/`. Production builds use the `/satriyo-portofolio/` base path.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server with HMR |
| `pnpm build` | Type-check (`tsc -b`) and build to `dist/` |
| `pnpm preview` | Serve the production build locally at `http://localhost:4173/satriyo-portofolio/` |
| `pnpm lint` | Run oxlint |

## Build and bundle layout

`pnpm build` writes a static site to `dist/`. The bundle is split so the first paint only needs the app shell:

- `index` and `react-vendor`: app shell, HUD, router, and the Spawn landing page.
- One chunk per route (`PipelinePage`, `QuestsPage`, `SkillsPage`, `LorePage`, `ArcadePage`, `ContactPage`), loaded on navigation. The target page is prefetched while the loading screen plays.
- `VoxelWorld`, `three-fiber`, `three-core`: the 3D backdrop. These are requested only after the first frame is painted and the browser is idle, and never when reduced motion, Save-Data, or no WebGL applies.

Chunk splitting is configured in `vite.config.ts` (`manualChunks`).

## Deployment

The site deploys to GitHub Pages through `.github/workflows/deploy.yml`:

1. Triggered on push to `main` or manually (`workflow_dispatch`).
2. Installs dependencies with pnpm (`--frozen-lockfile`), runs lint and build.
3. Copies `index.html` to `404.html` as a fallback, then publishes `dist/` with `actions/upload-pages-artifact` and `actions/deploy-pages`.

One-time setup: in the repository settings, go to Pages and set Source to "GitHub Actions".

If the repository is renamed or served from a custom domain, update `PAGES_BASE` in `vite.config.ts`, the absolute URLs in `index.html` (canonical, `og:url`, `og:image`, `twitter:image`), and `public/robots.txt` / `public/sitemap.xml`.

## Project structure

```
.
├── .github/workflows/deploy.yml   GitHub Pages build and deploy
├── public/                        Static files copied as-is (favicon, og-image, robots.txt, sitemap.xml)
├── index.html                     HTML entry, SEO and social meta tags
├── vite.config.ts                 Base path and chunk splitting
└── src/
    ├── main.tsx                   React root
    ├── App.tsx                    Layout, lazy route loading, page transitions
    ├── router.ts                  Hash router (usePage, goTo, page list and labels)
    ├── index.css                  Tailwind entry and game-style theme
    ├── pages/                     One component per route
    ├── components/                Sections, cards, dialogs, simulator, architecture flow
    │   └── hud/                   Hotbar, XP bar, achievement toasts, toggles
    ├── game/                      3D backdrop, voxel terrain, minigame, sound, world state
    ├── hooks/                     Reduced motion, in-view, count-up hooks
    ├── data/                      Projects, skills, stats, architecture nodes, guide script
    └── assets/                    Images bundled by Vite
```
