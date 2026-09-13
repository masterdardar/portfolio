import useInView from "../../hooks/useInView";

function PracticeStatement() {
	const { ref, inView } = useInView<HTMLQuoteElement>(0.3);
	return (
		<section className="practice-statement" aria-label="Practice statement">
			<div className="container">
				<hr className="rule" />
				<blockquote ref={ref} className={`reveal${inView ? " is-visible" : ""}`}>
					<h2 className="practice-statement__text">Buildings drawn from light, weight, and quiet proportion.</h2>
				</blockquote>
				<hr className="rule" />
			</div>
		</section>
	);
}

export default PracticeStatement;
