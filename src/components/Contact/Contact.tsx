import useInView from "../../hooks/useInView";
import { site } from "../../data/projects";

function Contact() {
	const { ref, inView } = useInView<HTMLElement>(0.25);
	const blocks = [
		{ label: "STUDIO", lines: site.address, hrefs: [] as string[] },
		{ label: "TELEPHONE", lines: [site.phone], hrefs: [`tel:${site.phone.replace(/\s/g, "")}`] },
		{ label: "ELSEWHERE", lines: site.socials.map((s) => s.label), hrefs: site.socials.map((s) => s.href) },
	];
	return (
		<section ref={ref} className="contact" id="contact" aria-label="Contact">
			<div className="container">
				<a href={`mailto:${site.email}`} className="contact__email">
					{site.email}
				</a>
				<div className="grid12 contact__grid">
					{blocks.map((b, i) => (
						<div
							key={b.label}
							className={`contact__block rv${inView ? " in" : ""}`}
							style={{ transitionDelay: `${i * 60}ms` }}
						>
							<p className="micro contact__label">{b.label}</p>
							{b.lines.map((line, j) =>
								b.hrefs[j] ? (
									<a
										key={line}
										href={b.hrefs[j]}
										className="u-link contact__line"
										target={b.hrefs[j].startsWith("http") ? "_blank" : undefined}
										rel={b.hrefs[j].startsWith("http") ? "noreferrer" : undefined}
									>
										{line}
									</a>
								) : (
									<p key={line} className="contact__line">
										{line}
									</p>
								),
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Contact;
