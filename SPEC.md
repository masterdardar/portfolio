# Jonah Darryl Escoto — Architecture Portfolio

## Complete Build Specification

---

## 1. Project Overview

A single-page architectural portfolio for a professional architect. Static site, no backend. Minimalist, editorial, drafting-sheet aesthetic. Three projects, each with floor plans, elevations, and 3D views (4–6 images per category). Serves as both portfolio and digital CV.

**Core principles:**

- Minimal words — headings, tags, micro-labels only
- White background, thin hairlines, generous whitespace
- Asymmetric editorial layouts, never a plain gallery
- Motion is functional and restrained
- Every element earns its place
- Real images and real `.glb` files — no procedural content

---

## 2. Tech Stack

```
Framework:    React 19 + TypeScript
Build:        Vite
Styling:      Pure CSS (CSS variables + per-component CSS files)
3D:           three + @react-three/fiber + @react-three/drei
Scroll:       Lenis + native CSS scroll-snap
Reveals:      IntersectionObserver (custom hook)
Cursor:       Custom trailing cursor
```

**Forbidden:** Tailwind, styled-components, CSS modules, Bootstrap, Material UI, Chakra, Framer Motion, GSAP, or any animation library beyond Lenis.

**Install:**

```bash
npm create vite@latest architecture-portfolio -- --template react-ts
cd architecture-portfolio
npm install three @react-three/fiber @react-three/drei lenis
```

---

## 3. File Structure

```
src/
  App.tsx
  main.tsx
  styles/
    variables.css
    global.css
  hooks/
    useInView.ts
    useScrollLock.ts
    useLenis.ts
    useCursor.ts
  components/
    Navigation/
      Navigation.tsx
      Navigation.css
    Hero/
      Hero.tsx
      Hero.css
    PracticeStatement/
      PracticeStatement.tsx
      PracticeStatement.css
    SelectedWork/
      SelectedWork.tsx
      Project01.tsx
      Project02.tsx
      Project03.tsx
      SelectedWork.css
    HorizontalGallery/
      HorizontalGallery.tsx
      ReelNavigation.tsx
      HorizontalGallery.css
    StripGallery/
      StripGallery.tsx
      StripGallery.css
    AccordionGallery/
      AccordionGallery.tsx
      AccordionGallery.css
    ImageWithDetail/
      ImageWithDetail.tsx
      ImageWithDetail.css
    Model3D/
      Model3D.tsx
      Model3D.css
    Annotation/
      Annotation.tsx
      Annotation.css
    Practice/
      Practice.tsx
      Practice.css
    Experience/
      Experience.tsx
      Experience.css
    Recognition/
      Recognition.tsx
      Recognition.css
    Skills/
      Skills.tsx
      Skills.css
    Contact/
      Contact.tsx
      Contact.css
    Footer/
      Footer.tsx
      Footer.css
    Cursor/
      Cursor.tsx
      Cursor.css
  data/
    projects.ts
  assets/
    images/
      project-01/
      project-02/
      project-03/
public/
  models/
    project-01.glb
    project-02.glb
    project-03.glb
```

---

## 4. Design System

### 4.1 CSS Variables (`variables.css`)

```css
:root {
	--bg: #fafafa;
	--fg: #0a0a0a;
	--muted: #8a8a8a;
	--line: rgba(10, 10, 10, 0.08);
	--line-strong: rgba(10, 10, 10, 0.2);
	--accent: #b85c38;

	--font-heading: "Söhne", "Neue Haas Grotesk", "Inter Tight", system-ui, sans-serif;
	--font-body: "Inter", system-ui, sans-serif;
	--font-mono: "IBM Plex Mono", ui-monospace, monospace;

	--space-1: 8px;
	--space-2: 16px;
	--space-3: 24px;
	--space-4: 32px;
	--space-5: 48px;
	--space-6: 64px;
	--space-7: 96px;
	--space-8: 128px;
	--space-9: 192px;

	--max-width: 1440px;
	--ease: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 4.2 Base Styles (`global.css`)

```css
* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

html {
	scroll-behavior: smooth;
}

body {
	background: var(--bg);
	color: var(--fg);
	font-family: var(--font-body);
	font-weight: 300;
	line-height: 1.6;
	-webkit-font-smoothing: antialiased;
	cursor: none;
}

h1,
h2,
h3 {
	font-family: var(--font-heading);
	font-weight: 300;
	letter-spacing: -0.03em;
	line-height: 0.95;
}

h1 {
	font-size: clamp(3rem, 10vw, 8rem);
}
h2 {
	font-size: clamp(2rem, 5vw, 4rem);
}
h3 {
	font-size: clamp(1.5rem, 3vw, 2.5rem);
}

.micro {
	font-family: var(--font-mono);
	font-size: 10px;
	text-transform: uppercase;
	letter-spacing: 0.15em;
	color: var(--muted);
}

.container {
	max-width: var(--max-width);
	margin: 0 auto;
	padding: 0 var(--space-4);
}

.rule {
	height: 1px;
	background: var(--line);
	border: none;
}

.dot-grid {
	background-image: radial-gradient(var(--line) 1px, transparent 1px);
	background-size: 24px 24px;
}

@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.001ms !important;
		transition-duration: 0.001ms !important;
		scroll-behavior: auto !important;
	}
}
```

### 4.3 Typography Rules

- Headings: weight 300, tracking `-0.03em`, line-height 0.95
- Body: weight 300, line-height 1.6
- Micro-labels: 10px mono, uppercase, tracking `0.15em`, muted color
- Extreme size contrast — `8rem` headings next to `10px` labels
- Never use bold weights above 500

### 4.4 Visual Rules

- No border radius anywhere (`border-radius: 0`)
- No box shadows
- No gradients (except subtle dot/line grids)
- No blue tones
- Terracotta `#B85C38` only for small accents (indicators, active states)
- Hairlines everywhere: `1px` at `rgba(10,10,10,0.08)` or `0.2`
- Grid dividers via `gap: 1px` over a hairline background

---

## 5. Data Model

`src/data/projects.ts`:

```ts
export type ProjectImage = {
	src: string;
	caption: string; // max 4 words, e.g. "LEVEL 02 — 1:100"
	focusX: number; // 0–1, position of dashed circle
	focusY: number; // 0–1
	detailLabel: string; // e.g. "DETAIL A — 1:20"
};

export type Project = {
	id: string;
	number: string; // "01"
	title: string;
	tags: string[]; // 3–4 max
	meta: string; // "2024 — LISBON — BUILT"
	heroSrc: string;
	model3D: string; // "/models/project-01.glb"
	layout: "gallery" | "strips" | "accordion";
	categories: {
		plans: ProjectImage[];
		elevations: ProjectImage[];
		views3D: ProjectImage[];
	};
};

export const projects: Project[] = [
	/* ... */
];
```

---

## 6. Component Specifications

### 6.1 Navigation

- Fixed top bar, height 64px
- Studio name left: **Jonah Darryl Escoto**
- Links right: `Work · Practice · CV · Contact`
- 1px bottom border (`var(--line)`)
- Transparent background
- On scroll past 100px: `backdrop-filter: blur(8px)` + subtle bg tint
- Mobile (<768px): hamburger toggles full-screen overlay
    - Overlay: white bg, centered links, huge type (`h2` size), hairline dividers between
    - Close button top-right
    - Body scroll locked while open

### 6.2 Hero

- Full viewport height (`100vh` / `100svh`)
- Dot grid background (`.dot-grid`)
- Thin line grid overlay (1px lines at 25% / 50% / 75% horizontal, 33% / 66% vertical)
- Crosshair marks `+` at grid intersections (2px lines, `--line-strong`)
- Vertical side rails (1px, full height, at `container` edges, desktop only)
- Name **Jonah Darryl Escoto** in `h1` (~11.5vw), bottom-left
- Hairline rule below
- Bottom-right: `Principal Architect` and `Architecture — [Location]` in `.micro`, separated by hairline
- Animated vertical scroll indicator: 1px line, `scaleY` loop 2s ease-in-out
- Vertical annotation: thin line extending down from name to `EST. [YEAR]` label, draws on mount (400ms), label fades in after 200ms delay

### 6.3 Practice Statement

- `padding: var(--space-9) 0`
- Single sentence, max 20 words, `h2` size
- Offset alignment (not centered) for asymmetry
- Hairline rules above and below, full `container` width

### 6.4 Selected Work — Structure

Renders three project blocks sequentially. Each block uses the layout declared in its `Project` data.

**Shared project block anatomy:**

- Project number (`01`, `02`, `03`) in `.micro`
- Title in `h2`
- Tags in `.micro`, separated by thin vertical dividers `|`
- Metadata line in `.micro` (`2024 — [LOCATION] — BUILT`)
- Category sections: `Plans`, `Elevations`, `3D Views`
- Each category preceded by a thin header row: `01 — FLOOR PLANS — 06 IMAGES`
- Next project link at bottom: thin arrow `→` + `Next Project` in `.micro`

### 6.5 Project 01 — Gallery Layout

Three sequential full-screen horizontal snap galleries, one per category.

**`<HorizontalGallery>` component:**

- Container: `width: 100vw; height: 100vh; overflow-x: auto; overflow-y: hidden;`
- `scroll-snap-type: x mandatory;`
- `-webkit-overflow-scrolling: touch;`
- Hide scrollbar: `scrollbar-width: none; &::-webkit-scrollbar { display: none; }`
- Horizontal scroll is not forced — vertical scroll continues normally
- Each image: `width: 100vw; height: 100vh; flex-shrink: 0; scroll-snap-align: start;`
- Image: `object-fit: cover;`
- Caption bottom-left in `.micro`: `PLAN 01 / 06`
- Hairline above caption
- Corner ticks on image (L-shaped, 8px, via `::before` / `::after`)
- Active index tracked via scroll listener (debounced 50ms)
- Clicking reel item scrolls: `container.scrollTo({ left: i * container.clientWidth, behavior: 'smooth' })`

**`<ReelNavigation>` component:**

- Fixed to bottom of viewport while parent section is in view
- Default state (out of focus): collapsed to thin vertical lines
    - Each item: `1px wide × 40px tall`, `var(--line-strong)`
    - Spaced 12px apart
    - Active item: full `--fg`, 48px tall
- Hover state: expands over 400ms
    - Thumbnail previews: `80px × 60px`
    - Active thumbnail: 1px border `--fg`, full opacity
    - Others: 60% opacity, 1px border `--line`
    - Gap: 8px
- Click: scrolls gallery to that index
- Fades out when parent section is out of view

**Category header row (above each gallery):**

```
01 — FLOOR PLANS ─────────────────────── 06 DRAWINGS
```

Micro-label left, hairline rule filling middle, micro-label right.

### 6.6 Project 02 — Strips Layout

All three categories presented as full-bleed snap strips.

**`<StripGallery>` component:**

- Container: `width: 100%; height: 70vh; overflow-x: auto; scroll-snap-type: x mandatory;`
- Each image: `width: 80vw; height: 100%; flex-shrink: 0; scroll-snap-align: center;`
- Gap between images: `1px` over hairline background
- Corner ticks on each image
- Caption bottom-left in `.micro`
- Counter bottom-right: `ELEVATION 03 / 05`
- No reel navigation on this layout

**Category sections stack vertically** with generous whitespace between (`var(--space-8)`).

### 6.7 Project 03 — Accordion Layout

One category open at a time, 2-column reveal.

**`<AccordionGallery>` component:**

- Three rows, collapsed by default:
    - Row: `FLOOR PLANS (06)` left, `+` right
    - `padding: var(--space-4) 0`
    - 1px bottom border `var(--line)`
    - Hover: `padding-left: 8px` transition 400ms
- On click: row expands, `+` rotates to `×`
- Expanded content: 2-column grid
    - `display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line);`
    - Each image: `background: var(--bg); aspect-ratio: 4/5` (plans) or `3/2` (elevations) or `16/9` (3D)
    - Corner ticks
    - Micro-label caption top-left
- Only one open at a time — opening another closes the current
- Expand animation: `max-height` + opacity, 500ms `var(--ease)`

### 6.8 ImageWithDetail — Used on Every Image

Wraps every image across all sections and projects.

**Structure:**

```tsx
<div className="img-detail">
	<img src={src} alt={caption} loading="lazy" />
	<button className="img-detail__indicator" aria-label="View detail" />
	{open && (
		<div className="img-detail__blowup">
			<div className="img-detail__blowup-image" />
			<span className="micro">{detailLabel}</span>
		</div>
	)}
</div>
```

**Indicator:**

- Absolutely positioned at `left: focusX * 100%; top: focusY * 100%;`
- `width: 56px; height: 56px;`
- `border: 1px dashed var(--line-strong); border-radius: 50%;`
- `transform: translate(-50%, -50%);`
- Animation: `@keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }` at `10s linear infinite`
- Center dot: `2px × 2px`, `var(--fg)`, absolutely centered
- On hover: `transform: translate(-50%, -50%) scale(1.1); animation-duration: 5s;`
- On hover: `border-color: var(--accent);`

**Blowup panel:**

- Appears on indicator hover
- Position: offset 24px from indicator, direction depends on space (default: right)
- Size: `240px × 240px`
- `border: 1px solid var(--line-strong);`
- Corner ticks
- Background image: same `src`, with:
    - `background-size: 300%;` (3× zoom)
    - `background-position: calc(focusX * 100%) calc(focusY * 100%);`
- Micro-label caption below in `.micro`
- Thin connector line from indicator to panel (1px, `var(--line-strong)`)
- Transition: `opacity 300ms var(--ease), transform 300ms var(--ease);`
- Initial: `opacity: 0; transform: scale(0.95);`
- Open: `opacity: 1; transform: scale(1);`

**Mobile (<768px):**

- Hover replaced with tap
- Blowup renders as full-width panel below the image
- Panel: `width: 100%; aspect-ratio: 1;`
- No connector line
- Tap again to dismiss

### 6.9 Model3D — Per Project

Real `.glb` file rendered with R3F. One per project.

**Structure:**

```tsx
<section className="model-3d" ref={sectionRef}>
	<div className="model-3d__canvas">
		<Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
			<ambientLight intensity={0.9} />
			<directionalLight position={[5, 5, 5]} intensity={0.5} />
			<Suspense fallback={null}>
				<Center>
					<RotatingModel src={model3D} progress={progress} />
				</Center>
			</Suspense>
		</Canvas>
	</div>
	<div className="model-3d__progress" style={{ "--p": progress }} />
	<span className="micro model-3d__caption">SCROLL TO ROTATE — 360°</span>
</section>
```

**`RotatingModel` component:**

```tsx
function RotatingModel({ src, progress }: { src: string; progress: number }) {
	const { scene } = useGLTF(src);
	useFrame(() => {
		scene.rotation.y = progress * Math.PI * 2;
	});
	return <primitive object={scene} />;
}
```

**Scroll lock behavior:**

- When section enters viewport (threshold 0.5), lock page scroll
- Intercept `wheel` and `touchmove` events on the section
- Accumulate delta into `progress` (0 → 1) over ~1500px of scroll input
- `preventDefault()` while `progress < 1`
- `progress` maps to `rotation.y` from `0` to `2π`
- When `progress >= 1`, release lock
- After release, rotation continues with scroll (no second lock)
- Reduced motion: skip lock, allow free scroll, no rotation animation

**Progress indicator:**

- Fixed to right side of viewport while section is in view
- Vertical line, `1px × 200px`, `var(--line)`
- Filled portion: `1px × (200px * progress)`, `var(--fg)`
- Label above: `0°` to `360°` in `.micro`

**Caption:**

- Below canvas, centered
- `SCROLL TO ROTATE — 360°` in `.micro`

**Loading fallback:**

- Thin horizontal line, `1px`, animating `scaleX` 0 → 1 → 0, 1.5s loop
- Centered in canvas area

### 6.10 Annotations

Thin lines with labels that draw on scroll into view.

**Structure:**

```tsx
<div className={`annotation annotation--${direction} ${inView ? "is-visible" : ""}`}>
	<span className="annotation__dot" />
	<span className="annotation__line" />
	<span className="annotation__label micro">{label}</span>
</div>
```

**Styles:**

```css
.annotation {
	display: flex;
	align-items: center;
	gap: 8px;
}

.annotation__dot {
	width: 3px;
	height: 3px;
	border-radius: 50%;
	background: var(--fg);
	flex-shrink: 0;
}

.annotation__line {
	height: 1px;
	background: var(--line-strong);
	transform-origin: left center;
	transform: scaleX(0);
	transition: transform 400ms var(--ease);
}

.annotation__label {
	opacity: 0;
	transform: translateX(-4px);
	transition:
		opacity 300ms ease 200ms,
		transform 300ms ease 200ms;
	white-space: nowrap;
}

.annotation.is-visible .annotation__line {
	transform: scaleX(1);
}
.annotation.is-visible .annotation__label {
	opacity: 1;
	transform: translateX(0);
}

.annotation--vertical {
	flex-direction: column;
	align-items: flex-start;
}
.annotation--vertical .annotation__line {
	width: 1px;
	height: 48px;
	transform-origin: top center;
	transform: scaleY(0);
}
.annotation--vertical.is-visible .annotation__line {
	transform: scaleY(1);
}

.annotation--short .annotation__line {
	width: 40px;
}
.annotation--medium .annotation__line {
	width: 64px;
}
.annotation--long .annotation__line {
	width: 96px;
}
```

**Placements:**

- Hero: vertical, label `EST. [YEAR]`
- Project headers: horizontal, label = metadata
- 3D section: horizontal, label `SCROLL TO ROTATE`
- Contact: horizontal, label `AVAILABLE FOR COMMISSIONS`

**Behavior:**

- Trigger via `useInView` hook (threshold 0.2)
- One-time reveal — do not reverse on scroll out
- Reduced motion: show fully drawn, no animation
- Stagger multiple annotations in same section by 100ms

### 6.11 Practice Section

- One line, max 15 words, `h2`
- Portrait or studio image to the side with corner ticks
- Image: `aspect-ratio: 4/5; object-fit: cover;`
- Hairline rules above and below
- Vertical annotation beside image: `PRINCIPAL ARCHITECT`

### 6.12 Experience Section

- Vertical list, hairline dividers between rows
- Each row:
    - Left: year range in `.micro` mono
    - Right: role + firm in body text
- Row padding: `var(--space-3) 0`
- Hover: `padding-left: 8px`, transition 400ms `var(--ease)`
- No descriptions

### 6.13 Recognition Section

- Same row format as Experience
- Left: year in `.micro`
- Right: award / publication / exhibition

### 6.14 Skills Section

- Tag cloud in `.micro`
- Separated by thin vertical dividers `|` or dots `·`
- Two categories:
    - **Software:** Rhino, Revit, Grasshopper, AutoCAD, Adobe CC, Blender, Enscape
    - **Skills:** Parametric Design, Technical Drawing, Rendering, Construction Documentation, Model Making, Site Analysis
- Category label above each in `.micro` with hairline rule

### 6.15 Contact Section

- Oversized email address, `h2` size (`clamp(2rem, 6vw, 5rem)`)
- 1px underline below, animates `scaleX` 0 → 1 on hover, 300ms
- Studio address + phone in `.micro` below
- Horizontal annotation from email to `AVAILABLE FOR COMMISSIONS`
- Social links: LinkedIn · Instagram · Behance
    - In `.micro`
    - Separated by hairline vertical dividers
    - Hover: 1px underline draws left-to-right

### 6.16 Footer

- Single hairline rule above
- Left: `Jonah Darryl Escoto — [YEAR]` in `.micro`
- Right: email + social links in `.micro`
- Padding: `var(--space-5) 0`

### 6.17 Custom Cursor

- 12px circle, 1px border `var(--fg)`, transparent fill
- Follows mouse with slight lerp (0.15 easing)
- On hover over interactive elements (links, indicators, buttons): scales to 1.5×, `border-color: var(--accent)`
- Hidden on touch devices (`@media (hover: none)`)
- Disabled when `prefers-reduced-motion` — fall back to default cursor
- Body has `cursor: none` on desktop

---

## 7. Hooks

### 7.1 `useInView`

```ts
function useInView<T extends HTMLElement>(threshold = 0.2) {
	const ref = useRef<T>(null);
	const [inView, setInView] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setInView(true);
			},
			{ threshold },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, [threshold]);
	return { ref, inView };
}
```

### 7.2 `useScrollLock`

```ts
function useScrollLock(ref: React.RefObject<HTMLElement>, options: { distance?: number; onComplete?: () => void } = {}) {
	const { distance = 1500, onComplete } = options;
	const [progress, setProgress] = useState(0);
	const [locked, setLocked] = useState(false);
	const accumulated = useRef(0);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !locked && progress < 1) {
					setLocked(true);
					accumulated.current = progress * distance;
				} else if (!entry.isIntersecting) {
					setLocked(false);
				}
			},
			{ threshold: 0.5 },
		);
		obs.observe(el);

		const handleWheel = (e: WheelEvent) => {
			if (!locked) return;
			if (progress >= 1) return;
			e.preventDefault();
			accumulated.current += e.deltaY;
			const next = Math.max(0, Math.min(1, accumulated.current / distance));
			setProgress(next);
			if (next >= 1) {
				setLocked(false);
				onComplete?.();
			}
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (!locked || progress >= 1) return;
			e.preventDefault();
		};

		el.addEventListener("wheel", handleWheel, { passive: false });
		el.addEventListener("touchmove", handleTouchMove, { passive: false });
		return () => {
			obs.disconnect();
			el.removeEventListener("wheel", handleWheel);
			el.removeEventListener("touchmove", handleTouchMove);
		};
	}, [locked, progress, distance, ref, onComplete]);

	return { progress, locked };
}
```

### 7.3 `useLenis`

```ts
function useLenis() {
	useEffect(() => {
		const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}
		const id = requestAnimationFrame(raf);
		return () => {
			cancelAnimationFrame(id);
			lenis.destroy();
		};
	}, []);
}
```

### 7.4 `useCursor`

Tracks mouse position and hover state. Returns position and scale for the `<Cursor>` component.

---

## 8. Animations & Motion Summary

| Element              | Behavior                    | Duration            | Easing      |
| -------------------- | --------------------------- | ------------------- | ----------- |
| Section reveal       | Fade + translateY(20px → 0) | 800ms               | ease-out    |
| Image hover          | Opacity 100% → 92%          | 300ms               | var(--ease) |
| Link hover           | 1px underline scaleX 0 → 1  | 300ms               | var(--ease) |
| Experience row hover | padding-left 0 → 8px        | 400ms               | var(--ease) |
| Annotation line      | scaleX 0 → 1                | 400ms               | var(--ease) |
| Annotation label     | Fade + translateX(-4px → 0) | 300ms, 200ms delay  | ease        |
| Dashed circle        | Continuous rotate           | 10s linear infinite | —           |
| Dashed circle hover  | scale(1.1), rotate 5s       | 300ms               | var(--ease) |
| Blowup panel         | Fade + scale(0.95 → 1)      | 300ms               | var(--ease) |
| Reel expand          | Height + thumb fade         | 400ms               | var(--ease) |
| Accordion expand     | max-height + opacity        | 500ms               | var(--ease) |
| Scroll snap          | Native CSS                  | —                   | —           |

All animations respect `prefers-reduced-motion`.

---

## 9. Responsive Rules

**Breakpoints:**

- Mobile: `< 768px`
- Tablet: `768px – 1024px`
- Desktop: `> 1024px`

**Mobile adjustments:**

- Nav becomes full-screen overlay
- Project 01 galleries remain full-screen (`100vw × 100svh`), touch scroll with snap
- Reel navigation collapsed by default, expands on tap
- Project 02 strips: image width `90vw` instead of `80vw`
- Project 03 accordion: 1 column instead of 2
- Image detail: tap toggles blowup as full-width panel below image
- 3D section: scroll lock still applies, but progress maps over `800px` of input
- 3D canvas `dpr: [1, 1.5]`
- Custom cursor disabled
- Typography scales down via `clamp()`
- Side rails hidden

---

## 10. Accessibility

- All images have descriptive `alt` (use caption text)
- Indicator buttons have `aria-label="View detail"`
- Focus states: 1px outline `var(--fg)`, offset 2px
- Contrast: body text meets 4.5:1 minimum
- `prefers-reduced-motion`: disable scroll lock, spin, reveals — show all content statically
- Keyboard navigation: all interactive elements reachable via Tab
- Reel navigation: arrow keys move between items
- Accordion: Enter/Space toggles, arrow keys navigate

---
