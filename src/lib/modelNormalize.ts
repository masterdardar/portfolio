import * as THREE from "three";

const CLAY = new THREE.MeshStandardMaterial({
	color: "#EFEFEF",
	roughness: 0.95,
	metalness: 0,
	flatShading: true,
});
const EDGE = new THREE.LineBasicMaterial({ color: "#0A0A0A" });

/**
 * Clone a loaded `.glb` scene into a line-drawing massing model:
 * clay override, per-mesh edges, centered, scaled to 4 units, grounded.
 * The cached original is never mutated.
 */
export function normalizeModel(scene: THREE.Object3D): THREE.Object3D {
	const clone = scene.clone(true);
	const meshes: THREE.Mesh[] = [];
	clone.traverse((o) => {
		if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
	});

	const box = new THREE.Box3().setFromObject(clone);
	const size = box.getSize(new THREE.Vector3());
	const center = box.getCenter(new THREE.Vector3());
	const s = 4 / Math.max(size.x, size.y, size.z, 0.0001);
	clone.scale.setScalar(s);
	clone.position.sub(center.multiplyScalar(s));
	const grounded = new THREE.Box3().setFromObject(clone);
	clone.position.y -= grounded.min.y;

	for (const m of meshes) {
		m.material = CLAY;
		const edges = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 25), EDGE);
		m.add(edges);
	}
	return clone;
}
