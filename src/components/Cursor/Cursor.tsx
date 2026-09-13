import useCursor from "../../hooks/useCursor";

function Cursor() {
	const { x, y, hovering, visible } = useCursor();

	if (typeof window !== "undefined") {
		if (window.matchMedia("(hover: none)").matches) return null;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
	}

	return (
		<div
			className={`cursor${hovering ? " is-hover" : ""}${visible ? " is-visible" : ""}`}
			style={{ transform: `translate(${x}px, ${y}px)` }}
			aria-hidden="true"
		/>
	);
}

export default Cursor;
