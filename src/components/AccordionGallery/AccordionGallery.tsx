import { useCallback, useRef, useState } from "react";
import type { ProjectImage } from "../../data/projects";
import ImageWithDetail from "../ImageWithDetail/ImageWithDetail";

export type AccordionCategory = {
	key: string;
	title: string;
	images: ProjectImage[];
	aspect: string;
};

type Props = {
	categories: AccordionCategory[];
};

function AccordionGallery({ categories }: Props) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [settledIndex, setSettledIndex] = useState<number | null>(null);
	const headerRefs = useRef<Array<HTMLButtonElement | null>>([]);

	const toggle = useCallback((i: number) => {
		setSettledIndex(null);
		setOpenIndex((cur) => (cur === i ? null : i));
	}, []);

	const onHeaderKeyDown = useCallback(
		(e: React.KeyboardEvent, i: number) => {
			if (e.key === "ArrowDown" || e.key === "ArrowUp") {
				e.preventDefault();
				const next =
					e.key === "ArrowDown"
						? (i + 1) % categories.length
						: (i - 1 + categories.length) % categories.length;
				headerRefs.current[next]?.focus();
			}
		},
		[categories.length],
	);

	return (
		<div className="accordion">
			{categories.map((cat, i) => {
				const open = openIndex === i;
				return (
					<div key={cat.key} className="accordion__row">
						<button
							type="button"
							ref={(el) => {
								headerRefs.current[i] = el;
							}}
							className="accordion__header"
							aria-expanded={open}
							aria-controls={`accordion-panel-${cat.key}`}
							id={`accordion-header-${cat.key}`}
							onClick={() => toggle(i)}
							onKeyDown={(e) => onHeaderKeyDown(e, i)}
						>
							<span className="accordion__title">
								{cat.title} ({String(cat.images.length).padStart(2, "0")})
							</span>
							<span className={`accordion__icon${open ? " is-open" : ""}`} aria-hidden="true">
								+
							</span>
						</button>
						<div
							id={`accordion-panel-${cat.key}`}
							role="region"
							aria-labelledby={`accordion-header-${cat.key}`}
							className={`accordion__panel${open ? " is-open" : ""}${settledIndex === i ? " is-settled" : ""}`}
							aria-hidden={!open}
							inert={!open}
							onTransitionEnd={(e) => {
								if (e.propertyName === "max-height" && open) setSettledIndex(i);
							}}
						>
							<div className="accordion__grid">
								{cat.images.map((image, j) => (
									<figure key={image.src} className="accordion__cell ticks">
										<span className="micro accordion__caption">
											{cat.title} {String(j + 1).padStart(2, "0")}
										</span>
										<div className="accordion__img" style={{ aspectRatio: cat.aspect }}>
											<ImageWithDetail image={image} />
										</div>
									</figure>
								))}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default AccordionGallery;
