import useInView from "../../hooks/useInView";
import { experience } from "../../data/projects";

function Experience() {
	const { ref, inView } = useInView<HTMLElement>(0.2);
	return (
		<section ref={ref} className={`cv reveal${inView ? " is-visible" : ""}`} aria-label="Experience">
			<div className="container">
				<p className="micro cv__kicker">EXPERIENCE</p>
				<ul className="cv__list">
					{experience.map((row) => (
						<li key={row.years} className="cv__row">
							<span className="micro cv__years">{row.years}</span>
							<span className="cv__text">{row.text}</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export default Experience;
