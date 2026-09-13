import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { ProjectImage } from "../../data/projects";
import { platePanel } from "../../lib/plateGeometry";
import Ticks from "../Ticks/Ticks";

type Props = {
	image: ProjectImage;
	panelW: number; // panel width as % of the image box
	zoom: number; // crop magnification
	fluid?: boolean; // natural image height (masonry, studio)
	fit?: "cover" | "contain"; // used when not fluid
	className?: string;
};

export function PoiButton({
	x,
	y,
	label,
	open,
	onOpen,
	onClose,
	onToggle,
	coarse,
}: {
	x: number;
	y: number;
	label: string;
	open: boolean;
	onOpen: () => void;
	onClose: () => void;
	onToggle: () => void;
	coarse: boolean;
}) {
	return (
		<button
			type="button"
			className={`poi${open ? " on" : ""}`}
			style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
			aria-label={`View detail — ${label}`}
			aria-expanded={open}
			onPointerEnter={(e) => {
				if (!coarse && e.pointerType === "mouse") onOpen();
			}}
			onPointerLeave={(e) => {
				if (!coarse && e.pointerType === "mouse") onClose();
			}}
			onClick={(e) => {
				e.stopPropagation();
				if (coarse) onToggle();
			}}
			onFocus={coarse ? undefined : onOpen}
			onBlur={coarse ? undefined : onClose}
		>
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<g className="dash-spin">
					<circle
						cx="32"
						cy="32"
						r="30"
						fill="none"
						stroke="rgba(10,10,10,0.4)"
						strokeWidth="1"
						strokeDasharray="3 5"
					/>
				</g>
				<line x1="25" y1="32" x2="39" y2="32" stroke="rgba(10,10,10,0.4)" strokeWidth="1" />
				<line x1="32" y1="25" x2="32" y2="39" stroke="rgba(10,10,10,0.4)" strokeWidth="1" />
				<circle cx="32" cy="32" r="1.4" fill="rgba(10,10,10,0.65)" />
			</svg>
		</button>
	);
}

/**
 * Plate interaction (SPEC-2 §2.7) — dashed indicator + blowup floating near
 * the indicator on fine pointers, expanding below the image on coarse ones.
 */
function ImageWithDetail({ image, panelW, zoom, fluid = false, fit = "cover", className = "" }: Props) {
	const [open, setOpen] = useState(false);
	const [coarse, setCoarse] = useState(
		() => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches,
	);

	useEffect(() => {
		const mq = window.matchMedia("(hover: none)");
		const sync = () => {
			setCoarse(mq.matches);
			if (mq.matches) setOpen(false);
		};
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	const geom = platePanel(image.focus, panelW);
	const aspect = `${image.width} / ${image.height}`;
	const openIt = () => setOpen(true);
	const closeIt = () => setOpen(false);
	const toggle = () => setOpen((v) => !v);

	const caption = (
		<span className="blow-cap">
			<span className="micro blow-cap__label">{image.detailLabel}</span>
			<span className="blow-cap__rule" aria-hidden="true" />
			<span className="micro blow-cap__scale">{image.detailScale}</span>
		</span>
	);

	return (
		<div className={`plate${open ? " is-open" : ""} ${className}`}>
			<div
				className={`plate__media${fluid ? " is-fluid" : ""}`}
				onClick={coarse && open ? closeIt : undefined}
			>
				<img
					src={image.src}
					alt={image.alt}
					width={image.width}
					height={image.height}
					loading="lazy"
					draggable={false}
					style={fluid ? undefined : ({ "--plate-fit": fit } as CSSProperties)}
				/>
				<PoiButton
					x={image.focus.x}
					y={image.focus.y}
					label={image.detailLabel}
					open={open}
					onOpen={openIt}
					onClose={closeIt}
					onToggle={toggle}
					coarse={coarse}
				/>
				<div
					className={`blow${open ? " is-open" : ""}`}
					style={
						{
							left: `${geom.left}%`,
							top: `${geom.top}%`,
							width: `${panelW}%`,
							aspectRatio: aspect,
							transformOrigin: geom.origin,
						} as CSSProperties
					}
					aria-hidden={!open}
				>
					{geom.captionAbove && caption}
					<div className="blow-cropbox">
						<Ticks size={8} inset={4} />
						<span className="blow-cross" aria-hidden="true" />
						{open && (
							<div
								className="blow-crop"
								style={
									{
										backgroundImage: `url("${image.src}")`,
										"--zoom": zoom,
										"--px": image.focus.x,
										"--py": image.focus.y,
									} as CSSProperties
								}
								role="img"
								aria-label={`${image.detailLabel} — magnified detail`}
							/>
						)}
					</div>
					{!geom.captionAbove && caption}
				</div>
			</div>
		</div>
	);
}

export default ImageWithDetail;
