import type { CSSProperties } from "react";
import useInView from "../../hooks/useInView";
import { recognition } from "../../data/projects";
import "../Experience/Experience.css";

function Recognition() {
	const { ref, inView } = useInView<HTMLElement>(0.15);
	return (
		<section ref={ref} className="cv" aria-label="Recognition">
			<div className="container">
				<p className="micro cv__kicker">RECOGNITION</p>
				<ul className="cv__list">
					{recognition.map((row, i) => (
						<li
							key={`${row.year}-${row.title}`}
							className={`cv__row rv${inView ? " in" : ""}`}
							style={{ "--rd": `${i * 50}ms` } as CSSProperties}
						>
							<span className="micro cv__years">{row.year}</span>
							<span className="cv__main">
								<span className="cv__role">{row.title}</span>
								<span className="micro cv__firm">{row.note}</span>
							</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export default Recognition;
