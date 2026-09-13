import { projects } from "../../data/projects";
import Project01 from "./Project01";
import Project02 from "./Project02";
import Project03 from "./Project03";

function SelectedWork() {
	return (
		<section className="work" id="work" aria-label="Selected work">
			<div className="container work__headwrap">
				<div className="work__head">
					<span className="micro">SELECTED WORK</span>
					<span className="work__index">
						{projects.map((p, i) => (
							<span key={p.id} className="work__index-item">
								{i > 0 && <span className="work__sep" aria-hidden="true" />}
								<a href={`#project-${p.num}`} className="u-link micro">
									{p.num}
								</a>
								{i === projects.length - 1 && <span className="micro">&nbsp;BUILT</span>}
							</span>
						))}
					</span>
				</div>
			</div>
			<Project01 project={projects[0]} />
			<Project02 project={projects[1]} />
			<Project03 project={projects[2]} />
		</section>
	);
}

export default SelectedWork;
