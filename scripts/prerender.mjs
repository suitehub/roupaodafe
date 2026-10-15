// Exporta HTML estatico das rotas usando o proprio bundle SSR builtado.
// Uso: npm run build && node scripts/prerender.mjs
// Saida: dist-pages/ (pronto para GitHub Pages, servido da raiz).
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "dist-pages");

// Subcaminho do GitHub Pages (ex.: "/roupaodafe"). Vazio = raiz.
const RAW_BASE = process.env.GH_PAGES_BASE ?? "";
const BASE = RAW_BASE.endsWith("/") && RAW_BASE.length > 1 ? RAW_BASE.slice(0, -1) : RAW_BASE;
const SUBDIR = BASE.startsWith("/") ? BASE.slice(1) : BASE;

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Arquivos publicos estaticos (assets com hash, favicon, robots).
// Vao para a raiz do subcaminho quando houver (para os URLs /base/assets/...).
const publicOut = SUBDIR === "" ? out : path.join(out, SUBDIR);
mkdirSync(publicOut, { recursive: true });
cpSync(path.join(root, ".output", "public"), publicOut, { recursive: true });
// Garante que o Pages sirva arquivos comecando com "_" (ex.: _headers).
writeFileSync(path.join(out, ".nojekyll"), "");

const mod = await import(pathToFileURL(path.join(root, ".output", "server", "index.mjs")).href);
const handler = mod.default;
const ctx = { waitUntil() {}, passThroughOnException() {} };

const routes = [
  { url: `${BASE}/`, dir: SUBDIR === "" ? out : path.join(out, SUBDIR) },
  {
    url: `${BASE}/como-participar/`,
    dir:
      SUBDIR === "" ? path.join(out, "como-participar") : path.join(out, SUBDIR, "como-participar"),
  },
];
for (const { url: startUrl, dir } of routes) {
  let url = `http://localhost${startUrl === "" ? "/" : startUrl}`;
  let res;
  for (let hop = 0; hop < 4; hop++) {
    res = await handler.fetch(new Request(url), {}, ctx);
    const loc = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && loc) {
      url = new URL(loc, url).toString();
      continue;
    }
    break;
  }
  if (!res.ok) throw new Error(`${startUrl} -> status ${res.status}`);
  const html = await res.text();
  if (!html.includes("<html")) throw new Error(`${startUrl} nao retornou HTML`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), html);
  console.log(startUrl || "/", "->", html.length, "bytes");
}
if (SUBDIR !== "") {
  // Raiz redireciona para o subcaminho.
  writeFileSync(
    path.join(out, "index.html"),
    `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8" /><meta http-equiv="refresh" content="0; url=/${SUBDIR}/" /><link rel="canonical" href="/${SUBDIR}/" /><title>Roupão da Fé</title></head><body></body></html>`,
  );
  console.log("(raiz redireciona para /" + SUBDIR + "/)");
}
console.log("dist-pages pronto.");
