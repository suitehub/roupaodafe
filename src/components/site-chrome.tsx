import { motion } from "framer-motion";
import { EASE } from "./scroll-effects";
import logoPng from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const layerModules = import.meta.glob<string>("../assets/fundo-camada-*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

const LAYERS: Record<string, string> = {};
for (const [path, url] of Object.entries(layerModules)) {
  const m = path.match(/fundo-camada-(\d+)\.jpg$/);
  const key = m?.[1];
  if (key) LAYERS[key] = url;
}

/* Camada do fundo → seção (ordem de cima para baixo, definida pelo design):
 * 2 robes = hero · 3 mãos = história · 4 onda branca = símbolo ·
 * 5 faixa vermelha = participar · 6 branco = histórias + doar ·
 * 7 pôr-do-sol = contato · 8 branco = rodapé */
export type BgLayer = "hero" | "s01" | "s02" | "s03" | "s04" | "s05" | "s06" | "footer";

const LAYER_FILE: Record<BgLayer, string> = {
  hero: "2",
  s01: "3",
  s02: "4",
  s03: "5",
  s04: "6",
  s05: "6",
  s06: "7",
  footer: "8",
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
      className="flex items-center gap-2.5"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <img src={logoPng} alt="Roupão da Fé" className="h-10 w-auto object-contain" />
      <span className="text-[13px] font-bold leading-[1.1] tracking-[0.08em]">
        ROUPÃO
        <br />
        DA FÉ
      </span>
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
