import { useCallback, useEffect, useRef, useState } from "react";
import type { Category } from "../../data/projects";
import ImageWithDetail from "../ImageWithDetail/ImageWithDetail";
import ReelNavigation from "./ReelNavigation";

const RATIO_VALUE: Record<Category["ratio"], number> = {
	"4/5": 4 / 5,
	"3/2": 3 / 2,
	"16/9": 16 / 9,
	"25/17": 25 / 17,
};

type Props = {
	category: Category;
	projectTitle: string;
	projectMeta: string;
};

function HorizontalGallery({ category, projectTitle, projectMeta }: Props) {
	const sectionRef = useRef<HTMLElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);
	const [reelVisible, setReelVisible] = useState(false);
	const drag = useRef<{ startX: number; startScroll: number; moved: boolean } | null>(null);

	const count = category.images.length;

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
			if (raf === 0) raf = requestAnimationFrame(sync);
		};
		track.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			track.removeEventListener("scroll", onScroll);
			if (raf !== 0) cancelAnimationFrame(raf);
		};
	}, [count]);

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

	const goTo = useCallback((i: number) => {
		const track = trackRef.current;
		if (!track) return;
		track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
		setActive(i);
	}, []);

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
		if (Math.abs(dx) > 6) d.moved = true;
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
			const dir = e.key === "ArrowRight" ? 1 : -1;
			track.scrollBy({ left: dir * track.clientWidth, behavior: "smooth" });
		}
	};

	const ratio = RATIO_VALUE[category.ratio];
	const current = category.images[active];

	return (
		<section ref={sectionRef} className="fs-section" aria-label={`${category.name} — full-screen gallery`}>
			<div className="fs-head" aria-hidden="true">
				<div className="container fs-head__row">
					<span className="micro fs-head__index">{category.index}</span>
					<span className="fs-head__rule" />
					<span className="micro">{category.name}</span>
					<span className="fs-head__rule fs-head__rule--flex" />
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
						<div
							className="fs-frame"
							style={{
								width: `min(100% - 8px, calc((100svh - 250px) * ${ratio}))`,
								aspectRatio: category.ratio.replace("/", " / "),
							}}
						>
							<ImageWithDetail image={image} panelW={26} zoom={3.4} fit="contain" />
						</div>
					</div>
				))}
			</div>
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
