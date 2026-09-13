import useInView from "../../hooks/useInView";
import Annotation from "../Annotation/Annotation";
import ImageWithDetail from "../ImageWithDetail/ImageWithDetail";

const PORTRAIT = {
	src: "/images/studio/portrait.svg",
	caption: "Studio — Lisbon",
	focusX: 0.52,
	focusY: 0.32,
	detailLabel: "DETAIL — STUDIO",
};

function Practice() {
	const { ref, inView } = useInView<HTMLElement>(0.3);
	return (
		<section ref={ref} className={`practice reveal${inView ? " is-visible" : ""}`} id="practice" aria-label="Practice">
			<div className="container">
				<hr className="rule" />
				<div className="practice__grid">
					<h2 className="practice__line">A small Lisbon practice building calm, precise houses.</h2>
					<figure className="practice__figure">
						<div className="practice__img ticks">
							<ImageWithDetail image={PORTRAIT} />
						</div>
						<div className="practice__side">
							<Annotation direction="vertical" length="long" label="PRINCIPAL ARCHITECT" />
						</div>
					</figure>
				</div>
				<hr className="rule" />
			</div>
		</section>
	);
}

export default Practice;
