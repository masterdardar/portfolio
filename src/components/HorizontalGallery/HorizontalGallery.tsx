import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectImage } from "../../data/projects";
import ImageWithDetail from "../ImageWithDetail/ImageWithDetail";
import ReelNavigation from "./ReelNavigation";

type Props = {
	images: ProjectImage[];
	label: string; // e.g. "PLAN"
	id: string;
};

function HorizontalGallery({ images, label, id }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);
	const [reelVisible, setReelVisible] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);
	const timer = useRef<number | null>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const onScroll = () => {
			if (timer.current !== null) window.clearTimeout(timer.current);
			timer.current = window.setTimeout(() => {
				const i = Math.round(el.scrollLeft / el.clientWidth);
				setActive(Math.max(0, Math.min(images.length - 1, i)));
			}, 50);
		};
		el.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			el.removeEventListener("scroll", onScroll);
			if (timer.current !== null) window.clearTimeout(timer.current);
		};
	}, [images.length]);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;
		const obs = new IntersectionObserver(([entry]) => setReelVisible(entry.isIntersecting), {
			threshold: 0.6,
		});
		obs.observe(section);
		return () => obs.disconnect();
	}, []);

	const goTo = useCallback((i: number) => {
		const el = containerRef.current;
		if (!el) return;
		el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
		setActive(i);
	}, []);

	return (
		<section ref={sectionRef} className="h-gallery" aria-label={`${label} gallery`}>
			<div ref={containerRef} className="h-gallery__track" id={id}>
				{images.map((image, i) => (
					<figure key={image.src} className="h-gallery__slide ticks">
						<ImageWithDetail image={image} />
						<figcaption className="h-gallery__caption">
							<span className="micro">
								{label} {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
							</span>
						</figcaption>
					</figure>
				))}
			</div>
			<ReelNavigation images={images} active={active} visible={reelVisible} onSelect={goTo} label={label} />
		</section>
	);
}

export default HorizontalGallery;
