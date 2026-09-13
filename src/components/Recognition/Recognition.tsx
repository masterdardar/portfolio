import useInView from "../../hooks/useInView";
import { recognition } from "../../data/projects";
import "../Experience/Experience.css";

function Recognition() {
	const { ref, inView } = useInView<HTMLElement>(0.2);
	return (
		<section ref={ref} className={`cv reveal${inView ? " is-visible" : ""}`} aria-label="Recognition">
			<div className="container">
				<p className="micro cv__kicker">RECOGNITION</p>
				<ul className="cv__list">
					{recognition.map((row) => (
						<li key={`${row.years}-${row.text}`} className="cv__row">
							<span className="micro cv__years">{row.years}</span>
							<span className="cv__text">{row.text}</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export default Recognition;
