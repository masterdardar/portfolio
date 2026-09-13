import { useCallback, useEffect, useRef, useState } from "react";

export type CursorState = {
	x: number;
	y: number;
	hovering: boolean;
	visible: boolean;
};

function useCursor() {
	const [state, setState] = useState<CursorState>({ x: -100, y: -100, hovering: false, visible: false });
	const raf = useRef(0);
	const target = useRef({ x: -100, y: -100 });
	const current = useRef({ x: -100, y: -100 });

	const onMove = useCallback((e: MouseEvent) => {
		target.current = { x: e.clientX, y: e.clientY };
		setState((s) => (s.visible ? s : { ...s, visible: true }));
	}, []);

	useEffect(() => {
		if (window.matchMedia("(hover: none)").matches) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const loop = () => {
			current.current.x += (target.current.x - current.current.x) * 0.22;
			current.current.y += (target.current.y - current.current.y) * 0.22;
			setState((s) => ({ ...s, x: current.current.x, y: current.current.y }));
			raf.current = requestAnimationFrame(loop);
		};
		raf.current = requestAnimationFrame(loop);

		const over = (e: MouseEvent) => {
			const t = e.target as HTMLElement | null;
			const interactive = t?.closest?.("a, button, [data-cursor], [role='button'], [tabindex]");
			setState((s) => ({ ...s, hovering: Boolean(interactive) }));
		};
		const leave = () => setState((s) => ({ ...s, visible: false }));

		window.addEventListener("mousemove", onMove, { passive: true });
		window.addEventListener("mouseover", over, { passive: true });
		document.documentElement.addEventListener("mouseleave", leave);
		return () => {
			cancelAnimationFrame(raf.current);
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseover", over);
			document.documentElement.removeEventListener("mouseleave", leave);
		};
	}, [onMove]);

	return state;
}

export default useCursor;
