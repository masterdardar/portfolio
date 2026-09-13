import type { Project } from "../../data/projects";
import { ProjectOpener } from "./ProjectShared";
import HorizontalGallery from "../HorizontalGallery/HorizontalGallery";
import Model3D from "../Model3D/Model3D";

function Project01({ project }: { project: Project }) {
	return (
		<article className="project-block" aria-label={`Project ${project.num} — ${project.title}`}>
			<ProjectOpener project={project} />
			{project.categories.map((cat) => (
				<HorizontalGallery
					key={cat.id}
					category={cat}
					projectTitle={project.title}
					projectMeta={project.meta}
				/>
			))}
			<Model3D project={project} />
		</article>
	);
}

export default Project01;
