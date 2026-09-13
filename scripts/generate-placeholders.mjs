/* Generates placeholder drafting-style SVGs + minimal GLB models. Run: node scripts/generate-placeholders.mjs */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");

function mulberry(seed) {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function gridLines(w, h, step) {
	let s = "";
	for (let x = step; x < w; x += step) s += `<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`;
	for (let y = step; y < h; y += step) s += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`;
	return s;
}

function planDrawing(rand, w, h) {
	const rooms = 4 + Math.floor(rand() * 3);
	let s = "";
	for (let r = 0; r < rooms; r++) {
		const x = 120 + rand() * (w - 420);
		const y = 120 + rand() * (h - 420);
		const rw = 200 + rand() * 320;
		const rh = 160 + rand() * 260;
		s += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${rw.toFixed(0)}" height="${rh.toFixed(0)}" fill="none" stroke="#0a0a0a" stroke-width="3"/>`;
		s += `<rect x="${(x + 14).toFixed(0)}" y="${(y + 14).toFixed(0)}" width="${(rw - 28).toFixed(0)}" height="${(rh - 28).toFixed(0)}" fill="none" stroke="#0a0a0a" stroke-width="1" opacity="0.45"/>`;
		// door swing
		const dx = x + 30 + rand() * (rw - 90);
		s += `<line x1="${dx.toFixed(0)}" y1="${y.toFixed(0)}" x2="${dx.toFixed(0)}" y2="${(y + 60).toFixed(0)}" stroke="#0a0a0a" stroke-width="1.5"/><path d="M ${dx.toFixed(0)} ${y.toFixed(0)} A 60 60 0 0 1 ${(dx + 60).toFixed(0)} ${(y + 60).toFixed(0)}" fill="none" stroke="#0a0a0a" stroke-width="1"/>`;
		// window break
		s += `<line x1="${(x + rw * 0.3).toFixed(0)}" y1="${(y + rh).toFixed(0)}" x2="${(x + rw * 0.7).toFixed(0)}" y2="${(y + rh).toFixed(0)}" stroke="#fafafa" stroke-width="7"/><line x1="${(x + rw * 0.3).toFixed(0)}" y1="${(y + rh).toFixed(0)}" x2="${(x + rw * 0.7).toFixed(0)}" y2="${(y + rh).toFixed(0)}" stroke="#0a0a0a" stroke-width="1"/>`;
	}
	// north arrow + scale bar
	s += `<g transform="translate(${w - 140},140)" stroke="#0a0a0a" fill="none" stroke-width="1.5"><circle r="34"/><line x1="0" y1="20" x2="0" y2="-20"/><polygon points="0,-30 7,-12 -7,-12" fill="#0a0a0a" stroke="none"/><text y="-44" text-anchor="middle" font-size="22" fill="#0a0a0a" stroke="none" font-family="monospace">N</text></g>`;
	s += `<g transform="translate(120,${h - 100})"><rect width="200" height="8" fill="none" stroke="#0a0a0a"/><rect width="50" height="8" fill="#0a0a0a"/><rect x="100" width="50" height="8" fill="#0a0a0a"/><text y="34" font-size="20" font-family="monospace" fill="#0a0a0a">0 ——— 5M</text></g>`;
	return s;
}

function elevationDrawing(rand, w, h) {
	const base = h * 0.78;
	let s = `<line x1="80" y1="${base}" x2="${w - 80}" y2="${base}" stroke="#0a0a0a" stroke-width="3"/>`;
	const blocks = 2 + Math.floor(rand() * 3);
	let x = 160 + rand() * 80;
	for (let b = 0; b < blocks && x < w - 260; b++) {
		const bw = 180 + rand() * 260;
		const bh = 140 + rand() * (h * 0.42);
		const y = base - bh;
		s += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${bw.toFixed(0)}" height="${bh.toFixed(0)}" fill="none" stroke="#0a0a0a" stroke-width="2.5"/>`;
		// window grid
		const cols = 2 + Math.floor(rand() * 4);
		const rows = 1 + Math.floor(rand() * 3);
		for (let c = 0; c < cols; c++) {
			for (let r = 0; r < rows; r++) {
				const wx = x + 24 + c * ((bw - 48) / cols);
				const wy = y + 24 + r * ((bh - 48) / rows);
				s += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="${((bw - 48) / cols - 14).toFixed(0)}" height="${((bh - 48) / rows - 14).toFixed(0)}" fill="none" stroke="#0a0a0a" stroke-width="1" opacity="0.7"/>`;
			}
		}
		// roof line
		s += `<line x1="${(x - 14).toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x + bw + 14).toFixed(0)}" y2="${y.toFixed(0)}" stroke="#0a0a0a" stroke-width="1.5"/>`;
		x += bw + 30 + rand() * 60;
	}
	// level markers
	for (let l = 0; l < 3; l++) {
		const ly = base - l * 130;
		s += `<g transform="translate(60,${ly})" stroke="#0a0a0a" stroke-width="1"><circle r="4" fill="none"/><line x1="4" y1="0" x2="60" y2="0"/><text x="66" y="6" font-size="18" font-family="monospace" fill="#0a0a0a" stroke="none">+${(l * 3).toFixed(1)}</text></g>`;
	}
	return s;
}

function viewDrawing(rand, w, h) {
	const cx = w / 2;
	const cy = h / 2 + 40;
	const dx = 190 + rand() * 120;
	const dy = 110 + rand() * 60;
	const hh = 200 + rand() * 160;
	let s = "";
	// ground plane hatch
	for (let i = -8; i <= 8; i++) {
		s += `<line x1="${(cx + i * 90).toFixed(0)}" y1="${(cy + 190).toFixed(0)}" x2="${(cx + i * 90 + 320).toFixed(0)}" y2="${(cy + 190 - 120).toFixed(0)}" stroke="#0a0a0a" stroke-width="0.75" opacity="0.25"/>`;
	}
	const A = [cx - dx, cy];
	const B = [cx + dx, cy];
	const C = [cx + dx * 2.1, cy - dy];
	const D = [cx + dx * 1.1, cy - dy];
	const At = [A[0], A[1] - hh];
	const Bt = [B[0], B[1] - hh];
	const Ct = [C[0], C[1] - hh];
	const Dt = [D[0], D[1] - hh];
	const P = (p) => `${p[0].toFixed(0)},${p[1].toFixed(0)}`;
	const seg = (p, q, sw = 2, op = 1) =>
		`<line x1="${p[0].toFixed(0)}" y1="${p[1].toFixed(0)}" x2="${q[0].toFixed(0)}" y2="${q[1].toFixed(0)}" stroke="#0a0a0a" stroke-width="${sw}" opacity="${op}"/>`;
	s += `<polygon points="${P(A)},${P(B)},${P(C)},${P(D)}" fill="none" stroke="#0a0a0a" stroke-width="1" opacity="0.4"/>`;
	s += seg(A, B, 2.5) + seg(B, C, 2.5) + seg(C, D, 1) + seg(D, A, 1);
	s += seg(At, Bt, 2.5) + seg(Bt, Ct, 2.5) + seg(Ct, Dt, 1.5) + seg(Dt, At, 1.5);
	s += seg(A, At, 2.5) + seg(B, Bt, 2.5) + seg(C, Ct, 2.5) + seg(D, Dt, 1.5);
	// floor lines on facade
	const floors = 2 + Math.floor(rand() * 3);
	for (let f = 1; f <= floors; f++) {
		const t = f / (floors + 1);
		const l1 = [A[0] + (At[0] - A[0]) * t, A[1] + (At[1] - A[1]) * t];
		const l2 = [B[0] + (Bt[0] - B[0]) * t, B[1] + (Bt[1] - B[1]) * t];
		const l3 = [C[0] + (Ct[0] - C[0]) * t, C[1] + (Ct[1] - C[1]) * t];
		s += seg(l1, l2, 1, 0.7) + seg(l2, l3, 1, 0.7);
	}
	// figure
	s += `<g transform="translate(${cx - dx - 160},${cy + 60})" stroke="#0a0a0a" stroke-width="1.5" fill="none"><circle cx="0" cy="-96" r="10"/><line x1="0" y1="-86" x2="0" y2="-40"/><line x1="0" y1="-70" x2="-16" y2="-52"/><line x1="0" y1="-70" x2="16" y2="-52"/><line x1="0" y1="-40" x2="-14" y2="0"/><line x1="0" y1="-40" x2="14" y2="0"/></g>`;
	return s;
}

function portraitDrawing(rand, w, h) {
	let s = `<rect x="${w * 0.28}" y="${h * 0.12}" width="${w * 0.44}" height="${h * 0.5}" fill="none" stroke="#0a0a0a" stroke-width="2.5"/>`;
	s += `<line x1="${w * 0.28}" y1="${h * 0.32}" x2="${w * 0.72}" y2="${h * 0.32}" stroke="#0a0a0a" stroke-width="1" opacity="0.6"/>`;
	s += `<line x1="${w * 0.5}" y1="${h * 0.12}" x2="${w * 0.5}" y2="${h * 0.62}" stroke="#0a0a0a" stroke-width="1" opacity="0.6"/>`;
	s += `<circle cx="${w * 0.5}" cy="${h * 0.37}" r="${w * 0.07}" fill="none" stroke="#0a0a0a" stroke-width="1.5"/>`;
	s += `<rect x="${w * 0.2}" y="${h * 0.68}" width="${w * 0.6}" height="${h * 0.2}" fill="none" stroke="#0a0a0a" stroke-width="1.5"/>`;
	for (let i = 0; i < 5; i++) {
		s += `<line x1="${w * 0.2}" y1="${h * (0.72 + i * 0.03)}" x2="${w * 0.8}" y2="${h * (0.72 + i * 0.03)}" stroke="#0a0a0a" stroke-width="1" opacity="0.4"/>`;
	}
	return s;
}

function svgDoc({ w, h, title, sub, seed, kind }) {
	const rand = mulberry(seed);
	const drawing = kind === "plan" ? planDrawing(rand, w, h) : kind === "elevation" ? elevationDrawing(rand, w, h) : kind === "portrait" ? portraitDrawing(rand, w, h) : viewDrawing(rand, w, h);
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<rect width="${w}" height="${h}" fill="#fafafa"/>
<g stroke="rgba(10,10,10,0.08)" stroke-width="1">${gridLines(w, h, 48)}</g>
<rect x="24" y="24" width="${w - 48}" height="${h - 48}" fill="none" stroke="rgba(10,10,10,0.2)" stroke-width="1"/>
${drawing}
<text x="48" y="${h - 96}" font-family="monospace" font-size="26" letter-spacing="4" fill="#0a0a0a">${title}</text>
<text x="48" y="${h - 60}" font-family="monospace" font-size="20" letter-spacing="3" fill="#8a8a8a">${sub}</text>
</svg>`;
}

const jobs = [];
const planCount = { "project-01": 6, "project-02": 4, "project-03": 4 };
const elevCount = { "project-01": 5, "project-02": 5, "project-03": 4 };
const viewCount = { "project-01": 5, "project-02": 4, "project-03": 6 };

for (const p of ["project-01", "project-02", "project-03"]) {
	const n = Number(p.slice(-2));
	for (let i = 1; i <= planCount[p]; i++)
		jobs.push([`${p}/plan-${String(i).padStart(2, "0")}.svg`, 1600, 1200, `PLAN ${String(i).padStart(2, "0")} — 1:100`, `PROJECT ${String(n).padStart(2, "0")} — PLACEHOLDER`, n * 100 + i, "plan"]);
	for (let i = 1; i <= elevCount[p]; i++)
		jobs.push([`${p}/elevation-${String(i).padStart(2, "0")}.svg`, 1600, 1200, `ELEVATION ${String(i).padStart(2, "0")} — 1:100`, `PROJECT ${String(n).padStart(2, "0")} — PLACEHOLDER`, n * 200 + i, "elevation"]);
	for (let i = 1; i <= viewCount[p]; i++)
		jobs.push([`${p}/view-${String(i).padStart(2, "0")}.svg`, 1600, 1200, `VIEW ${String(i).padStart(2, "0")} — AXON`, `PROJECT ${String(n).padStart(2, "0")} — PLACEHOLDER`, n * 300 + i, "view"]);
}
jobs.push(["studio/portrait.svg", 1200, 1500, "STUDIO — LISBON", "PRINCIPAL ARCHITECT", 999, "portrait"]);

for (const [rel, w, h, title, sub, seed, kind] of jobs) {
	const out = join(pub, "images", rel);
	mkdirSync(dirname(out), { recursive: true });
	writeFileSync(out, svgDoc({ w, h, title, sub, seed, kind }));
	console.log("wrote", rel);
}

/* ---- Minimal GLB (single box, distinct color per project) ---- */
function buildGlb(r, g, b) {
	const s = 1.1; // half-extent
	const positions = new Float32Array([-s, -s, -s, s, -s, -s, s, s, -s, -s, s, -s, -s, -s, s, s, -s, s, s, s, s, -s, s, s]);
	const indices = new Uint16Array([
		0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6, 0, 4, 5, 0, 5, 1,
		1, 5, 6, 1, 6, 2, 2, 6, 7, 2, 7, 3, 3, 7, 4, 3, 4, 0,
	]);
	const posBytes = Buffer.from(positions.buffer, positions.byteOffset, positions.byteLength);
	const idxBytes = Buffer.from(indices.buffer, indices.byteOffset, indices.byteLength);
	const bin = Buffer.concat([posBytes, idxBytes]);
	const json = {
		asset: { version: "2.0", generator: "placeholder" },
		scenes: [{ nodes: [0] }],
		nodes: [{ mesh: 0, name: "massing" }],
		meshes: [{ name: "massing", primitives: [{ attributes: { POSITION: 0 }, indices: 1, material: 0 }] }],
		materials: [{ name: "clay", pbrMetallicRoughness: { baseColorFactor: [r, g, b, 1], metallicFactor: 0, roughnessFactor: 0.85 } }],
		accessors: [
			{ bufferView: 0, componentType: 5126, count: 8, type: "VEC3", min: [-s, -s, -s], max: [s, s, s] },
			{ bufferView: 1, componentType: 5123, count: 36, type: "SCALAR" },
		],
		bufferViews: [
			{ buffer: 0, byteOffset: 0, byteLength: posBytes.length, target: 34962 },
			{ buffer: 0, byteOffset: posBytes.length, byteLength: idxBytes.length, target: 34963 },
		],
		buffers: [{ byteLength: bin.length }],
	};
	let jsonBytes = Buffer.from(JSON.stringify(json), "utf8");
	const jsonPad = (4 - (jsonBytes.length % 4)) % 4;
	jsonBytes = Buffer.concat([jsonBytes, Buffer.alloc(jsonPad, 0x20)]);
	const total = 12 + 8 + jsonBytes.length + 8 + bin.length;
	const out = Buffer.alloc(total);
	out.writeUInt32LE(0x46546c67, 0);
	out.writeUInt32LE(2, 4);
	out.writeUInt32LE(total, 8);
	let o = 12;
	out.writeUInt32LE(jsonBytes.length, o);
	out.writeUInt32LE(0x4e4f534a, o + 4);
	jsonBytes.copy(out, o + 8);
	o += 8 + jsonBytes.length;
	out.writeUInt32LE(bin.length, o);
	out.writeUInt32LE(0x004e4942, o + 4);
	bin.copy(out, o + 8);
	return out;
}

const colors = { "project-01": [0.72, 0.36, 0.22], "project-02": [0.55, 0.52, 0.46], "project-03": [0.25, 0.28, 0.3] };
for (const [name, c] of Object.entries(colors)) {
	mkdirSync(join(pub, "models"), { recursive: true });
	writeFileSync(join(pub, "models", `${name}.glb`), buildGlb(...c));
	console.log("wrote", `models/${name}.glb`);
}
