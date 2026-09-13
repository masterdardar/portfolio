import { site } from "../../data/projects";

function Footer() {
	const links = [
		{ label: "EMAIL", href: `mailto:${site.email}` },
		...site.socials.map((s) => ({ label: s.label.toUpperCase(), href: s.href })),
		{ label: "TOP", href: "#top" },
	];
	return (
		<footer className="footer">
			<div className="container footer__row">
				<span className="micro">JONAH DARRYL ESCOTO © 2026</span>
				<nav className="footer__links" aria-label="Footer">
					{links.map((l) => (
						<a
							key={l.label}
							href={l.href}
							className="u-link micro footer__link"
							target={l.href.startsWith("http") ? "_blank" : undefined}
							rel={l.href.startsWith("http") ? "noreferrer" : undefined}
						>
							{l.label}
						</a>
					))}
				</nav>
			</div>
		</footer>
	);
}

export default Footer;
