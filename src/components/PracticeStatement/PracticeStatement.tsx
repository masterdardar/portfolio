import useInView from "../../hooks/useInView";
import { site } from "../../data/projects";

function PracticeStatement() {
	const { ref, inView } = useInView<HTMLDivElement>(0.3);
	return (
		<section className="statement-sec" aria-label="Practice statement">
			<div className="container">
				<div ref={ref}>
					<div className={`sweep${inView ? " in" : ""}`} aria-hidden="true" />
					<div className="grid12 statement-sec__grid">
						<div className="statement-sec__dim" aria-hidden="true">
							<span className="dimline" />
						</div>
						<p className={`statement rv${inView ? " in" : ""}`}>{site.statement}</p>
					</div>
					<div className={`sweep${inView ? " in" : ""}`} aria-hidden="true" />
				</div>
			</div>
		</section>
	);
}

export default PracticeStatement;
