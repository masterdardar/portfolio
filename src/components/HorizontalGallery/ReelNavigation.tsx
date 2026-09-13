import { useEffect, useState } from "react";
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
	const [coarse, setCoarse] = useState(
		() => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches,
	);

	useEffect(() => {
		const mq = window.matchMedia("(hover: none)");
		const sync = () => {
			setCoarse(mq.matches);
			if (mq.matches) setExpanded(false);
		};
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	/* Collapse when the dock leaves the band */
	const showExpanded = expanded && visible;

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
		e.preventDefault();
		const next =
			e.key === "ArrowRight" ? Math.min(images.length - 1, active + 1) : Math.max(0, active - 1);
		onSelect(next);
	};

	return (
		<div
			className={`reel${showExpanded ? " is-expanded" : ""}${visible ? " is-visible" : ""}`}
			onPointerEnter={coarse ? undefined : () => setExpanded(true)}
			onPointerLeave={coarse ? undefined : () => setExpanded(false)}
			onFocusCapture={coarse ? undefined : () => setExpanded(true)}
			onBlurCapture={coarse ? undefined : () => setExpanded(false)}
		>
			<div
				className="reel__items"
				role="group"
				aria-label={`${label} reel navigation`}
				onKeyDown={onKeyDown}
				onClick={coarse ? () => setExpanded((v) => !v) : undefined}
			>
				{images.map((image, i) => (
					<button
						key={image.src}
						type="button"
						aria-current={i === active}
						aria-label={`Go to ${label} ${i + 1} of ${images.length}`}
						tabIndex={visible ? 0 : -1}
						className={`reel__item${i === active ? " is-active" : ""}`}
						onClick={(e) => {
							e.stopPropagation();
							onSelect(i);
						}}
					>
						<span className="reel__line" aria-hidden="true" />
						{showExpanded && (
							<img className="reel__thumb" src={image.src} alt="" aria-hidden="true" loading="lazy" draggable={false} />
						)}
					</button>
				))}
			</div>
		</div>
	);
}

export default ReelNavigation;
