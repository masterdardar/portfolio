# Jonah Darryl Escoto — Architecture Portfolio

Single-page architectural portfolio in **React 19 + TypeScript + Vite**, styled with **pure CSS** (variables + per-component stylesheets) and **Three.js via React Three Fiber + Drei** for the 3D sections. Smooth scrolling via **Lenis**, reveals via **IntersectionObserver**, snap galleries via **native CSS scroll-snap**.

## Run it

```bash
npm install
npm run dev     # → http://localhost:5173
npm run build   # typecheck + production build into dist/
npm run preview # serve the production build locally
```

## How to swap images

All artwork is served from `public/images/` and referenced by plain URL paths — no imports to edit:

```
public/images/
  project-01/plan-01.svg … plan-06.svg
  project-01/elevation-01.svg … elevation-05.svg
  project-01/view-01.svg … view-05.svg
  project-02/…   (4 plans · 5 elevations · 4 views)
  project-03/…   (4 plans · 4 elevations · 6 views)
  studio/portrait.svg
```

1. Export your drawings/renders as JPG/PNG/WebP (SVG works too).
2. Drop them into the matching folder **keeping the exact filenames** (or update the paths in `src/data/projects.ts`).
3. Captions, focus points, and detail labels live in `src/data/projects.ts`:
   - `caption` — max 4 words, e.g. `"LEVEL 02 — 1:100"`
   - `focusX` / `focusY` — 0–1 coordinates of the dashed detail indicator
   - `detailLabel` — e.g. `"DETAIL A — 1:20"` (the blowup zooms 3× onto the focus point)
4. The studio portrait is referenced in `src/components/Practice/Practice.tsx` (`PORTRAIT`).

To regenerate the drafting-style placeholders from scratch:

```bash
node scripts/generate-placeholders.mjs
```

## How to swap 3D models

Real `.glb` files live in `public/models/`:

```
public/models/project-01.glb
public/models/project-02.glb
public/models/project-03.glb
```

1. Export your massing/model from Rhino/Revit/Blender as **glTF 2.0 binary (`.glb`)**, Metz-centered near the origin, roughly 2 units across.
2. Overwrite the matching file, keeping the filename (or update `model3D` in `src/data/projects.ts`).
3. Each model scroll-locks the page until it completes one full 360° rotation (`rotation.y = progress × 2π` in `src/components/Model3D/Model3D.tsx`).

## Editing content

- Projects, CV rows, software/skills: `src/data/projects.ts`
- Contact email/address/socials: `src/components/Contact/Contact.tsx` (also `Footer.tsx`)
- Design tokens: `src/styles/variables.css` · base styles: `src/styles/global.css`
- Layouts: `Project01.tsx` (full-screen snap galleries + reel), `Project02.tsx` (snap strips), `Project03.tsx` (accordion) in `src/components/SelectedWork/`

## Notes

- Custom hooks live in `src/hooks/`: `useInView`, `useScrollLock`, `useLenis`, `useCursor`.
- All motion respects `prefers-reduced-motion` (reveals shown statically, no scroll lock, no custom cursor).
- No CSS frameworks, no animation libraries beyond Lenis — only CSS variables, per-component `.css` files, native scroll-snap, and CSS keyframes.
