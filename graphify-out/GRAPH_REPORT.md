# Graph Report - satriyo-portofolio  (2026-10-26)

## Corpus Check
- 47 files · ~13,559 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 241 nodes · 492 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f59acbe3`
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
- .oxlintrc.json
- React + TypeScript + Vite
- tsconfig.json

## God Nodes (most connected - your core abstractions)
1. `react` - 24 edges
2. `playClick()` - 21 edges
3. `compilerOptions` - 18 edges
4. `compilerOptions` - 15 edges
5. `App()` - 14 edges
6. `usePrefersReducedMotion()` - 14 edges
7. `lucide-react` - 13 edges
8. `Section()` - 10 edges
9. `HudToggles()` - 8 edges
10. `GuideCharacter()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `HudToggles()`  [EXTRACTED]
  src/App.tsx → src/components/hud/HudToggles.tsx
- `App()` --calls--> `GameBackdrop()`  [EXTRACTED]
  src/App.tsx → src/game/GameBackdrop.tsx
- `App()` --calls--> `playClick()`  [EXTRACTED]
  src/App.tsx → src/game/useSound.ts
- `App()` --calls--> `usePrefersReducedMotion()`  [EXTRACTED]
  src/App.tsx → src/hooks/usePrefersReducedMotion.ts
- `AgentSimulator()` --calls--> `playChime()`  [EXTRACTED]
  src/components/AgentSimulator.tsx → src/game/useSound.ts

## Import Cycles
- None detected.

## Communities (11 total, 1 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.07
Nodes (39): dependencies, lucide-react@^1.30.0, react@^19.2.8, react-dom@^19.2.8, @react-three/fiber@^9.7.0, three@^0.185.1, devDependencies, oxlint@^1.75.0 (+31 more)

### Community 1 - "VoxelWorld.tsx"
Cohesion: 0.11
Nodes (27): HudToggles(), Block, BlockType, generateTerrain(), noise(), smooth(), gestureCtx(), listeners (+19 more)

### Community 2 - "App.tsx"
Cohesion: 0.14
Nodes (25): react, App(), PAGE_COMPONENTS, COLORS, GuideCharacter(), MinerSprite(), SPRITE, GithubIcon() (+17 more)

### Community 3 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 4 - "playClick"
Cohesion: 0.19
Nodes (18): lucide-react, Contact(), GithubIcon(), Filter, FILTERS, FilterTabs(), FilterTabsProps, ProjectCard() (+10 more)

### Community 5 - "usePrefersReducedMotion"
Cohesion: 0.13
Nodes (21): AgentSimulator(), AgentStatus, PRESETS, SimulatorPreset, TraceStep, ArchitectureFlow(), ArchitectureFlowProps, PULSES (+13 more)

### Community 6 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 7 - "Section"
Cohesion: 0.14
Nodes (15): About(), Section(), SectionProps, SkillsGrid(), StatItem(), StatsBar(), skillCategories, SkillCategory (+7 more)

### Community 9 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 11 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `package.json`, `VoxelWorld.tsx`, `playClick`, `usePrefersReducedMotion`, `Section`?**
  _High betweenness centrality (0.230) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06504065040650407 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `playClick` to `package.json`, `VoxelWorld.tsx`, `App.tsx`, `usePrefersReducedMotion`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `VoxelWorld.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10695187165775401 - nodes in this community are weakly interconnected._
- **Why does `playClick()` connect `playClick` to `VoxelWorld.tsx`, `App.tsx`, `usePrefersReducedMotion`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1380952380952381 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._