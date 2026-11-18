// Prefix for files in /public, so the site also works under a GitHub Pages sub-path.
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const A = (p) => `${BASE}${p}`;
