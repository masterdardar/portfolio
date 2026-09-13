import type { Focus } from "../data/projects";

export type PanelGeom = {
	left: number; // % of image box
	top: number; // % of image box
	toRight: boolean;
	toBottom: boolean;
	origin: string; // transform-origin corner touching the indicator side
	captionAbove: boolean;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/**
 * Blowup panel geometry (SPEC-2 §2.7). The panel is `panelW`% wide with the
 * image's aspect ratio, offset from the indicator by `gapPct`, and clamped
 * so it never leaves the image box.
 */
export function platePanel(focus: Focus, panelW: number, gapPct = 4): PanelGeom {
	const toRight = focus.x < 0.5;
	const toBottom = focus.y < 0.5;
	const left = clamp(focus.x * 100 + (toRight ? gapPct : -panelW - gapPct), 0, 100 - panelW);
	const top = clamp(focus.y * 100 + (toBottom ? gapPct : -panelW - gapPct), 0, 100 - panelW);
	return {
		left,
		top,
		toRight,
		toBottom,
		origin: `${toRight ? "left" : "right"} ${toBottom ? "top" : "bottom"}`,
		captionAbove: toBottom,
	};
}
