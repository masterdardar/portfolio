import useInView from "../../hooks/useInView";
import Annotation from "../Annotation/Annotation";

const SOCIALS = [
	{ label: "LinkedIn", href: "https://www.linkedin.com/" },
	{ label: "Instagram", href: "https://www.instagram.com/" },
	{ label: "Behance", href: "https://www.behance.net/" },
];

function Contact() {
	const { ref, inView } = useInView<HTMLElement>(0.3);
	return (
		<section ref={ref} className={`contact reveal${inView ? " is-visible" : ""}`} id="contact" aria-label="Contact">
			<div className="container">
				<hr className="rule" />
				<p className="micro contact__kicker">CONTACT</p>
				<a href="mailto:studio@escoto.archi" className="contact__email">
					studio@escoto.archi
				</a>
				<div className="contact__annotation">
					<Annotation direction="horizontal" length="long" label="AVAILABLE FOR COMMISSIONS" />
				</div>
				<p className="micro contact__address">Rua das Flores 84 — Lisbon · +351 21 342 0000</p>
				<nav className="contact__socials" aria-label="Social links">
					{SOCIALS.map((s, i) => (
						<span key={s.label} className="contact__social-item">
							{i > 0 && <span className="contact__sep" aria-hidden="true" />}
							<a href={s.href} target="_blank" rel="noreferrer" className="u-link micro">
								{s.label}
							</a>
						</span>
					))}
				</nav>
			</div>
		</section>
	);
}

export default Contact;
