import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE } from "./scroll-effects";
import "./passos-rail.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type PassosRailStep = {
  n: number;
  title: string;
  text: string;
  tags?: string[];
};

/* Opacidade por estado: por vir, visitada, ativa = 1 */
const UPCOMING = 0.42;
const VISITED = 0.74;
const ROLL_STAGGER = 0.05;

type DigitCol = { ch: string; glyphs?: string[]; hidden?: number; target?: number };

// O número vira uma coluna por dígito: janela de 1em sobre tira 0..d,
// que começa um glifo abaixo (vazio) e rola até d ficar visível.
function columnsFor(num: string): DigitCol[] {
  return num.split("").map((ch) => {
    if (!/[0-9]/.test(ch)) return { ch };
    const d = parseInt(ch, 10);
    const len = d + 1;
    return {
      ch,
      glyphs: Array.from({ length: len }, (_, g) => String(g)),
      hidden: 100 / len,
      target: (-d * 100) / len,
    };
  });
}

/**
 * PassosRail — linha do tempo vertical das etapas, inspirada no process-rail
 * do Annnimate Starter Pack (conta-gotas que viaja, linha que se desenha,
 * números que rolam e etapas que acendem ao serem alcançadas).
 * Todo o movimento é GSAP + ScrollTrigger, sem pin. SSR renderiza visível.
 */
export function PassosRail({ steps }: { steps: PassosRailStep[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const beadRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const stripRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const scrollToRef = useRef<((i: number) => void) | null>(null);

  const columns = useMemo(
    () => steps.map((s) => columnsFor(String(s.n).padStart(2, "0"))),
    [steps],
  );

  useLayoutEffect(() => {
    const cols = steps.map((s) => columnsFor(String(s.n).padStart(2, "0")));
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const bead = beadRef.current;
      const fill = fillRef.current;
      const items = itemRefs.current.filter((el): el is HTMLLIElement => el !== null);
      if (!container || !bead || !fill || items.length === 0) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const stripsOf = (i: number) => (stripRefs.current[i] ?? []).filter(Boolean);

      type State = {
        el: HTMLLIElement;
        btn: HTMLElement;
        strips: HTMLSpanElement[];
        hidden: number[];
        targets: number[];
        tier: number;
        rolled: boolean;
      };
      const state: State[] = items.map((el, i) => {
        const digits = cols[i]?.filter((c) => c.glyphs) ?? [];
        return {
          el,
          btn: (el.querySelector("[data-step-btn]") as HTMLElement) ?? el,
          strips: stripsOf(i) as HTMLSpanElement[],
          hidden: digits.map((c) => c.hidden ?? 0),
          targets: digits.map((c) => c.target ?? 0),
          tier: UPCOMING,
          rolled: false,
        };
      });

      let anchors: number[] = [];
      let active = -2;

      const measure = () => {
        const cbox = container.getBoundingClientRect();
        anchors = state.map((s) => {
          const num = s.el.querySelector("[data-step-num]");
          const r = (num ?? s.el).getBoundingClientRect();
          return r.top - cbox.top + r.height / 2;
        });
        // Trilho com a MESMA geometria da viagem da conta: do centro do
        // primeiro número ao centro do último. Linha e conta nunca descolam.
        const first = anchors[0] ?? 0;
        const last = anchors[anchors.length - 1] ?? first;
        if (railRef.current) {
          gsap.set(railRef.current, { top: first, height: Math.max(1, last - first) });
        }
      };

      const setTier = (s: State, opacity: number) => {
        if (s.tier === opacity) return;
        s.tier = opacity;
        if (reduced) {
          gsap.set(s.el, { opacity });
          return;
        }
        gsap.to(s.el, { opacity, duration: 0.5, ease: "power3.out", overwrite: true });
      };

      const rollNumber = (s: State, reached: boolean) => {
        if (s.strips.length === 0 || s.rolled === reached) return;
        s.rolled = reached;
        const to = (k: number) => (reached ? (s.targets[k] ?? 0) : (s.hidden[k] ?? 0));
        if (reduced) {
          s.strips.forEach((strip, k) => gsap.set(strip, { yPercent: to(k) }));
          return;
        }
        gsap.to(s.strips, {
          yPercent: (k: number) => to(k),
          duration: 0.6,
          delay: reached ? 0.16 : 0,
          ease: "power3.out",
          stagger: reached ? ROLL_STAGGER : -ROLL_STAGGER,
          overwrite: true,
        });
      };

      const setActive = (i: number) => {
        if (i === active) return;
        active = i;
        state.forEach((s, k) => {
          if (k === i) s.btn.setAttribute("aria-current", "step");
          else s.btn.removeAttribute("aria-current");
          const reached = k <= i;
          setTier(s, k === i ? 1 : reached ? VISITED : UPCOMING);
          rollNumber(s, reached);
        });
      };

      const park = () => {
        active = -2;
        state.forEach((s) => {
          gsap.killTweensOf(s.el);
          gsap.killTweensOf(s.strips);
          gsap.set(s.el, { opacity: UPCOMING });
          s.strips.forEach((strip, k) => gsap.set(strip, { yPercent: s.hidden[k] ?? 0 }));
          s.btn.removeAttribute("aria-current");
          s.tier = UPCOMING;
          s.rolled = false;
        });
      };

      const showAll = () => {
        active = state.length - 1;
        state.forEach((s) => {
          gsap.killTweensOf(s.el);
          gsap.killTweensOf(s.strips);
          gsap.set(s.el, { opacity: 1 });
          s.strips.forEach((strip, k) => gsap.set(strip, { yPercent: s.targets[k] ?? 0 }));
          s.tier = 1;
          s.rolled = true;
        });
        const last = anchors[anchors.length - 1] ?? 0;
        gsap.set(bead, { y: last });
        gsap.set(fill, { scaleY: 1 });
      };

      measure();
      gsap.set(bead, { xPercent: -50, yPercent: -50 });

      let st: ScrollTrigger | null = null;
      if (reduced) {
        showAll();
      } else {
        park();
        st = ScrollTrigger.create({
          trigger: container,
          start: "top 72%",
          end: "bottom 58%",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: () => measure(),
          onUpdate: (self) => {
            const first = anchors[0] ?? 0;
            const last = anchors[anchors.length - 1] ?? 0;
            const y = first + self.progress * Math.max(0, last - first);
            gsap.set(bead, { y });
            gsap.set(fill, { scaleY: self.progress });
            let idx = -1;
            anchors.forEach((a, k) => {
              if (y >= a - 2) idx = k;
            });
            setActive(idx);
          },
        });
      }

      scrollToRef.current = (i: number) => {
        const el = state[i]?.el;
        if (!el) return;
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      };

      const onResize = () => ScrollTrigger.refresh();
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      window.addEventListener("load", onLoad);
      if (document.fonts?.ready) {
        void document.fonts.ready.then(() => ScrollTrigger.refresh());
      }

      return () => {
        st?.kill(true);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("load", onLoad);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [steps]);

  const handleClick = useCallback((i: number) => {
    scrollToRef.current?.(i);
  }, []);

  return (
    <div ref={containerRef} className="relative mt-12">
      {/* trilho (geometria exata via JS: do primeiro ao último número) */}
      <div ref={railRef} aria-hidden className="absolute top-4 bottom-4 left-7 w-[3px] md:left-8">
        <div className="pr-rail-ghost" />
        <div
          ref={fillRef}
          className="absolute inset-0 origin-top rounded-full bg-primary"
          style={{ transform: "scaleY(0)" }}
        />
      </div>
      <span ref={beadRef} aria-hidden className="pr-bead" />

      <ol className="space-y-9 md:space-y-11">
        {steps.map((step, i) => {
          const num = String(step.n).padStart(2, "0");
          return (
            <li
              key={step.n}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="relative pl-[68px] md:pl-[88px]"
            >
              <button
                data-step-btn
                type="button"
                onClick={() => handleClick(i)}
                className="block w-full cursor-pointer rounded-2xl text-left transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <span
                  data-step-num
                  aria-hidden="true"
                  className="pr-num absolute top-0 left-0 flex h-14 w-14 items-center justify-center font-serif text-[26px] text-primary md:h-16 md:w-16 md:text-3xl"
                >
                  {columns[i]?.map((col, k) =>
                    col.glyphs ? (
                      <span key={k} className="pr-col">
                        <span
                          ref={(el) => {
                            if (!stripRefs.current[i]) stripRefs.current[i] = [];
                            stripRefs.current[i][k] = el;
                          }}
                          className="pr-strip"
                        >
                          {col.glyphs.map((g) => (
                            <span key={g} className="pr-glyph">
                              {g}
                            </span>
                          ))}
                        </span>
                      </span>
                    ) : (
                      <span key={k}>{col.ch}</span>
                    ),
                  )}
                </span>
                <span className="block text-[10px] font-bold tracking-[0.25em] text-primary uppercase">
                  Etapa {num} de {String(steps.length).padStart(2, "0")}
                </span>
                <span className="mt-1 block font-serif text-2xl">{step.title}</span>
                <span className="mt-2 block max-w-xl text-[13px] leading-relaxed text-muted-foreground">
                  {step.text}
                </span>
                {step.tags && (
                  <span className="mt-3 flex flex-wrap gap-2">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary/[0.07] px-3 py-1 text-[10px] font-bold tracking-wide text-primary uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
