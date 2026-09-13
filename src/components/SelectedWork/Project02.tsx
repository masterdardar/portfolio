import type { Project } from "../../data/projects";
import { CategoryHeader, NextProject, ProjectHeader } from "./ProjectShared";
import StripGallery from "../StripGallery/StripGallery";
import ImageWithDetail from "../ImageWithDetail/ImageWithDetail";
import Model3D from "../Model3D/Model3D";

function Project02({ project, nextHref, nextLabel }: { project: Project; nextHref: string; nextLabel: string }) {
	const hero = {
		src: project.heroSrc,
		caption: `${project.title} — Overview`,
		focusX: 0.55,
		focusY: 0.4,
		detailLabel: "DETAIL — FACADE",
	};
	return (
		<article className="project" id={`project-${project.number}`} aria-label={`Project ${project.number} — ${project.title}`}>
			<div className="container">
				<ProjectHeader number={project.number} title={project.title} tags={project.tags} meta={project.meta} />
				<figure className="project-hero ticks">
					<ImageWithDetail image={hero} />
					<figcaption className="micro project-hero__caption">{hero.caption}</figcaption>
				</figure>
				<div className="strip-block">
					<CategoryHeader index="01" title="FLOOR PLANS" count={project.categories.plans.length} unit="DRAWINGS" />
					<StripGallery images={project.categories.plans} label="PLAN" />
				</div>
				<div className="strip-block">
					<CategoryHeader index="02" title="ELEVATIONS" count={project.categories.elevations.length} unit="DRAWINGS" />
					<StripGallery images={project.categories.elevations} label="ELEVATION" />
				</div>
				<div className="strip-block">
					<CategoryHeader index="03" title="3D VIEWS" count={project.categories.views3D.length} unit="VIEWS" />
					<StripGallery images={project.categories.views3D} label="VIEW" />
				</div>
				<CategoryHeader index="04" title="MODEL" count={1} unit="INTERACTIVE" />
			</div>
			<Model3D src={project.model3D} number={project.number} />
			<NextProject href={nextHref} label={nextLabel} />
		</article>
	);
}

export default Project02;
