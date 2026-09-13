import { site } from "../../data/projects";
import HeroBlueprint from "./HeroBlueprint";

function Hero() {
	return (
		<section className="hero" id="top" aria-label="Introduction">
			<div className="hero__bg dotgrid" aria-hidden="true" />
			<div className="hero__bg linegrid" aria-hidden="true" />
			<HeroBlueprint />
			<span className="cross" style={{ left: 20, top: "22vh" }} aria-hidden="true" />
			<span className="cross" style={{ left: "33.33%", top: "38vh" }} aria-hidden="true" />
			<span className="cross cross--md" style={{ right: 40, top: "30vh" }} aria-hidden="true" />
			<span className="cross cross--md" style={{ left: "66.66%", top: "64vh" }} aria-hidden="true" />
			<div className="hero__meta">
				<p className="micro hero__meta-left">
					SELECTED WORKS <span className="hero__meta-rule" aria-hidden="true" /> 2018 / 2025
				</p>
				<p className="micro hero__meta-right">{site.coordinates}</p>
			</div>
			<div className="scrollline" aria-hidden="true" />
			<div className="container hero__nameblock">
				<h1 className="hero-name">
					<span>Jonah Darryl</span>
					<span>Escoto</span>
				</h1>
				<hr className="hero__rule" aria-hidden="true" />
				<div className="hero__baseline">
					<p className="micro">
						INDEPENDENT PRACTICE <span className="hero__baseline-mute">/ PRINCIPAL</span>
					</p>
					<p className="micro">{site.discipline}</p>
				</div>
			</div>
		</section>
	);
}

export default Hero;
