import useInView from "../../hooks/useInView";
import { site } from "../../data/projects";
import ImageWithDetail from "../ImageWithDetail/ImageWithDetail";
import Ticks from "../Ticks/Ticks";

function Practice() {
	const { ref, inView } = useInView<HTMLElement>(0.25);
	return (
		<section ref={ref} className="practice" id="practice" aria-label="Practice">
			<div className="container">
				<div className="grid12 practice__grid">
					<p className={`practice__line rv${inView ? " in" : ""}`}>{site.practiceLine}</p>
					<figure className={`practice__fig rv${inView ? " in" : ""}`} style={{ transitionDelay: "120ms" }}>
						<div className="practice__photo">
							<ImageWithDetail image={site.studioImage} panelW={50} zoom={2.6} fluid />
							<Ticks size={10} inset={6} color="rgba(255,255,255,0.75)" />
						</div>
					</figure>
				</div>
				<div className="practice__facts">
					{site.practiceFacts.map((f) => (
						<span key={f} className="micro">
							{f}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}

export default Practice;
