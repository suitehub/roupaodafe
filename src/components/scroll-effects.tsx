import { createContext, useContext, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/*
 * Regras de performance deste arquivo (para não travar):
 * - NENHUM IntersectionObserver (whileInView/useInView): tudo é derivado da
 *   posição do scroll ou do mount. Nada pode ficar preso invisível.
 * - Apenas `transform` e `opacity` (propriedades compositadas na GPU).
 *   Sem blur, sem clip-path, sem springs em scroll.
 * - Fundo da página é ESTÁTICO (parallax em imagem full-screen repinta tudo).
 */

export type TitleSegment = { t: string; em?: boolean };

type Word = { w: string; em?: boolean | undefined };

function toWords(segments: TitleSegment[]): (Word | { br: true })[] {
  const out: (Word | { br: true })[] = [];
  for (const seg of segments) {
    const lines = seg.t.split("\n");
    lines.forEach((line, li) => {
      if (li > 0) out.push({ br: true });
      line
        .split(" ")
        .filter((w) => w.length > 0)
        .forEach((w) => out.push({ w, em: seg.em }));
    });
  }
  return out;
}

function Mask({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
      {children}
      <span aria-hidden>{"\u00A0"}</span>
    </span>
  );
}

function LoadWord({
  children,
  em,
  delay,
}: {
  children: string;
  em?: boolean | undefined;
  delay: number;
}) {
  return (
    <Mask>
      <motion.span
        className={cn(
          "inline-block origin-bottom-left",
          em && "italic text-primary [.on-red_&]:text-primary-foreground",
        )}
        initial={{ y: "115%", rotate: 4, opacity: 0 }}
        animate={{ y: "0%", rotate: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </Mask>
  );
}

function ScrollWord({
  progress,
  index,
  total,
  children,
  em,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  children: string;
  em?: boolean | undefined;
}) {
  // Faixa comprimida: completa logo no início da entrada (não congela no meio).
  const start = (index / Math.max(total, 1)) * 0.4;
  const end = start + 0.6;
  const y = useTransform(progress, [start, end], ["70%", "0%"]);
  const rotate = useTransform(progress, [start, end], [2, 0]);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  return (
    <Mask>
      <motion.span
        className={cn(
          "inline-block origin-bottom-left",
          em && "italic text-primary [.on-red_&]:text-primary-foreground",
        )}
        style={{ y, rotate, opacity }}
      >
        {children}
      </motion.span>
    </Mask>
  );
}

/* Título editorial. mode="load" toca no mount (hero); "scroll" segue o scroll. */
export function SplitTitle({
  segments,
  className,
  as: Tag = "h2",
  mode = "scroll",
  delay = 0,
  stagger = 0.05,
}: {
  segments: TitleSegment[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  mode?: "load" | "scroll";
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.5"],
  });

  const words = toWords(segments);
  const count = words.filter((w) => !("br" in w)).length;
  let wi = 0;

  return (
    <Tag
      ref={ref as never}
      aria-label={segments.map((s) => s.t.replace(/\n/g, " ")).join("")}
      className={className}
      style={{ perspective: "600px" }}
    >
      {words.map((word, i) => {
        if ("br" in word) return <br key={`br-${i}`} />;
        if (mode === "load") {
          const d = delay + wi++ * stagger;
          return (
            <LoadWord key={i} delay={d} em={word.em}>
              {word.w}
            </LoadWord>
          );
        }
        const idx = wi++;
        return (
          <ScrollWord key={i} progress={scrollYProgress} index={idx} total={count} em={word.em}>
            {word.w}
          </ScrollWord>
        );
      })}
    </Tag>
  );
}

/* Entrada no mount (hero): sem IO, toca sempre. */
export function LoadReveal({
  children,
  className,
  delay = 0,
  y = 26,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* Bloco que revela conforme o scroll (sem IO — determinístico). */
export function ScrollReveal({
  children,
  className,
  y = 30,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.75"],
  });
  const translate = useTransform(scrollYProgress, [0, 1], [y, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [0, 1]);
  return (
    <motion.div ref={ref} style={{ y: translate, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

/* Linha/divisor que cresce com o scroll (horizontal ou vertical). */
export function ScrollScale({ className, axis = "x" }: { className?: string; axis?: "x" | "y" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.55"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={axis === "x" ? { scaleX: scale } : { scaleY: scale }}
      className={className}
    />
  );
}

/* Grid orquestrado por UM progresso da seção (1 listener, N derivados). */
const StaggerCtx = createContext<MotionValue<number> | null>(null);

export function ScrollStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.5"],
  });
  return (
    <StaggerCtx.Provider value={scrollYProgress}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </StaggerCtx.Provider>
  );
}

export function ScrollStaggerItem({
  children,
  index,
  total,
  className,
  y = 44,
}: {
  children: ReactNode;
  index: number;
  total: number;
  className?: string;
  y?: number;
}) {
  const progress = useContext(StaggerCtx);
  if (!progress) return <div className={className}>{children}</div>;
  return (
    <StaggerItemInner progress={progress} index={index} total={total} className={className} y={y}>
      {children}
    </StaggerItemInner>
  );
}

function StaggerItemInner({
  children,
  progress,
  index,
  total,
  className,
  y,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  index: number;
  total: number;
  className?: string | undefined;
  y: number;
}) {
  const start = (index / Math.max(total, 1)) * 0.4;
  const end = start + 0.6;
  const translate = useTransform(progress, [start, end], [y, 0]);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  return (
    <motion.div style={{ y: translate, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

/* Imagem: zoom-out + parallax interno, só transform/opacity. */
export function ScrollImage({
  src,
  alt,
  className,
  imgClassName,
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "end 0.4"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.28, 1.15]);
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0.2, 1]);
  return (
    <div ref={ref} className={cn("overflow-hidden rounded-2xl", className)}>
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        style={{ scale, y, opacity }}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}

/* Parallax genérico e barato (transform direto, sem spring). */
export function ParallaxBox({
  children,
  className,
  distance = 50,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 1", "end 0"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* Header que ganha blur + fundo ao rolar (1 listener global, barato). */
export function ScrollHeader({ children, className }: { children: ReactNode; className?: string }) {
  const { scrollY } = useScroll();
  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
      className={cn("transition-[background-color,box-shadow] duration-500", className)}
    >
      <HeaderBackdrop scrollY={scrollY} />
      {children}
    </motion.header>
  );
}

function HeaderBackdrop({ scrollY }: { scrollY: MotionValue<number> }) {
  const opacity = useTransform(scrollY, [0, 60], [0, 1]);
  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className="absolute inset-0 bg-[#faf7f2]/85 shadow-[0_8px_30px_-12px_rgba(120,20,20,0.25)] backdrop-blur-xl"
    />
  );
}

/* Barra fina de progresso do scroll (transform direto). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-primary"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
