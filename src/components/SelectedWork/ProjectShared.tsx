import useInView from "../../hooks/useInView";
import type { Project } from "../../data/projects";
import ImageWithDetail from "../ImageWithDetail/ImageWithDetail";
import Ticks from "../Ticks/Ticks";

const LAYOUT_NAME: Record<Project["layout"], string> = {
	fullscreen: "FULL SCREEN REEL",
	masonry: "MASONRY INDEX",
};

export function ProjectOpener({ project }: { project: Project }) {
	const { ref, inView } = useInView<HTMLElement>(0.25);
	const mirrored = project.mirrored === true;
	return (
		<header
			ref={ref}
			id={`project-${project.num}`}
			className={`opener container scroll-mt${mirrored ? " is-mirrored" : ""}`}
			aria-label={`Project ${project.num} — ${project.title}`}
		>
			<div className="grid12 opener__grid">
				<figure className={`opener__plate rv${inView ? " in" : ""}`}>
					<ImageWithDetail image={project.opener} panelW={34} zoom={3.2} fit="cover" />
					<Ticks size={12} inset={6} />
				</figure>
				<div className="opener__meta">
					<p className={`micro opener__line rv${inView ? " in" : ""}`} style={{ transitionDelay: "0ms" }}>
						{project.num}
						<span className="opener__rule" aria-hidden="true" />
						<span className="opener__layout">{LAYOUT_NAME[project.layout]}</span>
					</p>
					<h3 className={`project-title rv${inView ? " in" : ""}`} style={{ transitionDelay: "80ms" }}>
						{project.title}
					</h3>
					<p className={`micro opener__tags rv${inView ? " in" : ""}`} style={{ transitionDelay: "140ms" }}>
						{project.tags.map((t) => (
							<span key={t} className="opener__tag">
								{t}
							</span>
						))}
					</p>
					<div className={`opener__foot rv${inView ? " in" : ""}`} style={{ transitionDelay: "200ms" }}>
						<p className="micro opener__meta-line">{project.meta}</p>
						<p className="opener__brief">{project.brief}</p>
					</div>
				</div>
			</div>
		</header>
	);
}
