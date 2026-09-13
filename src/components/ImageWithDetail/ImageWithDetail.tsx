import { useEffect, useRef, useState } from "react";
import type { ProjectImage } from "../../data/projects";

type Props = {
	image: ProjectImage;
	className?: string;
};

/**
 * Every portfolio image. A dashed spinning indicator sits at the
 * focus point; hovering (desktop) reveals a 3x zoomed blowup panel,
 * tapping (mobile) toggles it as a full-width panel below the image.
 */
function ImageWithDetail({ image, className = "" }: Props) {
	const [open, setOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const closeTimer = useRef<number | null>(null);

	useEffect(() => {
		const mq = window.matchMedia("(max-width: 767px)");
		const sync = () => setIsMobile(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	useEffect(() => {
		return () => {
			if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
		};
	}, []);

	const show = () => {
		if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
		setOpen(true);
	};
	const hide = () => {
		closeTimer.current = window.setTimeout(() => setOpen(false), 120);
	};

	const flip = image.focusX > 0.62 ? "is-left" : "is-right";

	return (
		<div className={`img-detail ${className}`}>
			<img src={image.src} alt={image.caption} loading="lazy" />
			<button
				type="button"
				className="img-detail__indicator"
				style={{ left: `${image.focusX * 100}%`, top: `${image.focusY * 100}%` }}
				aria-label={`View detail — ${image.detailLabel}`}
				aria-expanded={open}
				onMouseEnter={isMobile ? undefined : show}
				onMouseLeave={isMobile ? undefined : hide}
				onFocus={isMobile ? undefined : show}
				onBlur={isMobile ? undefined : hide}
				onClick={() => {
					if (isMobile) setOpen((v) => !v);
				}}
			>
				<span className="img-detail__dot" aria-hidden="true" />
			</button>
			{!isMobile && (
				<div
					className={`img-detail__blowup ticks ${flip}${open ? " is-open" : ""}`}
					style={{ left: `${image.focusX * 100}%`, top: `${image.focusY * 100}%` }}
					aria-hidden={!open}
					onMouseEnter={show}
					onMouseLeave={hide}
				>
					<span className="img-detail__connector" aria-hidden="true" />
					<div
						className="img-detail__blowup-image"
						style={{
							backgroundImage: `url("${image.src}")`,
							backgroundPosition: `${image.focusX * 100}% ${image.focusY * 100}%`,
						}}
						role="img"
						aria-label={image.detailLabel}
					/>
					<span className="micro">{image.detailLabel}</span>
				</div>
			)}
			{isMobile && open && (
				<div className="img-detail__panel">
					<div
						className="img-detail__panel-image"
						style={{
							backgroundImage: `url("${image.src}")`,
							backgroundPosition: `${image.focusX * 100}% ${image.focusY * 100}%`,
						}}
						role="img"
						aria-label={image.detailLabel}
					/>
					<span className="micro">{image.detailLabel}</span>
				</div>
			)}
		</div>
	);
}

export default ImageWithDetail;
