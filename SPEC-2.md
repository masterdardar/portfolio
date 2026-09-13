# Final Build Spec — Jonah Darryl Escoto Architecture Portfolio

A single-page architectural portfolio. React 19 + TypeScript + Vite. Pure CSS. Real images and real `.glb` models. The visual language is a drafting sheet: hairlines, mono micro-labels, extreme type contrast, one warm terracotta accent, zero ornament that isn't structural.

---

## 0. Change from the previous spec

**Blowup panel position changed.** The blowup is no longer parked in the corner opposite the POI with a leader line running to it. It now floats **near the indicator**, positioned relative to the pointer, and it clamps to stay inside the image bounds. Everything else from the earlier spec stands.

---

## 1. DESIGN SYSTEM

### 1.1 Tokens

```css
:root {
	--ink: #0a0a0a;
	--mute: #767676; /* micro-labels — meets 4.5:1 on paper */
	--mute-soft: #8a8a8a; /* only where text is decorative or ≥24px */
	--paper: #ffffff;
	--bone: #fafafa;
	--clay: #b85c38;

	--hair: rgba(10, 10, 10, 0.1);
	--hair-soft: rgba(10, 10, 10, 0.06);
	--tick: rgba(10, 10, 10, 0.35);
	--crosshair: rgba(10, 10, 10, 0.22);
	--dot: rgba(10, 10, 10, 0.13);
	--rule: rgba(10, 10, 10, 0.05);

	--font-display: "Inter Tight", "Helvetica Neue", Helvetica, Arial, sans-serif;
	--font-sans: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
	--font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

	--ease: cubic-bezier(0.4, 0, 0.2, 1);

	--maxw: 1440px;
	--gutter: 20px;
	--gutter-md: 40px;
	--nav-h: 56px;
	--nav-h-md: 64px;
}
```

### 1.2 Global base

```css
* {
	border-radius: 0 !important;
}

html {
	scroll-behavior: smooth;
	scroll-padding-top: 64px;
	-webkit-text-size-adjust: 100%;
}

body {
	background: var(--paper);
	color: var(--ink);
	font-family: var(--font-sans);
	font-weight: 300;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	overflow-x: hidden;
}

::selection {
	background: var(--ink);
	color: var(--paper);
}
:focus-visible {
	outline: 1px solid var(--ink);
	outline-offset: 3px;
}

h1,
h2,
h3 {
	font-family: var(--font-display);
	font-weight: 300;
	letter-spacing: -0.03em;
	line-height: 0.92;
}
```

`border-radius: 0 !important` is load-bearing — no UA default rounding can ever appear.

### 1.3 Typography scale

| Role            | Mobile                      | ≥768px                      | Weight | LH   | Tracking | Family      |
| --------------- | --------------------------- | --------------------------- | ------ | ---- | -------- | ----------- |
| Hero H1         | `clamp(40px, 12.5vw, 76px)` | `clamp(76px, 9vw, 132px)`   | 200    | 0.86 | -0.035em | display     |
| Project H3      | `11vw`                      | `clamp(38px, 4.4vw, 68px)`  | 300    | 0.94 | -0.03em  | display     |
| Statement       | `8.4vw`                     | `clamp(30px, 3.6vw, 58px)`  | 300    | 1.06 | -0.03em  | display     |
| Practice line   | `8.6vw`                     | `clamp(30px, 3.8vw, 58px)`  | 300    | 1.05 | -0.03em  | display     |
| Contact email   | `8.6vw`                     | `clamp(44px, 6.6vw, 108px)` | 200    | 0.95 | -0.035em | display     |
| CV row title    | 22px                        | 28px                        | 300    | 1    | -0.03em  | display     |
| Mobile nav link | `13vw`                      | —                           | 300    | 1    | -0.03em  | display     |
| Body paragraph  | 13px                        | 14px                        | 300    | 1.6  | normal   | sans        |
| Micro-label     | 10px                        | 10.5px                      | 400    | 1.2  | 0.15em   | mono, UPPER |
| Micro-small     | 9px                         | 9px                         | 400    | 1.2  | 0.15em   | mono, UPPER |

```css
.micro {
	font-family: var(--font-mono);
	font-size: 10px;
	line-height: 1.2;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	font-weight: 400;
	color: var(--mute);
}
@media (min-width: 768px) {
	.micro {
		font-size: 10.5px;
	}
}

.micro-sm {
	font-family: var(--font-mono);
	font-size: 9px;
	line-height: 1.2;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	font-weight: 400;
	color: var(--mute);
}
```

**Hero name wrap.** Render `<h1 class="hero-name"><span>Jonah Darryl</span><span>Escoto</span></h1>`. `.hero-name span { display: block }`, becoming `display: inline` at ≥768px. Verify at 320 / 390 / 768 / 1440 / 1920.

### 1.4 Spacing

`8 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 112 / 128 / 160 / 192`

| Context                    | Mobile  | ≥768px  |
| -------------------------- | ------- | ------- |
| Page gutter                | 20px    | 40px    |
| Section padding (vertical) | 96px    | 160px   |
| Between project blocks     | 64px    | 112px   |
| Between category blocks    | 80px    | 128px   |
| Category header → grid     | 24px    | 32px    |
| Image grid gap             | **1px** | **1px** |
| CV row vertical            | 20px    | 28px    |
| Caption offset from rule   | 10px    | 10px    |

### 1.5 Grid & container

```css
.container {
	max-width: var(--maxw);
	margin-inline: auto;
	padding-inline: var(--gutter);
}
@media (min-width: 768px) {
	.container {
		padding-inline: var(--gutter-md);
	}
}

.grid12 {
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	gap: 24px;
}
```

### 1.6 Background treatments

```css
.dotgrid {
	background-image: radial-gradient(var(--dot) 0.9px, transparent 1px);
	background-size: 8px 8px;
}
.linegrid {
	background-image: linear-gradient(to right, var(--rule) 1px, transparent 1px);
	background-size: 96px 100%;
}
```

Both as `position:absolute; inset:0; pointer-events:none;` with `aria-hidden="true"`.

**Crosshairs** — 11×11px `+` at `--crosshair`, drawn with two pseudo-element 1px lines. Hero placements: `left:20px/top:22vh`, `left:33.33%/top:38vh`, `right:40px/top:30vh` (≥768 only), `left:66.66%/top:64vh` (≥768 only).

**Side rails** — fixed 1px verticals at `left:40px` / `right:40px` inside a `max-width:1440px` wrapper, desktop only, `--hair-soft`.

**Corner ticks** — L-shaped 1px marks at the four corners of a framed element. Params: `size` (default 10), `inset` (default 0), `color` (default `--tick`). Used at `size:12 inset:6` on hero plates, `size:10 inset:6` on grid plates, `size:14 inset:0` on 3D viewports, `size:8 inset:4` on blowup panels, and `rgba(255,255,255,0.75)` when over a photograph.

---

## 2. COMPONENTS

### 2.1 Navigation

Fixed bar. `position: fixed; inset-inline: 0; top: 0; z-index: 50`. Height 56px mobile / 64px desktop. `.container` inner flex row, space-between.

Transparent at rest. After `scrollY > 24`: `background: rgba(255,255,255,0.70); backdrop-filter: blur(12px); border-bottom: 1px solid var(--hair)`. Transition 500ms `var(--ease)`.

**Left:** `Jonah Darryl Escoto` in micro, followed by `— EST. 2018` in mute. Hidden below 640px.

**Right (≥768px):** `Work · Model · Practice · CV · Contact`, gap 32px, micro-label, animated underline on hover.

**Mobile (<768px):** 32×32 hamburger, two right-aligned 1px bars (24px and 16px), 5px apart. Opens a full-screen overlay: paper background, 56px header strip with `MENU` micro-label and close button, links as full-width rows at `13vw` with hairlines between and right-aligned `01`–`05` indices, footer strip with `ARCHITECTURE — LISBON` and phone. `body { overflow: hidden }` while open, focus trapped, `Escape` closes.

### 2.2 Hero

`min-height: 100svh; display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; position: relative`.

Layer order: dot grid → line grid (≥768) → corner artwork → crosshairs → top meta row → name block.

**Corner artwork** — axonometric peeking from the top-right, `aria-hidden`, pointer-events none:

```css
.hero-art {
	position: absolute;
	top: 8%;
	right: -18%;
	width: 105vw;
	opacity: 0.42;
	mix-blend-mode: multiply;
}
@media (min-width: 768px) {
	.hero-art {
		top: 6%;
		right: -8%;
		width: 58vw;
	}
}
```

The multiply blend lets the dot grid read through the artwork.

**Top meta row** — absolute at `top: 80px` (112px ≥768). Left: `SELECTED WORKS` + inline 24px hairline + `2018 / 2025`. Right: coordinates in micro, hidden below 768px.

**Scroll line** — absolute `bottom: 30vh; left: 40px`, desktop only. 64px tall, 1px wide track, animated `scaleY` with a transform-origin flip at the midpoint, 2.8s infinite.

**Name block** — bottom-anchored. `<h1>` name → full-width hairline at 24/32px → baseline row with `INDEPENDENT PRACTICE / PRINCIPAL` (slash and second term in mute) left and `ARCHITECTURE — LISBON` right.

Do not repeat the name in the left micro-label — it already dominates as the H1.

### 2.3 Practice Statement

Sweep rules above and below. `padding-block: 96px / 160px`. `.grid12`: dimension-line accent in cols 1–2 (≥768 only) and the statement (≤20 words) in cols 4–12.

### 2.4 Selected Work index header

`.container` with `padding-top: 80px / 128px`. Row with hairline bottom: `SELECTED WORK` left; right side the numbered index `01 — 02 — 03` with 24px/48px literal hairlines as separators, terminating in `03 BUILT`.

### 2.5 Project opener

`.grid12` inside `.container`, alternating per project.

|            | Default (P01, P03)           | Mirrored (P02)        |
| ---------- | ---------------------------- | --------------------- |
| Hero plate | cols 1–7                     | cols 6–12, `order: 2` |
| Metadata   | cols 9–12, `align-self: end` | cols 1–4, `order: 1`  |

**Hero plate** — aspect `25/17`, hairline frame, corner ticks `size:12 inset:6`, full Plate interaction.

**Metadata block**, staggered 0 / 80 / 140 / 200ms:

1. Index micro-label · 40px/64px hairline · layout name micro-label in mute (`FULL SCREEN REEL` or `MASONRY INDEX`).
2. `<h3>` title, `margin-top: 20px / 28px`.
3. Tags (3–4), `margin-top: 24px / 32px`, separated by 10px vertical hairlines.
4. Hairline top with metadata line (`2023 — LISBON, PT — BUILT`) in micro ink, then brief (≤10 words, `max-width: 34ch`) below.

### 2.6 Project 01 — full-screen snap galleries

Three sections, each full viewport: Floor Plans, Elevations, 3D Views.

```css
.fs-section {
	position: relative;
	height: calc(100svh - 56px);
	border-top: 1px solid var(--hair);
}
@media (min-width: 768px) {
	.fs-section {
		height: calc(100svh - 64px);
	}
}

.fs-track {
	display: flex;
	height: 100%;
	width: 100%;
	overflow-x: auto;
	overflow-y: hidden;
	scroll-snap-type: x mandatory;
	overscroll-behavior-x: contain;
	-webkit-overflow-scrolling: touch;
	scrollbar-width: none;
}
.fs-track::-webkit-scrollbar {
	display: none;
}

.fs-slide {
	scroll-snap-align: start;
	flex: 0 0 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 64px 16px 96px;
	position: relative;
}
@media (min-width: 768px) {
	.fs-slide {
		padding: 64px 40px 96px;
	}
}
```

**Category header** — absolute top, `pointer-events: none`. Row with hairline bottom: `index · 20px/48px hairline · name · flex-1 hairline · project title` in mute.

**Image wrapper width** — `min(100% - 8px, calc((100svh - 250px) * <ratio>))`, then `aspect-ratio` set from the ratio. Use `object-fit: contain` — never crop a drawing. The 250px reserves header, caption, and reel.

**Caption** — absolute `bottom: 64px`, `left/right: 16px` (40px ≥768). Full-width hairline, then row: `PLAN 03 / 06` in ink · 24px/40px hairline · name in mute · project meta right (≥768).

**Reel navigation** — fixed bottom, visible only while its section sits inside an IntersectionObserver band with `rootMargin: "-55% 0px -35% 0px"` (guarantees only one reel shows at a time).

Collapsed: each item is a **1px × 40px** vertical line, active in solid ink, others 30% ink. Expanded on hover (desktop) or tap (touch): items become **80×62px** thumbnails (56×60 below 768px) over 400ms, `object-fit: cover`, active gets 1px ink border and full opacity, others 45%. Click scrolls to `i * track.clientWidth` with `behavior: "smooth"`. Support pointer drag (disable snap during drag, restore on release), touch swipe, and Arrow keys on a focused track. Mount thumbnails only while expanded.

### 2.7 Image interaction — dashed indicator + blowup

Applies to **every image** on the site: all project images, the studio photograph, and both 3D viewports.

#### Indicator

56px `<button>` centered on the image's `focus` point via `left: x*100%; top: y*100%; transform: translate(-50%,-50%)`. Contains an SVG `viewBox="0 0 64 64"`:

- Dashed circle `r=30`, `stroke="rgba(10,10,10,0.4)"`, `stroke-width="1"`, `stroke-dasharray="3 5"`
- Crosshair `+` — two 1px lines, 25→39
- Center dot, `r=1.4`, `fill="rgba(10,10,10,0.65)"`

```css
@keyframes dashspin {
	to {
		transform: rotate(360deg);
	}
}
.dash-spin {
	transform-box: fill-box;
	transform-origin: center;
	animation: dashspin 11s linear infinite;
}
.poi {
	transform: translate(-50%, -50%) scale(1);
	transition: transform 300ms var(--ease);
}
.poi:hover,
.poi.on {
	transform: translate(-50%, -50%) scale(1.1);
}
.poi:hover .dash-spin,
.poi.on .dash-spin {
	animation-duration: 5s;
}
```

#### Blowup — **floats near the indicator**

The blowup panel is **anchored to the indicator**, positioned relative to the pointer or to the indicator's own position within the image. It sits close to the point being magnified, not pushed to the opposite corner.

**Geometry.**

The panel is `panelW%` of the image container width, with `aspect-ratio` equal to the **image's** aspect ratio, so a panel `W%` wide is also `W%` tall.

Given `focus.x` and `focus.y` (0–1, relative to the image box), compute whether the panel should extend **right** or **left** of the indicator, and **up** or **down**, based on which side has room:

```
toRight  = focus.x < 0.5         // indicator on the left half → panel extends right
toBottom = focus.y < 0.5         // indicator on the top half  → panel extends down

panelLeft   = toRight  ? focus.x*100 + gapPct       : focus.x*100 - panelW - gapPct
panelTop    = toBottom ? focus.y*100 + gapPct       : focus.y*100 - panelW - gapPct
```

where `gapPct` is a small percentage (start with `4%`) so the panel sits just clear of the 56px indicator.

The panel is absolutely positioned in the same coordinate space as the image, using `%` for both left/top. Clamp both axes so the panel never leaves the image box:

```
panelLeft = clamp(0, panelLeft, 100 - panelW)
panelTop  = clamp(0, panelTop,  100 - panelW)
```

**Transform origin** is the corner of the panel that touches the indicator side:

```css
transform-origin: $ {
	toright?"left": "right";
}
$ {
	tobottom?"top": "bottom";
}
```

This makes the panel appear to grow _from_ the indicator.

**Floating, no leader line.** There is no separate connector line — the panel sits close enough to the indicator that the relationship reads by proximity. If the visual needs an extra cue, use a very short 1px stub (8–12px) between the panel and the indicator only when the panel is not directly adjacent. Do not reintroduce the long leader line from the earlier spec.

**Cursor-tracked variant (optional, desktop only).** On `(hover: hover) and (pointer: fine)`, instead of anchoring to the indicator, the panel follows the pointer with a small offset (16px right and below the cursor), still clamped to the image bounds. Choose whichever feels better in review; the indicator-anchored version is the default because it survives touch and keyboard.

**Panel chrome.** `1px solid var(--hair)` frame, `background: var(--paper)`, corner ticks `size:8 inset:4`, center crosshair (3×1 and 1×3 bars at 30% ink) marking the magnified point.

**Caption** sits on the side of the panel nearest the image edge (so it doesn't sit between the panel and the indicator). When the panel extends down (`toBottom` true), the caption is **above** the panel; otherwise **below**. Caption row: detail label (`--ink`, micro) · flex-1 hairline · scale (`--mute`, micro), on a `rgba(255,255,255,0.9)` chip with `2px 4px` padding so it stays legible over dense linework.

**Transition.** Fade in `opacity 0→1` and `scale 0.95 → 1`, **300ms** `var(--ease)`.

**Crop.** Render the magnified region with CSS background properties on a full-bleed inner element:

```css
.blow-crop {
	position: absolute;
	inset: 0;
	background-image: url(<same src as the main image>);
	background-repeat: no-repeat;
	background-size: calc(var(--zoom) * 100%);
	background-position: calc(var(--px) * 100%) calc(var(--py) * 100%);
}
```

`--zoom` is the multiplier (2.6–3.4 depending on context), `--px` and `--py` are the focus point in 0–1 space. Percentage background-position aligns the same relative point of the image with the same relative point of the container — which is exactly zoom-about-a-point.

Only mount/paint the crop while the panel is open.

#### Parameters per context

| Context                      | `panelW`       | `zoom` |
| ---------------------------- | -------------- | ------ |
| Project opener hero          | 34%            | 3.2    |
| Project 01 full-screen slide | 26%            | 3.4    |
| Projects 02/03 masonry cell  | 46%            | 3.0    |
| Studio photograph            | 50%            | 2.6    |
| 3D viewport                  | 32% (46% <768) | 2.6    |

#### Triggers

**Fine pointer:** open on wrapper `pointerenter`, close on `pointerleave`. Also open on indicator `focus` for keyboard reachability.

**Coarse pointer** (`matchMedia("(hover: none)")`): tap the indicator to toggle. The panel does **not** float — it expands full-width **below the image** via `grid-template-rows: 0fr → 1fr` (500ms), with a hairline top, the crop at the image's aspect ratio, and the caption row beneath a hairline.

Raise the active cell to `z-index: 30` so its panel paints above neighbors.

### 2.8 Projects 02 & 03 — masonry

Implement with **CSS multi-column flow**, not CSS Grid. Grid cannot flow by height and leaves a hairline-colored hole in the final row whenever `imageCount % columnCount !== 0`.

```css
.masonry {
	column-count: 2;
	column-gap: 1px;
	background: var(--hair);
	border: 1px solid var(--hair);
	margin-top: 24px;
}
@media (min-width: 768px) {
	.masonry {
		column-count: 3;
	}
}
@media (min-width: 1200px) {
	.masonry {
		column-count: 4;
	}
}

.masonry-item {
	display: block;
	break-inside: avoid;
	-webkit-column-break-inside: avoid;
	page-break-inside: avoid;
	margin: 0 0 1px;
	background: var(--paper);
	position: relative;
}
.masonry-item img {
	display: block;
	width: 100%;
	height: auto;
}
```

Requirements:

- **`break-inside: avoid` is mandatory** — without it browsers slice images across columns.
- **`height: auto` on the image** — items keep their intrinsic ratio. This is what makes it masonry.
- **Do NOT** use `display: grid; grid-template-columns: repeat(auto-fill, minmax(...))`. That was the source of the visible hole in the earlier build.
- Corner ticks `size:10 inset:6`, top-left caption chip (`PLAN 02 / 05` + name), full Plate interaction per cell, staggered reveal 70ms per cell.
- If the CSS multi-column approach conflicts with a specific interaction, distribute items by shortest-column-first into N arrays and render N flex columns with `flex: 1 1 0` and `gap: 1px` over a `--hair` background. Do not fall back to Grid.

### 2.9 3D section — one per project

Wrapper `height: 250svh`, background bone, hairline top and bottom. Sticky stage: `top: 56px` (64px ≥768), `height: calc(100svh - 56px)` (minus 64px ≥768), `overflow: hidden`.

Progress:

```js
const rect = section.getBoundingClientRect();
const top = rect.top + window.scrollY;
const lock = section.offsetHeight - stage.offsetHeight;
const p = (window.scrollY - top) / lock;
rotationY = p * Math.PI * 2;
```

The sticky pinning **is** the scroll lock: the visual holds for one full 360° turn, then releases and keeps turning as the section leaves. Do not intercept wheel events unless explicitly asked; if you do, also handle touch, keyboard, an Escape hatch, and disable under reduced motion.

**Canvas.** `dpr={[1,2]}`, `alpha: true`, `frameloop="demand"` with `invalidate()` on change, camera `position [9, 6.5, 9] fov 30`.

**Lighting.** `ambientLight 0.85` + two directionals (`[4,8,3] 0.55`, `[-6,3,-4] 0.25`). No shadows, no HDRI.

**Materials.** Override whatever the `.glb` ships with:

```js
new THREE.MeshStandardMaterial({
	color: "#EFEFEF",
	roughness: 0.95,
	metalness: 0,
	flatShading: true,
});
```

Add `<Edges threshold={25} color="#0A0A0A" />` per mesh so it reads as a line drawing. Optionally tint one designated mesh's edges `#B85C38`.

**Normalization.** Center via `Box3`, scale to `4 / max(size)`, sit on the ground plane.

**Ground grid.** `gridHelper` at 8% ink opacity.

**Chrome.** Header row; side metadata (File / Software / Year / Project, ≥768 only); corner ticks `size:14 inset:0`; dashed indicator at `{x: 0.44, y: 0.46}` whose blowup is a second small `<Canvas>` sharing the rotation ref; right-side progress rail (128px / 192px ≥768) with an ink fill tracking progress, a live `000°–360°` readout, and a `LOCKED`/`RELEASED` label in vertical writing mode; bottom caption `SCROLL TO ROTATE — 360°`.

Write the degree readout, fill height, and lock label **directly to the DOM via refs** — never through React state.

Mount the canvas only within ~200px of the viewport. `useGLTF.preload` project 01 only.

### 2.10 Practice / Experience / Recognition / Skills / Contact / Footer

**Practice.** `.grid12` with the approach line (≤15 words) in cols 1–7 and the studio photograph (aspect `4/5`, `grayscale(0.45) contrast(1.03)`, corner ticks in white at 75%) in cols 9–12 with full Plate interaction. Facts row below a hairline: `FOUNDED 2018 · FOUR ARCHITECTS · OA Nº 27 481`.

**Experience & Recognition.** Same row structure. Left column year range (mono, 22% width desktop). Right column: role/title at 22/28px with firm/note as micro-label. Hover `transform: translateX(8px)` over 450ms. Stagger 60ms (experience) / 50ms (recognition).

**Skills.** Two rows. Label cols 1–2, tags cols 4–12 separated by 10px vertical hairlines.

**Contact.** Oversized email as `<a>` with animated underline. Three blocks (STUDIO / TELEPHONE / ELSEWHERE) in `.grid12`, staggered 0 / 60 / 120ms.

**Footer.** Single hairline top. Left: `JONAH DARRYL ESCOTO © 2026` in micro mute. Right: `EMAIL · LINKEDIN · INSTAGRAM · BEHANCE · TOP`, separated by 10px vertical hairlines.

---

## 3. MOTION

| Animation        | Trigger               | Duration         | Easing   |
| ---------------- | --------------------- | ---------------- | -------- |
| Scroll reveal    | IO enter, once        | 800ms            | `--ease` |
| Sweep rule       | IO enter, once        | 1100ms           | `--ease` |
| Link underline   | hover / focus-visible | 300ms            | `--ease` |
| Image opacity    | hover                 | 400ms            | `--ease` |
| Indicator spin   | always                | 11s (5s engaged) | linear   |
| Indicator scale  | hover / open          | 300ms            | `--ease` |
| Blowup panel     | hover / tap           | 300ms            | `--ease` |
| Mobile blowup    | tap                   | 500ms            | `--ease` |
| Reel expand      | hover / tap           | 400ms            | `--ease` |
| Reel dock fade   | IO band               | 500ms            | `--ease` |
| CV row shift     | hover                 | 450ms            | `--ease` |
| Nav bar bg       | `scrollY > 24`        | 500ms            | `--ease` |
| Mobile overlay   | tap                   | 500ms            | `--ease` |
| Hero scroll line | mount                 | 2.8s, infinite   | `--ease` |
| Cursor follow    | pointermove           | lerp 0.22/frame  | —        |
| Cursor expand    | over `[data-cursor]`  | 300ms            | `--ease` |
| Model rotation   | scroll                | lerp 0.12/frame  | —        |

Staggers: project metadata 0/80/140/200ms, masonry 70ms, experience 60ms, recognition 50ms, contact 0/60/120ms.

### 3.1 Reveal primitives

```css
.rv {
	opacity: 0;
	transform: translateY(20px);
	transition:
		opacity 800ms var(--ease),
		transform 800ms var(--ease);
}
.rv.in {
	opacity: 1;
	transform: none;
}

.sweep {
	transform: scaleX(0);
	transform-origin: left center;
	transition: transform 1100ms var(--ease);
}
.sweep.in {
	transform: scaleX(1);
}
```

### 3.2 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
	html {
		scroll-behavior: auto;
	}
	.rv,
	.sweep {
		opacity: 1 !important;
		transform: none !important;
		transition: none !important;
	}
	.scrollline,
	.dash-spin {
		animation: none;
	}
}
```

In JS: do not initialize Lenis; do not mount the custom cursor; set the model rotation lerp to `1`; keep all hover and tap interactions functional.

---

## 4. RESPONSIVE

Single breakpoint at 768px, plus 640px for two small details.

**Mobile (<768px):** two-line hero name; hamburger overlay with `13vw` links; hidden side rails, line grid, coordinates, scroll indicator, and 3D side metadata; stacked project openers; masonry at 2 columns; tap-to-toggle blowups render below the image; no custom cursor; 96px section padding.

**≥768px:** 40px gutters, inline nav, rails, 3–4 column masonry, floating blowups, 160px section padding.

Decide hover-vs-tap with `matchMedia("(hover: none)")`, not viewport width.

---

## 5. ACCESSIBILITY

- `:focus-visible { outline: 1px solid #0A0A0A; outline-offset: 3px }` globally — never removed.
- Real `<button>`s for indicators and reel items, with `aria-expanded`, `aria-current`, descriptive `aria-label`.
- Focusable snap tracks with Arrow-key support.
- Descriptive alt text on every drawing, authored in the data model — never empty, never a filename.
- `aria-hidden` on all decorative layers.
- Focus trapped in the mobile overlay, returned to the hamburger on close, `Escape` closes it.
- Honor `prefers-reduced-motion` throughout.

---

## 6. DATA MODEL

```ts
export type Focus = { x: number; y: number };

export interface ProjectImage {
	src: string;
	srcDetail?: string;
	alt: string; // real descriptive alt text — required
	caption: string; // ≤4 words
	focus: Focus; // 0.18–0.82 on both axes; avoid exact center
	detailLabel: string; // ≤2 words, e.g. "JOINT"
	detailScale: string; // "1:20"
	width: number;
	height: number;
}

export interface Category {
	id: string;
	index: string; // "01"
	kind: "plans" | "elevations" | "views";
	name: string; // "Floor Plans"
	ratio: "4/5" | "3/2" | "16/9" | "25/17";
	captionStem: string; // "PLAN" | "ELEVATION" | "VIEW"
	images: ProjectImage[]; // 4–6
}

export interface ProjectModel {
	src: string;
	fileLabel: string;
	software: string;
	year: string;
	focus: Focus;
	detailLabel: string;
	detailScale: string;
	accentMesh?: string;
}

export interface Project {
	id: string;
	num: string;
	title: string;
	tags: string[];
	meta: string; // "2023 — Lisbon, PT — Built"
	brief: string; // ≤10 words
	layout: "fullscreen" | "masonry";
	mirrored?: boolean;
	opener: ProjectImage;
	categories: [Category, Category, Category];
	model: ProjectModel;
}

export interface ExperienceEntry {
	years: string;
	role: string;
	firm: string;
}
export interface RecognitionEntry {
	year: string;
	title: string;
	note: string;
}
export interface SkillGroup {
	label: string;
	items: string[];
}

export interface SiteConfig {
	name: string;
	role: string;
	discipline: string;
	established: string;
	coordinates: string;
	statement: string;
	practiceLine: string;
	practiceFacts: string[];
	studioImage: ProjectImage;
	email: string;
	phone: string;
	address: string[];
	socials: { label: string; href: string }[];
	nav: { label: string; href: string }[];
}
```

---

## 7. HARD CONSTRAINTS

- Zero border radius, enforced globally with `!important`.
- Zero shadows.
- Zero gradients except the dot-grid and line-grid textures.
- No blue tones of any kind.
- No font weight above 400.
- No hover zoom on images — opacity `1 → 0.92` only.
- No carousels with dots
