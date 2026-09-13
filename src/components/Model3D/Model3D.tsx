import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Project } from "../../data/projects";
import { normalizeModel } from "../../lib/modelNormalize";
import { platePanel } from "../../lib/plateGeometry";
import { PoiButton } from "../ImageWithDetail/ImageWithDetail";
import Ticks from "../Ticks/Ticks";

type Bus = { current: Set<() => void> };

function RotationRig({
	model,
	rotationRef,
	reduced,
	bus,
}: {
	model: THREE.Object3D;
	rotationRef: { current: number };
	reduced: boolean;
	bus: Bus;
}) {
	const fit = useRef<THREE.Group>(null);
	const spin = useRef<THREE.Group>(null);
	const cur = useRef(0);
	const invalidate = useThree((s) => s.invalidate);

	useEffect(() => {
		const set = bus.current;
		set.add(invalidate);
		invalidate();
		return () => {
			set.delete(invalidate);
		};
	}, [bus, invalidate]);

	useFrame((state) => {
		/* Fit the massing inside the viewport: largest dimension (with
		   rotation headroom) targets ~72% of the smaller viewport
		   dimension, ~65% under 380px. Desktop keeps full size. */
		const { size, camera } = state;
		const persp = camera as THREE.PerspectiveCamera;
		const dist = camera.position.length();
		const vH = 2 * dist * Math.tan(THREE.MathUtils.degToRad(persp.fov / 2));
		const vW = vH * (size.width / Math.max(1, size.height));
		const frac = size.width < 380 ? 0.65 : 0.72;
		const s = Math.min(1, (frac * Math.min(vH, vW)) / (4 * 1.35));
		if (fit.current) fit.current.scale.setScalar(s);

		const target = rotationRef.current;
		cur.current += (target - cur.current) * (reduced ? 1 : 0.12);
		if (spin.current) spin.current.rotation.y = cur.current;
		if (Math.abs(target - cur.current) > 0.0004) state.invalidate();
	});

	return (
		<group ref={fit}>
			<group ref={spin}>
				<primitive object={model} />
			</group>
		</group>
	);
}

function ModelContent({
	src,
	rotationRef,
	reduced,
	bus,
	grid = true,
}: {
	src: string;
	rotationRef: { current: number };
	reduced: boolean;
	bus: Bus;
	grid?: boolean;
}) {
	const { scene } = useGLTF(src);
	const model = useMemo(() => normalizeModel(scene), [scene]);
	return (
		<>
			<ambientLight intensity={0.85} />
			<directionalLight position={[4, 8, 3]} intensity={0.55} />
			<directionalLight position={[-6, 3, -4]} intensity={0.25} />
			{grid && (
				<gridHelper
					args={[12, 24, "#0a0a0a", "#0a0a0a"]}
					material-transparent={true}
					material-opacity={0.08}
				/>
			)}
			<RotationRig model={model} rotationRef={rotationRef} reduced={reduced} bus={bus} />
		</>
	);
}

function DetailCanvas({
	src,
	rotationRef,
	reduced,
	bus,
}: {
	src: string;
	rotationRef: { current: number };
	reduced: boolean;
	bus: Bus;
}) {
	return (
		<Canvas
			frameloop="demand"
			dpr={[1, 1.5]}
			gl={{ alpha: true, antialias: true }}
			camera={{ position: [9, 6.5, 9], fov: 30 }}
		>
			<Suspense fallback={null}>
				<ModelContent src={src} rotationRef={rotationRef} reduced={reduced} bus={bus} grid={false} />
			</Suspense>
		</Canvas>
	);
}

function Model3D({ project }: { project: Project }) {
	const sectionRef = useRef<HTMLElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const degRef = useRef<HTMLSpanElement>(null);
	const fillRef = useRef<HTMLSpanElement>(null);
	const lockRef = useRef<HTMLSpanElement>(null);
	const rotationRef = useRef(0);
	const bus = useRef<Set<() => void>>(new Set());
	const [near, setNear] = useState(false);
	const [blowOpen, setBlowOpen] = useState(false);
	const [reduced] = useState(
		() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
	);
	const [coarse, setCoarse] = useState(
		() => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches,
	);
	const [narrow, setNarrow] = useState(
		() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches,
	);

	/* Mount canvas only within ~200px of the viewport */
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const obs = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
			rootMargin: "200px 0px",
		});
		obs.observe(el);
		return () => obs.disconnect();
	}, []);

	useEffect(() => {
		const hc = window.matchMedia("(hover: none)");
		const wn = window.matchMedia("(max-width: 767px)");
		const sync = () => {
			setCoarse(hc.matches);
			setNarrow(wn.matches);
		};
		hc.addEventListener("change", sync);
		wn.addEventListener("change", sync);
		return () => {
			hc.removeEventListener("change", sync);
			wn.removeEventListener("change", sync);
		};
	}, []);

	/* Scroll progress → rotation target + direct DOM writes (no React state) */
	useEffect(() => {
		const section = sectionRef.current;
		const stage = stageRef.current;
		if (!section || !stage) return;
		let raf = 0;
		const compute = () => {
			raf = 0;
			const rect = section.getBoundingClientRect();
			const top = rect.top + window.scrollY;
			const lock = section.offsetHeight - stage.offsetHeight;
			const p = Math.max(0, Math.min(1, (window.scrollY - top) / Math.max(1, lock)));
			rotationRef.current = p * Math.PI * 2;
			if (degRef.current)
				degRef.current.textContent = `${String(Math.round(p * 360)).padStart(3, "0")}°`;
			if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
			if (lockRef.current) lockRef.current.textContent = p >= 1 ? "RELEASED" : "LOCKED";
			bus.current.forEach((fn) => fn());
		};
		const onScroll = () => {
			if (raf === 0) raf = requestAnimationFrame(compute);
		};
		compute();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
			if (raf !== 0) cancelAnimationFrame(raf);
		};
	}, []);

	const { model } = project;
	const panelW = narrow ? 46 : 32;
	const geom = platePanel(model.focus, panelW);

	return (
		<section
			ref={sectionRef}
			className="model3d"
			id={`model-${project.num}`}
			aria-label={`3D model — ${project.title}. Scroll to rotate 360 degrees.`}
		>
			<div className="container model3d__head">
				<span className="micro model3d__index">MODEL — {project.num}</span>
				<span className="model3d__rule" aria-hidden="true" />
				<span className="micro">{model.fileLabel}</span>
			</div>
			<div
				ref={stageRef}
				className="model3d__stage"
			>
				<div className="model3d__canvas" onClick={() => setBlowOpen(false)}>
					{near && (
						<Canvas
							frameloop="demand"
							dpr={[1, 2]}
							gl={{ alpha: true, antialias: true }}
							camera={{ position: [9, 6.5, 9], fov: 30 }}
						>
							<Suspense fallback={null}>
								<ModelContent src={model.src} rotationRef={rotationRef} reduced={reduced} bus={bus} />
							</Suspense>
						</Canvas>
					)}
				</div>
				<Ticks size={14} inset={0} />
				<aside className="model3d__side" aria-label="Model metadata">
					<p className="micro">FILE — {model.fileLabel}</p>
					<p className="micro">SOFTWARE — {model.software}</p>
					<p className="micro">YEAR — {model.year}</p>
					<p className="micro">PROJECT — {project.title}</p>
				</aside>
				<PoiButton
					x={model.focus.x}
					y={model.focus.y}
					label={model.detailLabel}
					open={blowOpen}
					onOpen={() => setBlowOpen(true)}
					onClose={() => setBlowOpen(false)}
					onToggle={() => setBlowOpen((v) => !v)}
					coarse={coarse}
				/>
				<div
					className={`blow blow--model${blowOpen ? " is-open" : ""}`}
					style={
						{
							left: `${geom.left}%`,
							top: `${geom.top}%`,
							width: `${panelW}%`,
							aspectRatio: "1 / 1",
							transformOrigin: geom.origin,
						} as CSSProperties
					}
					aria-hidden={!blowOpen}
				>
					{geom.captionAbove && (
						<span className="blow-cap">
							<span className="micro blow-cap__label">{model.detailLabel}</span>
							<span className="blow-cap__rule" aria-hidden="true" />
							<span className="micro blow-cap__scale">{model.detailScale}</span>
						</span>
					)}
					<div className="blow-cropbox">
						<Ticks size={8} inset={4} />
						{blowOpen && near && (
							<DetailCanvas src={model.src} rotationRef={rotationRef} reduced={reduced} bus={bus} />
						)}
					</div>
					{!geom.captionAbove && (
						<span className="blow-cap">
							<span className="micro blow-cap__label">{model.detailLabel}</span>
							<span className="blow-cap__rule" aria-hidden="true" />
							<span className="micro blow-cap__scale">{model.detailScale}</span>
						</span>
					)}
				</div>
				<div className="model3d__rail" aria-hidden="true">
					<span ref={degRef} className="micro model3d__deg">
						000°
					</span>
					<span className="model3d__track">
						<span ref={fillRef} className="model3d__fill" />
					</span>
					<span ref={lockRef} className="micro model3d__lock">
						LOCKED
					</span>
				</div>
				<p className="micro model3d__cap">SCROLL TO ROTATE — 360°</p>
			</div>
		</section>
	);
}

export default Model3D;
