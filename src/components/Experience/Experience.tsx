import type { CSSProperties } from "react";
import useInView from "../../hooks/useInView";
import { experience } from "../../data/projects";
import "../Experience/Experience.css";

function Experience() {
	const { ref, inView } = useInView<HTMLElement>(0.15);
	return (
		<section ref={ref} className="cv cv--top" id="cv" aria-label="Experience">
			<div className="container">
				<p className="micro cv__kicker">EXPERIENCE</p>
				<ul className="cv__list">
					{experience.map((row, i) => (
						<li
							key={row.years}
							className={`cv__row rv${inView ? " in" : ""}`}
							style={{ "--rd": `${i * 60}ms` } as CSSProperties}
						>
							<span className="micro cv__years">{row.years}</span>
							<span className="cv__main">
								<span className="cv__role">{row.role}</span>
								<span className="micro cv__firm">{row.firm}</span>
							</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export default Experience;
