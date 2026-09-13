import useInView from "../../hooks/useInView";
import { skillGroups } from "../../data/projects";

function Skills() {
	const { ref, inView } = useInView<HTMLElement>(0.2);
	return (
		<section ref={ref} className="cv cv--bottom" aria-label="Skills">
			<div className="container">
				<p className="micro cv__kicker">SKILLS</p>
				{skillGroups.map((group) => (
					<div key={group.label} className={`skills__row rv${inView ? " in" : ""}`}>
						<span className="micro skills__label">{group.label}</span>
						<p className="skills__tags">
							{group.items.map((item) => (
								<span key={item} className="micro skills__tag">
									{item}
								</span>
							))}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}

export default Skills;
