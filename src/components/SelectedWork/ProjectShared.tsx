import useInView from "../../hooks/useInView";
import Annotation from "../Annotation/Annotation";

export function ProjectHeader({
	number,
	title,
	tags,
	meta,
}: {
	number: string;
	title: string;
	tags: string[];
	meta: string;
}) {
	const { ref, inView } = useInView<HTMLElement>(0.3);
	return (
		<header ref={ref} className={`project-head reveal${inView ? " is-visible" : ""}`}>
			<span className="micro project-head__number">{number}</span>
			<h2 className="project-head__title">{title}</h2>
			<p className="micro project-head__tags">
				{tags.map((t, i) => (
					<span key={t}>
						{i > 0 && (
							<span className="project-head__divider" aria-hidden="true">
								{" | "}
							</span>
						)}
						{t}
					</span>
				))}
			</p>
			<div className="project-head__meta">
				<Annotation direction="horizontal" length="long" label={meta} />
			</div>
		</header>
	);
}

export function CategoryHeader({
	index,
	title,
	count,
	unit,
}: {
	index: string;
	title: string;
	count: number;
	unit: string;
}) {
	return (
		<div className="cat-head">
			<span className="micro cat-head__left">
				{index} — {title}
			</span>
			<span className="cat-head__rule" aria-hidden="true" />
			<span className="micro cat-head__right">
				{String(count).padStart(2, "0")} {unit}
			</span>
		</div>
	);
}

export function NextProject({ href, label }: { href: string; label: string }) {
	return (
		<div className="container next-project">
			<a href={href} className="u-link micro next-project__link">
				<span aria-hidden="true">→&nbsp;&nbsp;</span>Next — {label}
			</a>
		</div>
	);
}
