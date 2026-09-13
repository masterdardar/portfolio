import { useCallback, useEffect, useRef, useState } from "react";
import type { Category } from "../../data/projects";
import ImageWithDetail from "../ImageWithDetail/ImageWithDetail";
import Ticks from "../Ticks/Ticks";
import ReelNavigation from "./ReelNavigation";

const HINT_KEY = "fs-hint-seen";

type Props = {
	category: Category;
	projectTitle: string;
	projectMeta: string;
};

function Chevron({ dir }: { dir: "left" | "right" }) {
	return (
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<path
				d={dir === "left" ? "M14.5 5 L8 12 L14.5 19" : "M9.5 5 L16 12 L9.5 19"}
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
		</svg>
	);
}

function HorizontalGallery({ category, projectTitle, projectMeta }: Props) {
	const sectionRef = useRef<HTMLElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);
	const [reelVisible, setReelVisible] = useState(false);
	const [interacted, setInteracted] = useState(false);
	const [hint, setHint] = useState(
		() => typeof window !== "undefined" && window.sessionStorage.getItem(HINT_KEY) !== "1",
	);
	const drag = useRef<{ startX: number; startScroll: number; moved: boolean } | null>(null);

	const count = category.images.length;

	const dismissHint = useCallback(() => {
		setHint(false);
		try {
			window.sessionStorage.setItem(HINT_KEY, "1");
		} catch {
			/* private mode — hint simply won't persist */
		}
	}, []);

	const markInteracted = useCallback(() => {
		setInteracted(true);
		dismissHint();
	}, [dismissHint]);

	/* Active index from scroll position */
	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		let raf = 0;
		const sync = () => {
			raf = 0;
			const i = Math.round(track.scrollLeft / track.clientWidth);
			setActive(Math.max(0, Math.min(count - 1, i)));
		};
		const onScroll = () => {
			if (active === 0) markInteracted();
			if (raf === 0) raf = requestAnimationFrame(sync);
		};
		track.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			track.removeEventListener("scroll", onScroll);
			if (raf !== 0) cancelAnimationFrame(raf);
		};
	}, [count, active, markInteracted]);

	/* Reel visible only while the section sits in the middle band */
	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;
		const obs = new IntersectionObserver(([entry]) => setReelVisible(entry.isIntersecting), {
			rootMargin: "-55% 0px -35% 0px",
			threshold: 0,
		});
		obs.observe(section);
		return () => obs.disconnect();
	}, []);

	/* Dismiss the first-slide hint when the section leaves the viewport */
	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;
		const obs = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting) dismissHint();
		});
		obs.observe(section);
		return () => obs.disconnect();
	}, [dismissHint]);

	const goTo = useCallback(
		(i: number) => {
			const track = trackRef.current;
			if (!track) return;
			markInteracted();
			track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
			setActive(i);
		},
		[markInteracted],
	);

	const step = useCallback(
		(dir: 1 | -1) => {
			const track = trackRef.current;
			if (!track) return;
			markInteracted();
			track.scrollBy({ left: dir * track.clientWidth, behavior: "smooth" });
		},
		[markInteracted],
	);

	/* Pointer drag (mouse only — touch uses native swipe) */
	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (e.pointerType !== "mouse" || e.button !== 0) return;
		const track = trackRef.current;
		if (!track) return;
		drag.current = { startX: e.clientX, startScroll: track.scrollLeft, moved: false };
		track.setPointerCapture(e.pointerId);
		track.classList.add("is-dragging");
	};
	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		const track = trackRef.current;
		const d = drag.current;
		if (!track || !d) return;
		const dx = e.clientX - d.startX;
		if (Math.abs(dx) > 6) {
			d.moved = true;
			markInteracted();
		}
		track.scrollLeft = d.startScroll - dx;
	};
	const endDrag = () => {
		trackRef.current?.classList.remove("is-dragging");
		drag.current = null;
	};
	const onClickCapture = (e: React.SyntheticEvent) => {
		if (drag.current?.moved) {
			e.preventDefault();
			e.stopPropagation();
		}
	};

	const onTrackKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const track = trackRef.current;
		if (!track) return;
		if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
			e.preventDefault();
			step(e.key === "ArrowRight" ? 1 : -1);
		}
	};

	const current = category.images[active];
	const showHint = hint && !interacted && active === 0;

	return (
		<section ref={sectionRef} className="fs-section" aria-label={`${category.name} — full-screen gallery`}>
			<div className="fs-head">
				<div className="container fs-head__row">
					<span className="micro fs-head__index">{category.index}</span>
					<span className="fs-head__rule" aria-hidden="true" />
					<span className="micro">{category.name}</span>
					<span className="fs-head__rule fs-head__rule--flex" aria-hidden="true" />
					<span className="micro fs-head__project">{projectTitle}</span>
				</div>
			</div>
			<div
				ref={trackRef}
				className="fs-track"
				tabIndex={0}
				role="region"
				aria-label={`${category.name} — use arrow keys to move between drawings`}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
				onClickCapture={onClickCapture}
				onKeyDown={onTrackKeyDown}
			>
				{category.images.map((image) => (
					<div key={image.src} className="fs-slide">
						<div className="fs-frame">
							<ImageWithDetail image={image} panelW={26} zoom={3.4} fit="cover" />
							<Ticks size={10} inset={6} />
						</div>
					</div>
				))}
			</div>
			<span className={`fs-edge fs-edge--left${active > 0 ? " is-on" : ""}`} aria-hidden="true" />
			<span
				className={`fs-edge fs-edge--right${active < count - 1 ? " is-on" : ""}`}
				aria-hidden="true"
			/>
			{active > 0 && (
				<button
					type="button"
					className="fs-arrow fs-arrow--left"
					aria-label={`Previous ${category.captionStem.toLowerCase()}`}
					onClick={() => step(-1)}
				>
					<Chevron dir="left" />
				</button>
			)}
			{active < count - 1 && (
				<button
					type="button"
					className="fs-arrow fs-arrow--right"
					aria-label={`Next ${category.captionStem.toLowerCase()}`}
					onClick={() => step(1)}
				>
					<Chevron dir="right" />
				</button>
			)}
			{showHint && (
				<p className="micro fs-hint" aria-hidden="true">
					DRAG — ARROWS
				</p>
			)}
			{current && (
				<div className="fs-caption">
					<div className="container fs-caption__row">
						<span className="micro fs-caption__pos">
							{category.captionStem} {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
						</span>
						<span className="fs-caption__rule" aria-hidden="true" />
						<span className="micro fs-caption__name">{current.caption}</span>
						<span className="micro fs-caption__meta">{projectMeta}</span>
					</div>
				</div>
			)}
			<ReelNavigation
				images={category.images}
				active={active}
				visible={reelVisible}
				label={category.captionStem}
				onSelect={goTo}
			/>
		</section>
	);
}

export default HorizontalGallery;
