import useInView from "../../hooks/useInView";
import type { Category } from "../../data/projects";
import ImageWithDetail from "../ImageWithDetail/ImageWithDetail";
import Ticks from "../Ticks/Ticks";

function MasonryCell({ image, stem, pos, count, delay }: {
	image: Category["images"][number];
	stem: string;
	pos: string;
	count: string;
	delay: number;
}) {
	const { ref, inView } = useInView<HTMLElement>(0.1);
	return (
		<figure
			ref={ref}
			className={`masonry-item rv${inView ? " in" : ""}`}
			style={{ transitionDelay: `${delay}ms` }}
		>
			<ImageWithDetail image={image} panelW={46} zoom={3.0} fluid />
			<Ticks size={10} inset={6} />
			<figcaption className="masonry-chip">
				<span className="micro masonry-chip__pos">
					{stem} {pos} / {count}
				</span>
				<span className="micro masonry-chip__name">{image.caption}</span>
			</figcaption>
		</figure>
	);
}

function MasonryCategory({ category }: { category: Category }) {
	const count = String(category.images.length).padStart(2, "0");
	return (
		<div className="cat-block">
			<div className="container">
				<div className="cat-head">
					<span className="micro cat-head__index">{category.index}</span>
					<span className="cat-head__rule" aria-hidden="true" />
					<span className="micro">{category.name}</span>
					<span className="cat-head__rule cat-head__rule--flex" aria-hidden="true" />
					<span className="micro cat-head__count">
						{count} {category.kind === "views" ? "VIEWS" : "DRAWINGS"}
					</span>
				</div>
			</div>
			<div className="container">
				<div className="masonry">
					{category.images.map((image, i) => (
						<MasonryCell
							key={image.src}
							image={image}
							stem={category.captionStem}
							pos={String(i + 1).padStart(2, "0")}
							count={count}
							delay={i * 70}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

function Masonry({ categories }: { categories: [Category, Category, Category] }) {
	return (
		<>
			{categories.map((c) => (
				<MasonryCategory key={c.id} category={c} />
			))}
		</>
	);
}

export default Masonry;
