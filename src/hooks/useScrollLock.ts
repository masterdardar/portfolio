import { useEffect, useRef, useState } from "react";
import { getLenis } from "../lib/lenis";

type ScrollLockOptions = {
	distance?: number;
	onComplete?: () => void;
};

function useScrollLock(
	ref: React.RefObject<HTMLElement | null>,
	options: ScrollLockOptions = {},
) {
	const { distance = 1500, onComplete } = options;
	const [progress, setProgress] = useState(0);
	const [locked, setLocked] = useState(false);
	const accumulated = useRef(0);
	const progressRef = useRef(0);
	const lockedRef = useRef(false);
	const completedRef = useRef(false);
	const onCompleteRef = useRef(onComplete);

	useEffect(() => {
		onCompleteRef.current = onComplete;
		progressRef.current = progress;
		lockedRef.current = locked;
	});

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reduced) return;

		const isMobile = window.matchMedia("(max-width: 767px)").matches;
		const travel = isMobile ? 800 : distance;

		const obs = new IntersectionObserver(
			([entry]) => {
				if (completedRef.current) {
					setLocked(false);
					return;
				}
				if (entry.isIntersecting && progressRef.current < 1) {
					setLocked(true);
					accumulated.current = progressRef.current * travel;
				} else if (!entry.isIntersecting) {
					setLocked(false);
				}
			},
			{ threshold: 0.5 },
		);
		obs.observe(el);

		const commit = (next: number) => {
			setProgress(next);
			progressRef.current = next;
			if (next >= 1 && !completedRef.current) {
				completedRef.current = true;
				setLocked(false);
				lockedRef.current = false;
				onCompleteRef.current?.();
			}
		};

		const handleWheel = (e: WheelEvent) => {
			if (!lockedRef.current) return;
			if (progressRef.current >= 1) return;
			// Let upward scroll out when at the very start
			if (progressRef.current <= 0 && e.deltaY < 0) {
				setLocked(false);
				lockedRef.current = false;
				return;
			}
			e.preventDefault();
			e.stopPropagation();
			accumulated.current += e.deltaY;
			const next = Math.max(0, Math.min(1, accumulated.current / travel));
			commit(next);
		};

		let lastTouchY: number | null = null;
		const handleTouchStart = (e: TouchEvent) => {
			lastTouchY = e.touches[0]?.clientY ?? null;
		};
		const handleTouchMove = (e: TouchEvent) => {
			if (!lockedRef.current) return;
			if (progressRef.current >= 1) return;
			const y = e.touches[0]?.clientY ?? null;
			if (y === null || lastTouchY === null) {
				e.preventDefault();
				return;
			}
			const delta = lastTouchY - y;
			lastTouchY = y;
			if (progressRef.current <= 0 && delta < 0) {
				setLocked(false);
				lockedRef.current = false;
				return;
			}
			e.preventDefault();
			e.stopPropagation();
			accumulated.current += delta * 2;
			const next = Math.max(0, Math.min(1, accumulated.current / travel));
			commit(next);
		};

		el.addEventListener("wheel", handleWheel, { passive: false });
		el.addEventListener("touchstart", handleTouchStart, { passive: true });
		el.addEventListener("touchmove", handleTouchMove, { passive: false });
		return () => {
			obs.disconnect();
			el.removeEventListener("wheel", handleWheel);
			el.removeEventListener("touchstart", handleTouchStart);
			el.removeEventListener("touchmove", handleTouchMove);
		};
	}, [distance, ref]);

	useEffect(() => {
		const lenis = getLenis();
		if (!lenis) return;
		if (locked) lenis.stop();
		else lenis.start();
		return () => {
			getLenis()?.start();
		};
	}, [locked]);

	return { progress, locked };
}

export default useScrollLock;
