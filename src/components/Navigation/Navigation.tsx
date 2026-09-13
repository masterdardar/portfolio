import { useEffect, useState } from "react";

const LINKS = [
	{ label: "Work", href: "#work" },
	{ label: "Practice", href: "#practice" },
	{ label: "CV", href: "#cv" },
	{ label: "Contact", href: "#contact" },
];

function Navigation() {
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 100);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open ]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	return (
		<>
			<header className={`nav${scrolled ? " is-scrolled" : ""}`}>
				<div className="container nav__inner">
					<a href="#top" className="nav__brand">
						Jonah Darryl Escoto
					</a>
					<nav className="nav__links" aria-label="Primary">
						{LINKS.map((l, i) => (
							<span key={l.href} className="nav__item">
								{i > 0 && <span className="nav__sep" aria-hidden="true">·</span>}
								<a href={l.href} className="u-link micro nav__link">
									{l.label}
								</a>
							</span>
						))}
					</nav>
					<button
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
			<div className={`nav-overlay${open ? " is-open" : ""}`} aria-hidden={!open}>
				<button className="nav-overlay__close micro" aria-label="Close menu" onClick={() => setOpen(false)}>
					CLOSE +
				</button>
				<nav aria-label="Mobile">
					{LINKS.map((l) => (
						<a key={l.href} href={l.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
							{l.label}
						</a>
					))}
				</nav>
			</div>
		</>
	);
}

export default Navigation;
