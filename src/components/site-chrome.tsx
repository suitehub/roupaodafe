import { motion } from "framer-motion";
import { EASE } from "./scroll-effects";
import logoPng from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const sliceModules = import.meta.glob<string>("../assets/bg-*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

const LAYERS: Record<string, string> = {};
for (const [path, url] of Object.entries(sliceModules)) {
  const m = path.match(/bg-(.+)\.jpg$/);
  const key = m?.[1];
  if (key) LAYERS[key] = url;
}

/* Camada do fundo → seção (ordem de cima para baixo, definida pelo design):
 * hero · historia · simbolo · onda (faixa azul-marinho) ·
 * transicao (04 + 05) · contato. Rodapé fica no creme.
 * A peça nunca é redimensionada: largura cheia, altura natural, fundida
 * na base creme. `cover` = estica até cobrir (só para a onda escura,
 * onde a distorção é invisível e o texto branco precisa de fundo total). */
export type BgLayer = "hero" | "s01" | "s02" | "s03" | "s04" | "s05" | "s06";

const LAYER_FILE: Record<BgLayer, string> = {
  hero: "hero",
  s01: "historia",
  s02: "simbolo",
  s03: "onda",
  s04: "transicao",
  s05: "transicao",
  s06: "contato",
};

/*
 * Faixa do fundo colada na seção (vale para qualquer altura de conteúdo,
 * desktop e celular). Desktop: object-fill como no original.
 * Celular: object-cover (recorta as laterais em vez de achatar).
 * `-z-10` mantém a imagem sempre atrás do conteúdo.
 */
export function SectionBg({ slice }: { slice: BgLayer }) {
  const src = LAYERS[LAYER_FILE[slice]];
  if (!src) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <img src={src} alt="" className="h-full w-full object-cover object-center md:object-fill" />
    </div>
  );
}

export function Logo({ href = "#inicio" }: { href?: string }) {
  return (
    <motion.a
      href={href}
      className="flex items-center"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3, ease: EASE }}
      aria-label="Roupão da Fé — início"
    >
      <img src={logoPng} alt="Roupão da Fé" className="h-11 w-auto object-contain" />
    </motion.a>
  );
}

export function Eyebrow({
  n,
  children,
  light,
  center,
}: {
  n?: string;
  children: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <p
      className={cn(
        "eyebrow mb-5 flex items-center gap-3",
        light && "!text-primary-foreground/80",
        center && "justify-center text-center",
      )}
    >
      {n && (
        <>
          <span>{n}</span>
          <span className="h-px w-6 bg-current" />
        </>
      )}
      {children}
    </p>
  );
}
