import type { Project } from "../../data/projects";
import { CategoryHeader, NextProject, ProjectHeader } from "./ProjectShared";
import AccordionGallery from "../AccordionGallery/AccordionGallery";
import type { AccordionCategory } from "../AccordionGallery/AccordionGallery";
import ImageWithDetail from "../ImageWithDetail/ImageWithDetail";
import Model3D from "../Model3D/Model3D";

function Project03({ project, nextHref, nextLabel }: { project: Project; nextHref: string; nextLabel: string }) {
	const hero = {
		src: project.heroSrc,
		caption: `${project.title} — Overview`,
		focusX: 0.45,
		focusY: 0.5,
		detailLabel: "DETAIL — STRUCTURE",
	};
	const categories: AccordionCategory[] = [
		{ key: "plans", title: "FLOOR PLANS", images: project.categories.plans, aspect: "4/5" },
		{ key: "elevations", title: "ELEVATIONS", images: project.categories.elevations, aspect: "3/2" },
		{ key: "views", title: "3D VIEWS", images: project.categories.views3D, aspect: "16/9" },
	];
	return (
		<article className="project" id={`project-${project.number}`} aria-label={`Project ${project.number} — ${project.title}`}>
			<div className="container">
				<ProjectHeader number={project.number} title={project.title} tags={project.tags} meta={project.meta} />
				<figure className="project-hero ticks">
					<ImageWithDetail image={hero} />
					<figcaption className="micro project-hero__caption">{hero.caption}</figcaption>
				</figure>
				<AccordionGallery categories={categories} />
				<div className="strip-block">
					<CategoryHeader index="04" title="MODEL" count={1} unit="INTERACTIVE" />
				</div>
			</div>
			<Model3D src={project.model3D} number={project.number} />
			<NextProject href={nextHref} label={nextLabel} />
		</article>
	);
}

export default Project03;
