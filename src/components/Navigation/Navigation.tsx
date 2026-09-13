import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "../../data/projects";

function Navigation() {
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	const burgerRef = useRef<HTMLButtonElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		if (open) {
			const first = overlayRef.current?.querySelector<HTMLElement>("a, button");
			first?.focus();
		} else {
			burgerRef.current?.focus();
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open ]);

	const close = useCallback(() => setOpen(false), []);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				close();
				return;
			}
			if (e.key !== "Tab" || !overlayRef.current) return;
			const items = Array.from(
				overlayRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
			).filter((el) => el.tabIndex !== -1);
			if (items.length === 0) return;
			const first = items[0];
			const last = items[items.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, close ]);

	return (
		<>
			<header className={`nav${scrolled ? " is-scrolled" : ""}`}>
				<div className="container nav__inner">
					<a href="#top" className="micro nav__brand" aria-label="Back to top — Jonah Darryl Escoto">
						{site.name} <span className="nav__est">— EST. {site.established}</span>
					</a>
					<nav className="nav__links" aria-label="Primary">
						{site.nav.map((l) => (
							<a key={l.href} href={l.href} className="u-link micro nav__link">
								{l.label}
							</a>
						))}
					</nav>
					<button
						ref={burgerRef}
						type="button"
						className="nav__burger"
						aria-label={open ? "Close menu" : "Open menu"}
						aria-expanded={open}
						onClick={() => setOpen((v) => !v)}
					>
						<span aria-hidden="true" />
						<span aria-hidden="true" />
					</button>
				</div>
			</header>
			<div ref={overlayRef} className={`nav-overlay${open ? " is-open" : ""}`} aria-hidden={!open}>
				<div className="nav-overlay__strip">
					<span className="micro">MENU</span>
					<button
						type="button"
						className="micro nav-overlay__close"
						aria-label="Close menu"
						tabIndex={open ? 0 : -1}
						onClick={close}
					>
						CLOSE
					</button>
				</div>
				<nav className="nav-overlay__links" aria-label="Mobile">
					{site.nav.map((l, i) => (
						<a key={l.href} href={l.href} tabIndex={open ? 0 : -1} onClick={close}>
							<span>{l.label}</span>
							<span className="micro nav-overlay__index">{String(i + 1).padStart(2, "0")}</span>
						</a>
					))}
				</nav>
				<div className="nav-overlay__foot">
					<span className="micro">{site.discipline}</span>
					<span className="micro">{site.phone}</span>
				</div>
			</div>
		</>
	);
}

export default Navigation;
