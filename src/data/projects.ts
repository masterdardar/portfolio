export type Focus = { x: number; y: number };

export interface ProjectImage {
	src: string;
	srcDetail?: string;
	alt: string; // real descriptive alt text — required
	caption: string; // ≤4 words
	focus: Focus; // 0.18–0.82 on both axes; avoid exact center
	detailLabel: string; // ≤2 words, e.g. "JOINT"
	detailScale: string; // "1:20"
	width: number;
	height: number;
}

export type CategoryKind = "plans" | "elevations" | "views";

export interface Category {
	id: string;
	index: string; // "01"
	kind: CategoryKind;
	name: string; // "Floor Plans"
	ratio: "4/5" | "3/2" | "16/9" | "25/17";
	captionStem: string; // "PLAN" | "ELEVATION" | "VIEW"
	images: ProjectImage[]; // 4–6
}

export interface ProjectModel {
	src: string;
	fileLabel: string;
	software: string;
	year: string;
	focus: Focus;
	detailLabel: string;
	detailScale: string;
	accentMesh?: string;
}

export interface Project {
	id: string;
	num: string;
	title: string;
	tags: string[];
	meta: string; // "2023 — Lisbon, PT — Built"
	brief: string; // ≤10 words
	layout: "fullscreen" | "masonry";
	mirrored?: boolean;
	opener: ProjectImage;
	categories: [Category, Category, Category];
	model: ProjectModel;
}

export interface ExperienceEntry {
	years: string;
	role: string;
	firm: string;
}

export interface RecognitionEntry {
	year: string;
	title: string;
	note: string;
}

export interface SkillGroup {
	label: string;
	items: string[];
}

export interface SiteConfig {
	name: string;
	role: string;
	discipline: string;
	established: string;
	coordinates: string;
	statement: string;
	practiceLine: string;
	practiceFacts: string[];
	studioImage: ProjectImage;
	email: string;
	phone: string;
	address: string[];
	socials: { label: string; href: string }[];
	nav: { label: string; href: string }[];
}

export const site: SiteConfig = {
	name: "Jonah Darryl Escoto",
	role: "Independent Practice",
	discipline: "Architecture — Lisbon",
	established: "2018",
	coordinates: "38.7223° N — 9.1393° W",
	statement: "We draw buildings from light, mass and measure — rooms tuned to site, climate and use.",
	practiceLine: "A Lisbon practice shaping light, weight and quiet proportion.",
	practiceFacts: ["FOUNDED 2018", "FOUR ARCHITECTS", "OA Nº 27 481"],
	studioImage: {
		src: "/images/studio/portrait.svg",
		alt: "Studio interior with drawing tables, material samples and a pinned-up facade study",
		caption: "Studio — Lisbon",
		focus: { x: 0.54, y: 0.3 },
		detailLabel: "DESK",
		detailScale: "1:20",
		width: 1200,
		height: 1500,
	},
	email: "studio@escoto.archi",
	phone: "+351 21 342 0000",
	address: ["Rua das Flores 84", "1200-195 Lisboa"],
	socials: [
		{ label: "LinkedIn", href: "https://www.linkedin.com/" },
		{ label: "Instagram", href: "https://www.instagram.com/" },
		{ label: "Behance", href: "https://www.behance.net/" },
	],
	nav: [
		{ label: "Work", href: "#work" },
		{ label: "Model", href: "#model-01" },
		{ label: "Practice", href: "#practice" },
		{ label: "CV", href: "#cv" },
		{ label: "Contact", href: "#contact" },
	],
};

/* ---------------- image builders ---------------- */

const SPOTS: Focus[] = [
	{ x: 0.3, y: 0.4 },
	{ x: 0.66, y: 0.34 },
	{ x: 0.52, y: 0.64 },
	{ x: 0.26, y: 0.68 },
	{ x: 0.72, y: 0.58 },
	{ x: 0.6, y: 0.26 },
];

const DETAILS = ["JOINT", "EAVE", "STAIR", "SILL", "PIVOT", "PLINTH"];

const ALT_POOL: Record<CategoryKind, string[]> = {
	plans: [
		"floor plan with courtyard, living wing and bedroom wing around a central patio",
		"floor plan showing entrance sequence, stair core and double-height living space",
		"floor plan with kitchen wing, guest suite and shaded loggia facing the garden",
		"roof plan tracing parapets, skylights and the courtyard void",
		"floor plan detailing bathroom cores, storage walls and sliding partitions",
		"site plan placing the house, pool and olive trees within the walled plot",
	],
	elevations: [
		"street elevation in board-marked concrete with deep-set timber windows",
		"garden elevation opening to the patio through full-height sliding glass",
		"side elevation showing the stepping section and roof overhangs",
		"courtyard elevation with perforated brick screen filtering afternoon sun",
		"rear elevation with service yard, stair tower and rooftop terrace",
	],
	views: [
		"axonometric view of the massing around the central courtyard",
		"interior perspective of the double-height living room in morning light",
		"aerial render of the house settled among pines above the river",
		"detail render of the concrete eave meeting the timber soffit",
		"evening view of the lit courtyard seen through the entrance passage",
		"dusk render of the pool terrace and garden loggia",
	],
};

const DIMS = {
	plan: { w: 1200, h: 1500 },
	elevation: { w: 1800, h: 1200 },
	view: { w: 1920, h: 1080 },
	opener: { w: 1750, h: 1190 },
};

function fileOf(project: string, kind: "plan" | "elevation" | "view" | "opener", i: number) {
	return `/images/${project}/${kind}-${String(i).padStart(2, "0")}.svg`;
}

function buildImages(
	project: string,
	title: string,
	kind: CategoryKind,
	fileKind: "plan" | "elevation" | "view",
	count: number,
	stem: string,
	scale: string,
): ProjectImage[] {
	const dims = DIMS[fileKind];
	return Array.from({ length: count }, (_, i) => ({
		src: fileOf(project, fileKind, i + 1),
		alt: `${stem.charAt(0) + stem.slice(1).toLowerCase()} ${String(i + 1).padStart(2, "0")} of ${title}, ${ALT_POOL[kind][i % ALT_POOL[kind].length]}`,
		caption: `${stem} ${String(i + 1).padStart(2, "0")} — ${scale}`,
		focus: SPOTS[i % SPOTS.length],
		detailLabel: DETAILS[i % DETAILS.length],
		detailScale: "1:20",
		width: dims.w,
		height: dims.h,
	}));
}

function buildOpener(project: string, title: string, altScene: string, focus: Focus): ProjectImage {
	return {
		src: fileOf(project, "opener", 1),
		alt: `${title}, ${altScene}`,
		caption: `${title} — Overview`,
		focus,
		detailLabel: "ENTRY",
		detailScale: "1:50",
		width: DIMS.opener.w,
		height: DIMS.opener.h,
	};
}

function category(
	project: string,
	index: string,
	kind: CategoryKind,
	name: string,
	ratio: Category["ratio"],
	stem: string,
	count: number,
	scale: string,
): Category {
	return {
		id: `${project}-${kind}`,
		index,
		kind,
		name,
		ratio,
		captionStem: stem,
		images: buildImages(project, name, kind, kind === "plans" ? "plan" : kind === "elevations" ? "elevation" : "view", count, stem, scale),
	};
}

export const projects: Project[] = [
	{
		id: "casa-litoral",
		num: "01",
		title: "Casa Litoral",
		tags: ["Residential", "Concrete", "Courtyard"],
		meta: "2024 — Lisbon, PT — Built",
		brief: "Courtyard house of board concrete and Lisbon light.",
		layout: "fullscreen",
		opener: buildOpener(
			"project-01",
			"Casa Litoral",
			"street view of the board-concrete house fronting a walled garden",
			{ x: 0.56, y: 0.42 },
		),
		categories: [
			category("project-01", "01", "plans", "Floor Plans", "4/5", "PLAN", 6, "1:100"),
			category("project-01", "02", "elevations", "Elevations", "3/2", "ELEVATION", 5, "1:100"),
			category("project-01", "03", "views", "3D Views", "16/9", "VIEW", 5, "AXON"),
		],
		model: {
			src: "/models/project-01.glb",
			fileLabel: "CASA-LITORAL-MASSING.GLB",
			software: "RHINO + GRASSHOPPER",
			year: "2024",
			focus: { x: 0.44, y: 0.46 },
			detailLabel: "MASS",
			detailScale: "1:200",
		},
	},
	{
		id: "atelier-norte",
		num: "02",
		title: "Atelier Norte",
		tags: ["Cultural", "Timber", "Reuse"],
		meta: "2023 — Porto, PT — Built",
		brief: "Timber ateliers inserted within a former tile warehouse.",
		layout: "masonry",
		mirrored: true,
		opener: buildOpener(
			"project-02",
			"Atelier Norte",
			"interior of the timber workshop hall beneath the original steel trusses",
			{ x: 0.44, y: 0.5 },
		),
		categories: [
			category("project-02", "01", "plans", "Floor Plans", "4/5", "PLAN", 4, "1:100"),
			category("project-02", "02", "elevations", "Elevations", "3/2", "ELEVATION", 5, "1:100"),
			category("project-02", "03", "views", "3D Views", "16/9", "VIEW", 4, "AXON"),
		],
		model: {
			src: "/models/project-02.glb",
			fileLabel: "ATELIER-NORTE-MASSING.GLB",
			software: "REVIT",
			year: "2023",
			focus: { x: 0.44, y: 0.46 },
			detailLabel: "HALL",
			detailScale: "1:200",
		},
	},
	{
		id: "pavilhao-rio",
		num: "03",
		title: "Pavilhão Rio",
		tags: ["Pavilion", "Steel", "Public"],
		meta: "2022 — Coimbra, PT — Concept",
		brief: "A demountable steel pavilion for the riverfront biennale.",
		layout: "masonry",
		opener: buildOpener(
			"project-03",
			"Pavilhão Rio",
			"riverside view of the slender steel pavilion colonnade at dusk",
			{ x: 0.6, y: 0.38 },
		),
		categories: [
			category("project-03", "01", "plans", "Floor Plans", "4/5", "PLAN", 4, "1:100"),
			category("project-03", "02", "elevations", "Elevations", "3/2", "ELEVATION", 4, "1:100"),
			category("project-03", "03", "views", "3D Views", "16/9", "VIEW", 6, "AXON"),
		],
		model: {
			src: "/models/project-03.glb",
			fileLabel: "PAVILHAO-RIO-MASSING.GLB",
			software: "RHINO + GRASSHOPPER",
			year: "2022",
			focus: { x: 0.44, y: 0.46 },
			detailLabel: "FRAME",
			detailScale: "1:200",
		},
	},
];

export const experience: ExperienceEntry[] = [
	{ years: "2021 — NOW", role: "Principal Architect", firm: "Escoto Studio" },
	{ years: "2017 — 2021", role: "Project Architect", firm: "Atelier Costa" },
	{ years: "2014 — 2017", role: "Architect", firm: "Studio Meridiano" },
	{ years: "2012 — 2014", role: "Junior Architect", firm: "Oficina Litoral" },
];

export const recognition: RecognitionEntry[] = [
	{ year: "2024", title: "Architizer A+ Award", note: "Residential — Winner" },
	{ year: "2023", title: "Venice Biennale", note: "National Pavilion" },
	{ year: "2022", title: "Mies van der Rohe Award", note: "Nominee" },
	{ year: "2021", title: "Dezeen Awards", note: "Housing Shortlist" },
];

export const skillGroups: SkillGroup[] = [
	{
		label: "SOFTWARE",
		items: ["Rhino", "Revit", "Grasshopper", "AutoCAD", "Adobe CC", "Blender", "Enscape"],
	},
	{
		label: "EXPERTISE",
		items: [
			"Parametric Design",
			"Technical Drawing",
			"Rendering",
			"Construction Documentation",
			"Model Making",
			"Site Analysis",
		],
	},
];
