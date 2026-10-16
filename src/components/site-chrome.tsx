import { motion } from "framer-motion";
import { EASE } from "./scroll-effects";
import logoPng from "@/assets/logo.png";
import { cn } from "@/lib/utils";

import bgHero from "@/assets/bg-hero.jpg";
import bgHistoria from "@/assets/bg-historia.jpg";
import bgSimbolo from "@/assets/bg-simbolo.jpg";
import bgOnda from "@/assets/bg-onda.jpg";
import bgTransicao from "@/assets/bg-transicao.jpg";
import bgContato from "@/assets/bg-contato.jpg";

/* Fundo global: as 6 peças empilhadas coladas, uma embaixo da outra,
 * no tamanho exato e sem alterar proporções (w-full h-auto, block).
 * As seções são transparentes e assentam sobre as faixas. */
const BANDS = [bgHero, bgHistoria, bgSimbolo, bgOnda, bgTransicao, bgContato];

export function HomeBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10">
      {BANDS.map((src, i) => (
        <img key={i} src={src} alt="" className="block h-auto w-full" />
      ))}
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
