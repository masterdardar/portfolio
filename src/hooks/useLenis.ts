import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "../lib/lenis";

function useLenis() {
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		});
		setLenis(lenis);
		let id = 0;
		function raf(time: number) {
			lenis.raf(time);
			id = requestAnimationFrame(raf);
		}
		id = requestAnimationFrame(raf);
		return () => {
			cancelAnimationFrame(id);
			lenis.destroy();
			setLenis(null);
		};
	}, []);
}

export default useLenis;
