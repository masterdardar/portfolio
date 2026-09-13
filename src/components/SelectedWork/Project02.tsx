import type { Project } from "../../data/projects";
import { ProjectOpener } from "./ProjectShared";
import Masonry from "../Masonry/Masonry";
import Model3D from "../Model3D/Model3D";

function Project02({ project }: { project: Project }) {
	return (
		<article className="project-block" aria-label={`Project ${project.num} — ${project.title}`}>
			<ProjectOpener project={project} />
			<Masonry categories={project.categories} />
			<Model3D project={project} />
		</article>
	);
}

export default Project02;
