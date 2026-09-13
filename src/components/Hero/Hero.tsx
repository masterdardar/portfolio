import Annotation from "../Annotation/Annotation";

function Hero() {
	return (
		<section className="hero dot-grid" id="top" aria-label="Introduction">
			<div className="hero__grid-lines" aria-hidden="true">
				<span className="hero__hline" style={{ top: "25%" }} />
				<span className="hero__hline" style={{ top: "50%" }} />
				<span className="hero__hline" style={{ top: "75%" }} />
				<span className="hero__vline" style={{ left: "33%" }} />
				<span className="hero__vline" style={{ left: "66%" }} />
				{[
					"25%:33%",
					"25%:66%",
					"50%:33%",
					"50%:66%",
					"75%:33%",
					"75%:66%",
				].map((pos) => {
					const [top, left] = pos.split(":");
					return (
						<span key={pos} className="hero__cross" style={{ top, left }} aria-hidden="true">
							+
						</span>
					);
				})}
			</div>
			<span className="hero__rail hero__rail--left" aria-hidden="true" />
			<span className="hero__rail hero__rail--right" aria-hidden="true" />
			<div className="container hero__inner">
				<p className="micro hero__kicker">PORTFOLIO — 2026</p>
				<h1 className="hero__name">
					Jonah Darryl
					<br />
					Escoto
				</h1>
				<div className="hero__annotation">
					<Annotation direction="vertical" length="medium" label="EST. 2012" />
				</div>
				<hr className="rule hero__rule" />
				<div className="hero__meta">
					<span className="micro">Principal Architect</span>
					<span className="hero__meta-sep" aria-hidden="true" />
					<span className="micro">Architecture — Lisbon</span>
				</div>
			</div>
			<div className="hero__scroll" aria-hidden="true">
				<span className="micro hero__scroll-label">SCROLL</span>
				<span className="hero__scroll-line" />
			</div>
		</section>
	);
}

export default Hero;
