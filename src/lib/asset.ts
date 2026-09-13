/** Prefix a root-relative public asset path with the Vite base URL. */
export function asset(p: string): string {
	const base = import.meta.env.BASE_URL || "/";
	const clean = p.replace(/^\/+/, "");
	return base.endsWith("/") ? `${base}${clean}` : `${base}/${clean}`;
}
