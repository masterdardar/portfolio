import { useEffect, useLayoutEffect, useRef } from "react";

const CYCLE_MS = 16000;

/**
 * Ambient drafting-sheet linework for the hero corner. Fixed composition,
 * strokes measured once on mount, drawn sequentially with CSS; a single
 * timeout restarts the 16s cycle (no frame loop).
 */
function HeroBlueprint() {
	const svgRef = useRef<SVGSVGElement>(null);
	const timer = useRef(0);

	useLayoutEffect(() => {
		const svg = svgRef.current;
		if (!svg) return;
		// Measure each stroke once and cache its length for the draw animation.
		svg.querySelectorAll<SVGGeometryElement>(".bp-stroke").forEach((el) => {
			el.style.setProperty("--len", String(el.getTotalLength()));
		});
		svg.classList.add("is-ready", "bp-play");
		const loop = () => {
			svg.classList.remove("bp-play");
			void svg.getBoundingClientRect(); // restart CSS animations
			svg.classList.add("bp-play");
			timer.current = window.setTimeout(loop, CYCLE_MS);
		};
		timer.current = window.setTimeout(loop, CYCLE_MS);
		return () => window.clearTimeout(timer.current);
	}, []);

	// Freeze the loop while the hero is off-screen.
	useEffect(() => {
		const svg = svgRef.current;
		if (!svg) return;
		const obs = new IntersectionObserver(([entry]) => {
			svg.classList.toggle("is-paused", !entry.isIntersecting);
		});
		obs.observe(svg);
		return () => obs.disconnect();
	}, []);

	return (
		<svg
			ref={svgRef}
			className="hero-art hero-blueprint"
			viewBox="0 0 600 760"
			aria-hidden="true"
			focusable="false"
		>
			<g className="bp-drawing">
				{/* datum + grid bubbles */}
				<path className="bp-stroke" style={{ "--i": 0 } as React.CSSProperties} d="M40,64 H400" />
				<circle className="bp-stroke" style={{ "--i": 1 } as React.CSSProperties} cx="40" cy="64" r="13" />
				<circle className="bp-stroke" style={{ "--i": 2 } as React.CSSProperties} cx="400" cy="64" r="13" />
				{/* plan — outer wall + courtyard */}
				<path className="bp-stroke" style={{ "--i": 3 } as React.CSSProperties} d="M110,110 H390 V300 H110 Z" />
				<path className="bp-stroke" style={{ "--i": 4 } as React.CSSProperties} d="M210,160 H300 V250 H210 Z" />
				{/* plan — partitions */}
				<path
					className="bp-stroke"
					style={{ "--i": 5 } as React.CSSProperties}
					d="M320,110 V185 M320,245 V300 M110,225 H205"
				/>
				{/* plan — door leaf + swing */}
				<path
					className="bp-stroke"
					style={{ "--i": 6 } as React.CSSProperties}
					d="M320,150 V190 A40,40 0 0 1 360,230"
				/>
				{/* plan — window openings */}
				<path
					className="bp-stroke"
					style={{ "--i": 7 } as React.CSSProperties}
					d="M150,106 H210 M150,114 H210"
				/>
				<path
					className="bp-stroke"
					style={{ "--i": 8 } as React.CSSProperties}
					d="M210,246 H260 M210,254 H260"
				/>
				{/* dimensions */}
				<path
					className="bp-stroke"
					style={{ "--i": 9 } as React.CSSProperties}
					d="M110,92 H390 M110,86 V98 M390,86 V98"
				/>
				<path
					className="bp-stroke"
					style={{ "--i": 10 } as React.CSSProperties}
					d="M408,110 V300 M402,110 H414 M402,300 H414"
				/>
				{/* elevation — ground + section ticks */}
				<path
					className="bp-stroke"
					style={{ "--i": 11 } as React.CSSProperties}
					d="M60,520 H440 M100,520 l-8,10 M220,520 l-8,10 M340,520 l-8,10"
				/>
				{/* elevation — volume + parapet */}
				<path
					className="bp-stroke"
					style={{ "--i": 12 } as React.CSSProperties}
					d="M120,520 V420 H330 V520"
				/>
				<path className="bp-stroke" style={{ "--i": 13 } as React.CSSProperties} d="M112,412 H338" />
				{/* elevation — door + window openings */}
				<path
					className="bp-stroke"
					style={{ "--i": 14 } as React.CSSProperties}
					d="M160,520 V460 H200 V520 M240,450 H300 V490 H240 Z"
				/>
				{/* elevation — datum marker */}
				<path
					className="bp-stroke"
					style={{ "--i": 15 } as React.CSSProperties}
					d="M440,505 H470 M455,505 L462,520 L448,520 Z"
				/>
				{/* north arrow */}
				<path
					className="bp-stroke"
					style={{ "--i": 16 } as React.CSSProperties}
					d="M468,620 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0 M480,632 V608 M474,616 L480,608 L486,616"
				/>
			</g>
		</svg>
	);
}

export default HeroBlueprint;
