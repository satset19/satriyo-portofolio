# Graph Report - satriyo-portofolio  (2026-10-26)

## Corpus Check
- 52 files · ~23,518 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .xml 1, .css 1)

## Summary
- 323 nodes · 655 edges · 15 communities (14 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d4df0f2d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- VoxelWorld.tsx
- App.tsx
- compilerOptions
- playClick
- usePrefersReducedMotion
- compilerOptions
- Section
- useSound.ts
- .oxlintrc.json
- deploy.yml
- GameBackdrop.tsx
- tsconfig.json
- HudToggles.tsx
- Satriyo Portfolio

## God Nodes (most connected - your core abstractions)
1. `react` - 28 edges
2. `playClick()` - 23 edges
3. `compilerOptions` - 18 edges
4. `lucide-react` - 16 edges
5. `App()` - 16 edges
6. `compilerOptions` - 15 edges
7. `usePrefersReducedMotion()` - 14 edges
8. `VoxelWorld()` - 13 edges
9. `Section()` - 12 edges
10. `VoxelMinerGame()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Build and bundle layout` --references--> `VoxelWorld()`  [INFERRED]
  README.md → src/game/VoxelWorld.tsx
- `Build and bundle layout` --references--> `ContactPage()`  [INFERRED]
  README.md → src/pages/ContactPage.tsx
- `Build and bundle layout` --references--> `PipelinePage()`  [INFERRED]
  README.md → src/pages/PipelinePage.tsx
- `Build and bundle layout` --references--> `QuestsPage()`  [INFERRED]
  README.md → src/pages/QuestsPage.tsx
- `Build and bundle layout` --references--> `ArcadePage()`  [INFERRED]
  README.md → src/pages/ArcadePage.tsx

## Import Cycles
- None detected.

## Communities (15 total, 1 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (41): dependencies, lucide-react@^1.30.0, react@^19.2.8, react-dom@^19.2.8, @react-three/fiber@^9.7.0, three@^0.185.1, devDependencies, oxlint@^1.75.0 (+33 more)

### Community 1 - "VoxelWorld.tsx"
Cohesion: 0.12
Nodes (26): Block, BlockType, generateTerrain(), noise(), OreVein, SKY_ISLAND, smooth(), TORCH_VIEWPOINTS (+18 more)

### Community 2 - "App.tsx"
Cohesion: 0.12
Nodes (30): lucide-react, react, App(), PAGE_COMPONENTS, PAGE_LOADERS, PageComponent, PageFallback(), preloadPage() (+22 more)

### Community 3 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 4 - "playClick"
Cohesion: 0.17
Nodes (18): Contact(), GithubIcon(), Filter, FILTERS, FilterTabs(), FilterTabsProps, ProjectCard(), ProjectCardProps (+10 more)

### Community 5 - "usePrefersReducedMotion"
Cohesion: 0.15
Nodes (17): AgentSimulator(), AgentStatus, PRESETS, SimulatorPreset, TraceStep, ArchitectureFlow(), ArchitectureFlowProps, PULSES (+9 more)

### Community 6 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 7 - "Section"
Cohesion: 0.14
Nodes (16): Build and bundle layout, About(), Section(), SectionProps, SkillsGrid(), StatItem(), StatsBar(), skillCategories (+8 more)

### Community 8 - "useSound.ts"
Cohesion: 0.18
Nodes (23): ACHIEVEMENTS, AchievementToast(), gestureCtx(), listeners, playBreak(), playChime(), playExplosion(), playGameOver() (+15 more)

### Community 9 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 10 - "deploy.yml"
Cohesion: 0.06
Nodes (32): runs-on, steps, concurrency, cancel-in-progress, group, environment, needs, runs-on (+24 more)

### Community 11 - "GameBackdrop.tsx"
Cohesion: 0.33
Nodes (9): detectWebGL(), GameBackdrop(), isLowPowerDevice(), NavigatorHints, NetworkInformationLike, prefersSaveData(), StaticSky(), useAfterFirstPaint() (+1 more)

### Community 13 - "HudToggles.tsx"
Cohesion: 0.33
Nodes (6): HudToggles(), SkipLink(), toggleMute(), useMuted(), listeners, toggleNight()

### Community 14 - "Satriyo Portfolio"
Cohesion: 0.25
Nodes (7): Deployment, Features, Getting started, Project structure, Satriyo Portfolio, Scripts, Tech stack

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `package.json`, `VoxelWorld.tsx`, `playClick`, `usePrefersReducedMotion`, `Section`, `useSound.ts`, `GameBackdrop.tsx`, `HudToggles.tsx`?**
  _High betweenness centrality (0.185) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06312292358803986 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `App.tsx` to `package.json`, `playClick`, `usePrefersReducedMotion`, `useSound.ts`, `HudToggles.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `VoxelWorld.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11724137931034483 - nodes in this community are weakly interconnected._
- **Why does `Build and bundle layout` connect `Section` to `package.json`, `VoxelWorld.tsx`, `playClick`, `usePrefersReducedMotion`, `Satriyo Portfolio`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12317073170731707 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._