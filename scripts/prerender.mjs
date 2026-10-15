// Exporta HTML estatico das rotas usando o proprio bundle SSR builtado.
// Uso: npm run build && node scripts/prerender.mjs
// Saida: dist-pages/ (pronto para GitHub Pages, servido da raiz).
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "dist-pages");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Arquivos publicos estaticos (assets com hash, favicon, robots).
cpSync(path.join(root, ".output", "public"), out, { recursive: true });
// Garante que o Pages sirva arquivos comecando com "_" (ex.: _headers).
writeFileSync(path.join(out, ".nojekyll"), "");

const mod = await import(
  pathToFileURL(path.join(root, ".output", "server", "index.mjs")).href
);
const handler = mod.default;
const ctx = { waitUntil() {}, passThroughOnException() {} };

const routes = ["/", "/como-participar/"];
for (const route of routes) {
  let url = `http://localhost${route}`;
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
  if (!res.ok) throw new Error(`${route} -> status ${res.status}`);
  const html = await res.text();
  if (!html.includes("<html")) throw new Error(`${route} nao retornou HTML`);
  const dir = route === "/" ? out : path.join(out, "como-participar");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), html);
  console.log(route, "->", html.length, "bytes");
}
console.log("dist-pages pronto.");
