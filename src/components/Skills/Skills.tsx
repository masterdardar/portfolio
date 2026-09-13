import useInView from "../../hooks/useInView";
import { skills, software } from "../../data/projects";
import "../Experience/Experience.css";

function TagRow({ label, items }: { label: string; items: string[] }) {
	return (
		<div className="skills__group">
			<div className="skills__head">
				<span className="micro">{label}</span>
				<span className="skills__rule" aria-hidden="true" />
			</div>
			<p className="micro skills__tags">
				{items.map((item, i) => (
					<span key={item}>
						{i > 0 && (
							<span className="skills__sep" aria-hidden="true">
								{"  |  "}
							</span>
						)}
						{item}
					</span>
				))}
			</p>
		</div>
	);
}

function Skills() {
	const { ref, inView } = useInView<HTMLElement>(0.2);
	return (
		<section ref={ref} className={`skills reveal${inView ? " is-visible" : ""}`} id="cv" aria-label="Skills">
			<div className="container">
				<p className="micro cv__kicker">SKILLS</p>
				<TagRow label="SOFTWARE" items={software} />
				<TagRow label="EXPERTISE" items={skills} />
			</div>
		</section>
	);
}

export default Skills;
