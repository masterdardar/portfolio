import { projects } from "../../data/projects";
import Project01 from "./Project01";
import Project02 from "./Project02";
import Project03 from "./Project03";

function SelectedWork() {
	const [p1, p2, p3] = projects;
	return (
		<section className="selected-work" id="work" aria-label="Selected work">
			<div className="container selected-work__head">
				<hr className="rule" />
				<p className="micro selected-work__kicker">SELECTED WORK — 03 PROJECTS</p>
			</div>
			{p1 && <Project01 project={p1} nextHref="#project-02" nextLabel="Atelier Norte" />}
			{p2 && <Project02 project={p2} nextHref="#project-03" nextLabel="Pavilhão Rio" />}
			{p3 && <Project03 project={p3} nextHref="#contact" nextLabel="Contact" />}
		</section>
	);
}

export default SelectedWork;
