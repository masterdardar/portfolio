import useInView from "../../hooks/useInView";

type Props = {
	direction?: "horizontal" | "vertical";
	length?: "short" | "medium" | "long";
	label: string;
	delay?: number;
};

function Annotation({ direction = "horizontal", length = "medium", label, delay = 0 }: Props) {
	const { ref, inView } = useInView<HTMLDivElement>(0.2);
	return (
		<div
			ref={ref}
			className={`annotation annotation--${direction} annotation--${length}${inView ? " is-visible" : ""}`}
			style={{ transitionDelay: `${delay}ms` }}
		>
			<span className="annotation__dot" aria-hidden="true" />
			<span className="annotation__line" aria-hidden="true" />
			<span className="annotation__label micro">{label}</span>
		</div>
	);
}

export default Annotation;
