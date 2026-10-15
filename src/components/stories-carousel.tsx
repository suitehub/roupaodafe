import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EASE } from "./scroll-effects";
import { cn } from "@/lib/utils";

/*
 * Carrossel das histórias (estudo Skiper54, adaptado ao tema do site):
 * - Slides exatamente 16:9 (aspect-video) = mesma proporção das fotos:
 *   `object-cover` não corta nada.
 * - Slide ativo em destaque; inativos apenas atenuados (sem recorte).
 * - Autoplay com pausa na interação; dots + setas no estilo da home.
 */

const modules = import.meta.glob<string>("../assets/Imagem*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

function numOf(path: string) {
  const m = path.match(/Imagem(\d+)\.jpg$/);
  return m ? parseInt(m[1] ?? "0", 10) : 0;
}

const IMAGES: string[] = Object.keys(modules)
  .sort((a, b) => numOf(a) - numOf(b))
  .map((k) => modules[k] as string);

export function StoriesCarousel() {
  const [emblaRef, api] = useEmblaCarousel({ loop: true, align: "center", slidesToScroll: 1 }, [
    Autoplay({ delay: 3200, stopOnInteraction: true, stopOnMouseEnter: true }),
  ]);
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  if (IMAGES.length === 0) return null;

  return (
    <div className="relative mx-auto w-full max-w-6xl px-6 pb-14">
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex w-full">
            {IMAGES.map((src, index) => {
              const active = current === index;
              return (
                <div
                  key={src}
                  className="w-full shrink-0 grow-0 basis-[88%] px-2 sm:basis-[68%] md:basis-[52%] lg:basis-[44%] xl:basis-[38%]"
                >
                  <motion.div
                    initial={false}
                    animate={{ opacity: active ? 1 : 0.5, scale: active ? 1 : 0.93 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="aspect-video w-full overflow-hidden rounded-3xl bg-white/50 shadow-[0_25px_60px_-25px_rgba(120,20,20,0.4)]"
                  >
                    <img
                      src={src}
                      alt={`História do projeto Roupão da Fé ${index + 1}`}
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                  <div className="flex h-9 items-start justify-center pt-2">
                    <AnimatePresence mode="wait">
                      {active && (
                        <motion.p
                          key={`cap-${index}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="text-center text-xs font-semibold tracking-wide text-muted-foreground"
                        >
                          História {index + 1} — um recomeço
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          aria-label="Anterior"
          onClick={() => api?.scrollPrev()}
          className="absolute top-[38%] -left-1 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-card text-primary shadow-lg transition-transform hover:scale-110 md:left-0"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          aria-label="Próximo"
          onClick={() => api?.scrollNext()}
          className="absolute top-[38%] -right-1 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-card text-primary shadow-lg transition-transform hover:scale-110 md:right-0"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-4 flex w-full items-center justify-center gap-2">
        {IMAGES.map((src, index) => (
          <button
            key={src}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Ir para a história ${index + 1}`}
            className={cn(
              "h-2 cursor-pointer rounded-full transition-all duration-400",
              current === index ? "w-7 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/50",
            )}
          />
        ))}
      </div>
    </div>
  );
}
