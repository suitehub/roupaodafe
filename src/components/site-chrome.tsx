import { motion } from "framer-motion";
import { EASE } from "./scroll-effects";
import logoPng from "@/assets/logo.png";
import { cn } from "@/lib/utils";

import bg1 from "@/assets/bg1.jpg";
import bg2 from "@/assets/bg2.jpg";
import bg3 from "@/assets/bg3.jpg";
import bg4 from "@/assets/bg4.jpg";
import bg5 from "@/assets/bg5.jpg";
import bg6 from "@/assets/bg6.jpg";

/* Fundo global: as peças empilhadas coladas, uma embaixo da outra, na ordem
 * do design (bg1 hero · bg2 história · bg3 símbolo · bg4 participar ·
 * bg5 histórias + doar · bg6 contato), tamanho exato e sem alterar
 * proporções (w-full h-auto, block). As seções transparentes assentam
 * sobre as faixas. */
const BANDS = [bg1, bg2, bg3, bg4, bg5, bg5, bg6];

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
