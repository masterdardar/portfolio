import { useEffect, useRef, useState } from "react";

function useInView<T extends HTMLElement>(threshold = 0.2) {
	const ref = useRef<T>(null);
	const [inView, setInView] = useState(() => {
		if (typeof IntersectionObserver === "undefined") return true;
		if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
			return true;
		return false;
	});
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setInView(true);
			},
			{ threshold },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, [threshold]);
	return { ref, inView };
}

export default useInView;
