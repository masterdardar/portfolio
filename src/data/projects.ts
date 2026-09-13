export type ProjectImage = {
	src: string;
	caption: string; // max 4 words, e.g. "LEVEL 02 — 1:100"
	focusX: number; // 0–1, position of dashed circle
	focusY: number; // 0–1
	detailLabel: string; // e.g. "DETAIL A — 1:20"
};

export type Project = {
	id: string;
	number: string; // "01"
	title: string;
	tags: string[]; // 3–4 max
	meta: string; // "2024 — LISBON — BUILT"
	heroSrc: string;
	model3D: string; // "/models/project-01.glb"
	layout: "gallery" | "strips" | "accordion";
	categories: {
		plans: ProjectImage[];
		elevations: ProjectImage[];
		views3D: ProjectImage[];
	};
};

const img = (project: string, kind: string, i: number) => `/images/${project}/${kind}-${String(i).padStart(2, "0")}.svg`;

function buildImages(
	project: string,
	kind: "plan" | "elevation" | "view",
	count: number,
	label: string,
	scale: string,
): ProjectImage[] {
	const spots: Array<[number, number]> = [
		[0.32, 0.42],
		[0.68, 0.35],
		[0.5, 0.62],
		[0.24, 0.68],
		[0.74, 0.58],
		[0.58, 0.28],
	];
	return Array.from({ length: count }, (_, i) => ({
		src: img(project, kind, i + 1),
		caption: `${label} ${String(i + 1).padStart(2, "0")} — ${scale}`,
		focusX: spots[i % spots.length][0],
		focusY: spots[i % spots.length][1],
		detailLabel: `DETAIL ${String.fromCharCode(65 + (i % 6))} — 1:20`,
	}));
}

export const projects: Project[] = [
	{
		id: "casa-litoral",
		number: "01",
		title: "Casa Litoral",
		tags: ["Residential", "Concrete", "Courtyard"],
		meta: "2024 — LISBON — BUILT",
		heroSrc: img("project-01", "view", 1),
		model3D: "/models/project-01.glb",
		layout: "gallery",
		categories: {
			plans: buildImages("project-01", "plan", 6, "LEVEL", "1:100"),
			elevations: buildImages("project-01", "elevation", 5, "ELEVATION", "1:100"),
			views3D: buildImages("project-01", "view", 5, "VIEW", "AXON"),
		},
	},
	{
		id: "atelier-norte",
		number: "02",
		title: "Atelier Norte",
		tags: ["Cultural", "Timber", "Reuse"],
		meta: "2023 — PORTO — BUILT",
		heroSrc: img("project-02", "view", 1),
		model3D: "/models/project-02.glb",
		layout: "strips",
		categories: {
			plans: buildImages("project-02", "plan", 4, "LEVEL", "1:100"),
			elevations: buildImages("project-02", "elevation", 5, "ELEVATION", "1:100"),
			views3D: buildImages("project-02", "view", 4, "VIEW", "AXON"),
		},
	},
	{
		id: "pavilhao-rio",
		number: "03",
		title: "Pavilhão Rio",
		tags: ["Pavilion", "Steel", "Public"],
		meta: "2022 — COIMBRA — CONCEPT",
		heroSrc: img("project-03", "view", 1),
		model3D: "/models/project-03.glb",
		layout: "accordion",
		categories: {
			plans: buildImages("project-03", "plan", 4, "LEVEL", "1:100"),
			elevations: buildImages("project-03", "elevation", 4, "ELEVATION", "1:100"),
			views3D: buildImages("project-03", "view", 6, "VIEW", "AXON"),
		},
	},
];

export type CvRow = { years: string; text: string };

export const experience: CvRow[] = [
	{ years: "2021 — NOW", text: "Principal Architect — Escoto Studio" },
	{ years: "2017 — 2021", text: "Project Architect — Atelier Costa" },
	{ years: "2014 — 2017", text: "Architect — Studio Meridiano" },
	{ years: "2012 — 2014", text: "Junior Architect — Oficina Litoral" },
];

export const recognition: CvRow[] = [
	{ years: "2024", text: "Architizer A+ Award — Residential" },
	{ years: "2023", text: "Venice Biennale — National Pavilion" },
	{ years: "2022", text: "Mies van der Rohe — Nominee" },
	{ years: "2021", text: "Dezeen Awards — Housing Shortlist" },
];

export const software: string[] = ["Rhino", "Revit", "Grasshopper", "AutoCAD", "Adobe CC", "Blender", "Enscape"];

export const skills: string[] = [
	"Parametric Design",
	"Technical Drawing",
	"Rendering",
	"Construction Documentation",
	"Model Making",
	"Site Analysis",
];
