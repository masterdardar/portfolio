import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectImage } from "../../data/projects";

type Props = {
	images: ProjectImage[];
	active: number;
	visible: boolean;
	label: string;
	onSelect: (index: number) => void;
};

function ReelNavigation({ images, active, visible, label, onSelect }: Props) {
	const [expanded, setExpanded] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const listRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const mq = window.matchMedia("(max-width: 767px)");
		const sync = () => setIsMobile(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
			e.preventDefault();
			const next =
				e.key === "ArrowRight"
					? Math.min(images.length - 1, active + 1)
					: Math.max(0, active - 1);
			onSelect(next);
		},
		[active, images.length, onSelect],
	);

	return (
		<div
			className={`reel${expanded ? " is-expanded" : ""}${visible ? " is-visible" : ""}${isMobile ? " is-touch" : ""}`}
			onMouseEnter={isMobile ? undefined : () => setExpanded(true)}
			onMouseLeave={isMobile ? undefined : () => setExpanded(false)}
			onFocusCapture={isMobile ? undefined : () => setExpanded(true)}
			onBlurCapture={isMobile ? undefined : () => setExpanded(false)}
		>
			<span className="micro reel__label">
				{label} — {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
			</span>
			<div
				ref={listRef}
				className="reel__items"
				role="tablist"
				aria-label={`${label} reel navigation`}
				onKeyDown={onKeyDown}
				onClick={isMobile ? () => setExpanded((v) => !v) : undefined}
			>
				{images.map((image, i) => (
					<button
						key={image.src}
						type="button"
						role="tab"
						aria-selected={i === active}
						aria-label={`Go to ${label} ${i + 1}`}
						tabIndex={visible ? 0 : -1}
						className={`reel__item${i === active ? " is-active" : ""}`}
						onClick={(e) => {
							e.stopPropagation();
							onSelect(i);
							if (isMobile) setExpanded(true);
						}}
					>
						<span className="reel__line" aria-hidden="true" />
						<img className="reel__thumb" src={image.src} alt="" aria-hidden="true" loading="lazy" />
					</button>
				))}
			</div>
		</div>
	);
}

export default ReelNavigation;
