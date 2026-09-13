import { useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";

const CYCLE_MS = 5000;

/**
 * Drafting-themed loading mark: a small massing study that draws itself
 * stroke by stroke, plus a static micro-label. Strokes measured once on
 * mount; a single timeout restarts the 5s cycle (no frame loop).
 */
function ModelLoader({ done }: { done: boolean }) {
	const svgRef = useRef<SVGSVGElement>(null);
	const timer = useRef(0);

	useLayoutEffect(() => {
		const svg = svgRef.current;
		if (!svg) return;
		// Measure each stroke once and cache its length for the draw animation.
		svg.querySelectorAll<SVGGeometryElement>(".ml-stroke").forEach((el) => {
			el.style.setProperty("--len", String(el.getTotalLength()));
		});
		svg.classList.add("is-ready", "ml-play");
		const loop = () => {
			svg.classList.remove("ml-play");
			void svg.getBoundingClientRect(); // restart CSS animations
			svg.classList.add("ml-play");
			timer.current = window.setTimeout(loop, CYCLE_MS);
		};
		timer.current = window.setTimeout(loop, CYCLE_MS);
		return () => window.clearTimeout(timer.current);
	}, []);

	// Freeze the loop while the viewport is off-screen.
	useEffect(() => {
		const svg = svgRef.current;
		const root = svg?.closest(".model3d__loader");
		if (!svg || !root) return;
		const obs = new IntersectionObserver(([entry]) => {
			root.classList.toggle("is-paused", !entry.isIntersecting);
		});
		obs.observe(svg);
		return () => obs.disconnect();
	}, []);

	return (
		<div
			className={`model3d__loader${done ? " is-done" : ""}`}
			role="status"
			aria-label="Loading 3D model"
		>
			<svg ref={svgRef} className="ml-drawing" viewBox="0 0 120 104" aria-hidden="true" focusable="false">
				<g className="ml-cycle">
					{/* ground */}
					<path className="ml-stroke" style={{ "--i": 0 } as CSSProperties} d="M10,86 H110" />
					{/* massing front face */}
					<path className="ml-stroke" style={{ "--i": 1 } as CSSProperties} d="M34,86 V54 H78 V86" />
					{/* roof depth */}
					<path className="ml-stroke" style={{ "--i": 2 } as CSSProperties} d="M34,54 L48,44 H92 L78,54" />
					{/* back edge */}
					<path className="ml-stroke" style={{ "--i": 3 } as CSSProperties} d="M92,44 V76" />
					{/* floor plate */}
					<path className="ml-stroke" style={{ "--i": 4 } as CSSProperties} d="M28,70 H84" />
					{/* door opening */}
					<path className="ml-stroke" style={{ "--i": 5 } as CSSProperties} d="M44,86 V72 H56 V86" />
					{/* dimension line */}
					<path
						className="ml-stroke"
						style={{ "--i": 6 } as CSSProperties}
						d="M34,36 H78 M34,32 V40 M78,32 V40"
					/>
					{/* section mark */}
					<path
						className="ml-stroke"
						style={{ "--i": 7 } as CSSProperties}
						d="M99,64 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0 M100,52 L106,64"
					/>
				</g>
			</svg>
			<p className="micro ml-label">
				DRAFTING MODEL
				<span className="ml-dots" aria-hidden="true">
					<i />
					<i />
					<i />
				</span>
			</p>
		</div>
	);
}

export default ModelLoader;
