// Caminho-base do site. "/" no dev/Vercel; "/roupaodafe" no GitHub Pages.
// Derivado do `base` do Vite (GH_PAGES_BASE no build de export).
const raw: string = import.meta.env.BASE_URL ?? "/";
export const BASE_PATH = raw.length > 1 ? raw.replace(/\/$/, "") : "";

export function withBase(p: string): string {
  return `${BASE_PATH}${p.startsWith("/") ? p : `/${p}`}`;
}
