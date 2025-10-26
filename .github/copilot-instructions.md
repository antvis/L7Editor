## L7Editor — Quick instructions for AI coding agents

This repo is a React + TypeScript component library and docs site for a geographic editor built on AntV L7. Below are the essential facts an automated coding agent needs to be productive here.

1) High-level architecture
- Library entry: `src/index.tsx` exports the public API (`L7Editor`, components, types).
- UI pages: `src/pages/*` contains the editor page and page-level components.
- Reusable components: `src/components/*` holds component groups. Many map controls are under `src/components/map-control-group/`.
- State: Recoil atoms/selectors are in `src/recoil/` (central app state; use these when changing app behavior).
- Utilities: `src/utils/` has parsing, transform and upload helpers used across features.

2) Build / dev / docs workflows (explicit commands)
- Install: `npm install` (root)
- Local docs/dev site: `npm run start` → runs `dumi dev` (useful for UI/manual testing)
- Build library (produces `lib`/`es`): `npm run build` → uses `father build`
- Docs static build: `npm run docs:build` (dumi)
- Deploy docs to gh-pages: `npm run docs:deploy` or `npm run deploy` (build then deploy)
- Lint / format: `npm run lint`, `npm run prettier`, `npm run format`
- Other helpful scripts: `npm run i18n:collect` (kiwi extraction), `npm run doctor` (father diagnostic)

3) Key patterns & conventions (project-specific)
- Components are organized as directories with `index.tsx` and `styles.ts`. Example: `src/components/app-header/`, `src/components/map-control-group/draw-control/`.
- When adding a new control under `map-control-group`, follow existing pattern: create folder, export default component from `index.tsx`, and keep styles in `styles.ts`.
- State changes should use atoms/selectors in `src/recoil/*`. Inspect `atomState.ts` and `feature.ts` to follow conventions for derived state and selectors.
- i18n: translations live in `src/locales/langs/*.ts`. Run `npm run i18n:collect` to extract translation keys (repo uses `kiwi-intl`).
- Entry points and publishing: library entry is wired in `package.json` (`main: lib/index.js`, `module: es/index.js`, `types: es/index.d.ts`) and build output is produced by `father`.

4) Integration points & external dependencies
- Major runtime libs: `@antv/l7` (map rendering), `@antv/l7-draw` (draw tools), `@antv/larkmap`, `recoil` (state), `monaco-editor` (code/wkt editor), `onnxruntime-web` (optional ML inferencing). When touching map rendering or drawing behavior, inspect `src/app-map/` and `src/geojson-editor/editortool.ts`.
- Docs site: `dumi` powers the dev site and docs; pages and demos are under `docs/` and `docs/components`.

5) Small contract & success criteria for code changes
- Inputs: React props and recoil state slices (check `src/types` and `src/recoil/*`).
- Outputs: UI rendering and emitted events/state updates (components should not mutate global state directly — use recoil actions/selectors).
- Error modes: UI should fail gracefully (no uncaught exceptions). For build-time changes, `npm run build` must succeed and produce `es`/`lib` artifacts.

6) Useful examples (where to look)
- Add a map control: see `src/components/map-control-group/draw-control/` and `clear-control/` for component + styles pattern.
- Central exports: `src/index.tsx` and `src/components/index.ts` show how public API is composed.
- State patterns: `src/recoil/atomState.ts`, `src/recoil/feature.ts` (feature-driven state + selectors).
- GeoJSON edit flow: `src/geojson-editor/editortool.ts` and `src/geojson-editor/index.tsx`.

7) Editing & PR guidance for AI agents
- Preserve existing file organization and TypeScript types. The codebase uses `strict: true` in `tsconfig.json`.
- Run `npm run lint` and `npm run build` locally (or in CI) after substantive changes to ensure no type or lint regressions.
- When adding exports, update `src/index.tsx` so new public APIs are exported and included in builds.

8) Quick search patterns for automation
- Find map controls: `src/components/map-control-group/**/index.tsx`
- Find recoil atoms/selectors: `src/recoil/*.ts`
- Find locales: `src/locales/langs/*.ts`

If any part of this needs more detail (build caveats, CI specifics, or example PR diffs), tell me which area to expand and I will iterate.  