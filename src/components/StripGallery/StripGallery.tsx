import { useEffect, useRef, useState } from "react";
import type { ProjectImage } from "../../data/projects";
import ImageWithDetail from "../ImageWithDetail/ImageWithDetail";

type Props = {
	images: ProjectImage[];
	label: string;
};

function StripGallery({ images, label }: Props) {
	const trackRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);
	const timer = useRef<number | null>(null);

	useEffect(() => {
		const el = trackRef.current;
		if (!el) return;
		const onScroll = () => {
			if (timer.current !== null) window.clearTimeout(timer.current);
			timer.current = window.setTimeout(() => {
				const slides = Array.from(el.children) as HTMLElement[];
				let best = 0;
				let bestDist = Infinity;
				const center = el.scrollLeft + el.clientWidth / 2;
				slides.forEach((s, i) => {
					const c = s.offsetLeft + s.clientWidth / 2;
					const d = Math.abs(c - center);
					if (d < bestDist) {
						bestDist = d;
						best = i;
					}
				});
				setActive(best);
			}, 50);
		};
		el.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			el.removeEventListener("scroll", onScroll);
			if (timer.current !== null) window.clearTimeout(timer.current);
		};
	}, []);

	return (
		<div className="strip-gallery">
			<div ref={trackRef} className="strip-gallery__track">
				{images.map((image, i) => (
					<figure key={image.src} className="strip-gallery__slide ticks">
						<ImageWithDetail image={image} panelW={46} zoom={3.0} fluid />
						<figcaption className="strip-gallery__caption">
							<span className="micro">
								{label} {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
							</span>
						</figcaption>
					</figure>
				))}
			</div>
			<div className="strip-gallery__counter">
				<span className="micro" aria-live="polite">
					{label} {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
				</span>
			</div>
		</div>
	);
}

export default StripGallery;
