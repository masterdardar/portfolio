import { Component, Suspense, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF, useProgress } from "@react-three/drei";
import useScrollLock from "../../hooks/useScrollLock";
import Annotation from "../Annotation/Annotation";

type Props = {
	src: string;
	number: string;
};

function RotatingModel({ src, progress }: { src: string; progress: number }) {
	const { scene } = useGLTF(src);
	const group = useRef<THREE.Group>(null);
	useFrame(() => {
		if (group.current) group.current.rotation.y = progress * Math.PI * 2;
	});
	return (
		<group ref={group}>
			<primitive object={scene} />
		</group>
	);
}

function FallbackModel({ progress }: { progress: number }) {
	const ref = useRef<THREE.Mesh>(null);
	useFrame(() => {
		if (ref.current) ref.current.rotation.y = progress * Math.PI * 2;
	});
	return (
		<mesh ref={ref}>
			<boxGeometry args={[1.6, 1.6, 1.6]} />
			<meshStandardMaterial color="#0a0a0a" wireframe />
		</mesh>
	);
}

class ModelErrorBoundary extends Component<
	{ children: ReactNode; progress: number; onError: () => void },
	{ failed: boolean }
> {
	state = { failed: false };
	static getDerivedStateFromError() {
		return { failed: true };
	}
	componentDidCatch() {
		this.props.onError();
	}
	render() {
		if (this.state.failed) return <FallbackModel progress={this.props.progress} />;
		return this.props.children;
	}
}

function Loader() {
	return (
		<div className="model-3d__loader" role="status" aria-label="Loading 3D model">
			<span className="model-3d__loader-line" />
		</div>
	);
}

function Model3D({ src, number }: Props) {
	const sectionRef = useRef<HTMLElement>(null);
	const { progress, locked } = useScrollLock(sectionRef, { distance: 1500 });
	const { progress: loadProgress } = useProgress();
	const [modelFailed, setModelFailed] = useState(false);
	const [inView, setInView] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		useGLTF.preload(src);
	}, [src]);

	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
			threshold: 0.5,
		});
		obs.observe(el);
		return () => obs.disconnect();
	}, []);

	useEffect(() => {
		const mq = window.matchMedia("(max-width: 767px)");
		const sync = () => setIsMobile(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	const loading = loadProgress < 100 && !modelFailed;
	const degrees = Math.round(progress * 360);

	return (
		<section
			ref={sectionRef}
			className="model-3d"
			aria-label={`3D model — project ${number}. Scroll to rotate 360 degrees.`}
		>
			<div className="container model-3d__head">
				<Annotation direction="horizontal" length="long" label="SCROLL TO ROTATE" />
			</div>
			<div className="model-3d__canvas">
				{loading && <Loader />}
				<Canvas dpr={isMobile ? [1, 1.5] : [1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
					<ambientLight intensity={0.9} />
					<directionalLight position={[5, 5, 5]} intensity={0.5} />
					<Suspense fallback={null}>
						<Center>
							<ModelErrorBoundary progress={progress} onError={() => setModelFailed(true)}>
								<RotatingModel src={src} progress={progress} />
							</ModelErrorBoundary>
						</Center>
					</Suspense>
				</Canvas>
			</div>
			<div
				className={`model-3d__progress${inView ? " is-visible" : ""}`}
				style={{ "--p": progress } as CSSProperties}
				aria-hidden="true"
			>
				<span className="micro model-3d__degrees">{degrees}°</span>
				<span className="model-3d__track">
					<span className="model-3d__fill" />
				</span>
			</div>
			<span className="micro model-3d__caption">
				{locked
					? `ROTATING — ${degrees}° / 360°`
					: progress >= 1
						? "360° — COMPLETE"
						: "SCROLL TO ROTATE — 360°"}
			</span>
		</section>
	);
}

export default Model3D;
