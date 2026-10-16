import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Sprout,
  Sunrise,
  Copy,
  Instagram,
  Youtube,
  Facebook,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow, Logo, SectionBg } from "@/components/site-chrome";
import { withBase } from "@/lib/base";
import { StoriesCarousel } from "@/components/stories-carousel";
import {
  EASE,
  LoadReveal,
  ParallaxBox,
  ScrollHeader,
  ScrollReveal,
  ScrollScale,
  ScrollStagger,
  ScrollStaggerItem,
  SplitTitle,
} from "@/components/scroll-effects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Roupão da Fé — Uma história pode recomeçar" },
      {
        name: "description",
        content:
          "Iniciativa missionária de acolhimento, esperança e reconexão espiritual. Conheça, participe e contribua.",
      },
      { property: "og:title", content: "Roupão da Fé — Uma história pode recomeçar" },
      {
        property: "og:description",
        content: "Um gesto de amor pode abrir caminho para o reencontro com a fé.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const nav = ["Início", "O Projeto", "Como Participar", "Histórias", "Doar", "Contato"];
const ids = ["inicio", "projeto", "participar", "historias", "doar", "contato"];

const SYMBOLS: Array<[LucideIcon, string, string]> = [
  [Heart, "Acolhimento", "Um gesto que demonstra que aquela pessoa continua sendo lembrada."],
  [
    Sprout,
    "Esperança",
    "Uma oportunidade de reconstruir vínculos e retomar o relacionamento com a fé.",
  ],
  [
    Sunrise,
    "Recomeço",
    "Um símbolo de uma nova etapa da caminhada espiritual, respeitando o tempo de cada um.",
  ],
];

const AMOUNTS = ["R$ 25", "R$ 50", "R$ 100", "Outro valor"];

function Index() {
  const [amount, setAmount] = useState("R$ 25");

  /* Hero afunda e desvanece ao rolar (só transform+opacity, barato). */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 110]);
  const heroOpacity = useTransform(heroProgress, [0, 0.85], [1, 0]);

  return (
    <main className="relative overflow-hidden bg-[#faf7f2]">
      <div className="relative z-10">
        {/* Header */}
        <ScrollHeader className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Logo />
            <motion.nav
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
              }}
              className="hidden gap-7 text-[11px] font-semibold tracking-wide md:flex"
            >
              {nav.map((n, i) => (
                <motion.a
                  key={n}
                  href={`#${ids[i]}`}
                  variants={{
                    hidden: { opacity: 0, y: -12 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
                  }}
                  whileHover={{ y: -2 }}
                  className={i === 0 ? "text-primary" : "text-foreground/70 hover:text-primary"}
                >
                  {n}
                </motion.a>
              ))}
            </motion.nav>
            <motion.a
              href="#doar"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="btn-solid !rounded-full !px-5 !py-2.5 !text-[11px]"
            >
              Quero contribuir
            </motion.a>
          </div>
        </ScrollHeader>

        {/* Hero */}
        <section id="inicio" ref={heroRef} className="relative min-h-[45vw]">
          <SectionBg slice="hero" />
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative mx-auto max-w-6xl px-6 pt-32 pb-16 md:pt-36"
          >
            <Eyebrow>Um convite ao recomeço</Eyebrow>
            <SplitTitle
              as="h1"
              mode="load"
              delay={0.15}
              className="max-w-2xl text-6xl md:text-7xl"
              segments={[{ t: "Uma história\npode " }, { t: "recomeçar.", em: true }]}
            />
            <LoadReveal delay={0.35}>
              <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
                Um gesto de amor pode abrir caminho para o reencontro com a fé. O Roupão da Fé é uma
                iniciativa missionária de acolhimento, esperança e renovação espiritual.
              </p>
            </LoadReveal>
            <LoadReveal delay={0.45}>
              <div className="mt-9 flex flex-wrap gap-4">
                <motion.a
                  href="#projeto"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="btn-solid !px-7 !py-4 !text-sm"
                >
                  Conheça o projeto <ArrowRight size={16} />
                </motion.a>
                <motion.a
                  href="#doar"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="btn-outline !bg-transparent !px-7 !py-4 !text-sm"
                >
                  Quero contribuir
                </motion.a>
              </div>
            </LoadReveal>
            <LoadReveal delay={0.6}>
              <motion.a
                href="#projeto"
                className="mt-14 flex w-fit items-center gap-2 text-[11px] font-semibold"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="grid h-5 w-5 place-items-center rounded-full border border-primary text-primary">
                  <ChevronDown size={12} />
                </span>
                Role para descobrir
              </motion.a>
            </LoadReveal>
          </motion.div>
        </section>

        {/* 01 História */}
        <section id="projeto" className="relative min-h-[45vw]">
          <SectionBg slice="s01" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-24 pb-20 md:grid-cols-[1fr_1fr]">
            <ParallaxBox distance={36}>
              <Eyebrow n="01">A história</Eyebrow>
              <SplitTitle
                className="text-5xl md:text-6xl"
                segments={[
                  { t: "Mais do que\num roupão.\n" },
                  { t: "Um convite\npara voltar.", em: true },
                ]}
              />
              <ScrollReveal>
                <p className="mt-7 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  Idealizado por Marcos Camilo em 2011, o Roupão da Fé nasceu do desejo de alcançar
                  pessoas que se afastaram da igreja, oferecendo acolhimento, amizade e um convite
                  para uma nova oportunidade de caminhar com Cristo.
                </p>
              </ScrollReveal>
              <ScrollReveal>
                <a
                  href="#historias"
                  className="group mt-7 inline-flex items-center gap-2 text-xs font-bold underline underline-offset-4"
                >
                  Conheça a história completa
                  <ArrowRight
                    size={13}
                    className="text-primary transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </a>
              </ScrollReveal>
            </ParallaxBox>
            <div />
          </div>
        </section>

        {/* 02 Símbolo */}
        <section className="relative min-h-[45vw]">
          <SectionBg slice="s02" />
          <div className="mx-auto max-w-6xl px-6 pt-16 pb-16">
            <Eyebrow n="02">Um símbolo. Uma nova possibilidade.</Eyebrow>
            <SplitTitle
              className="max-w-2xl text-5xl md:text-6xl"
              segments={[
                { t: "Mais do que uma peça de roupa, um símbolo de " },
                { t: "esperança.", em: true },
              ]}
            />
            <ScrollStagger className="mt-12 grid gap-12 md:grid-cols-3">
              {SYMBOLS.map(([Icon, t, d], i) => (
                <ScrollStaggerItem key={t} index={i} total={SYMBOLS.length}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="group w-fit"
                  >
                    <span className="grid h-20 w-20 place-items-center rounded-2xl bg-primary/[0.06] transition-colors duration-500 group-hover:bg-primary/[0.12]">
                      <Icon className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </span>
                    <h3 className="mt-5 text-2xl">{t}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                      {d}
                    </p>
                    <span className="mt-3 block h-0.5 w-8 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
                  </motion.div>
                </ScrollStaggerItem>
              ))}
            </ScrollStagger>
          </div>
        </section>

        {/* 03 Participar */}
        <section
          id="participar"
          className="on-red relative flex min-h-[45vw] items-center bg-[#7C0B05] text-primary-foreground"
        >
          <SectionBg slice="s03" />
          <div className="mx-auto w-full max-w-4xl px-6 py-20 text-center">
            <Eyebrow n="03" light center>
              Como participar
            </Eyebrow>
            <SplitTitle
              className="text-5xl text-primary-foreground md:text-6xl"
              segments={[{ t: "Fazer parte\ncomeça com\n" }, { t: "um gesto.", em: true }]}
            />
            <ScrollReveal>
              <p className="mx-auto mt-7 max-w-lg text-[15px] leading-relaxed text-primary-foreground/75">
                O manual completo de orientação — introdução, justificativa e o passo a passo em 17
                etapas — está disponível em uma página dedicada.
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <motion.a
                href={withBase("/como-participar")}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="mt-9 inline-flex items-center gap-2 rounded-md bg-background px-6 py-3.5 text-xs font-bold text-primary"
              >
                Quero saber como participar <ArrowRight size={14} />
              </motion.a>
            </ScrollReveal>
          </div>
        </section>

        {/* 04 Histórias */}
        <section
          id="historias"
          className="relative flex min-h-[58vw] w-full flex-col justify-center"
        >
          <SectionBg slice="s04" />
          <div className="mx-auto w-full max-w-6xl px-6 pt-24 pb-12">
            <Eyebrow n="04">Histórias que inspiram</Eyebrow>
            <SplitTitle
              className="max-w-xl text-5xl md:text-6xl"
              segments={[{ t: "Cada recomeço tem sua " }, { t: "própria história.", em: true }]}
            />
            <ScrollReveal>
              <p className="mt-7 max-w-lg text-base leading-relaxed text-muted-foreground">
                São pessoas reais, experiências verdadeiras e testemunhos de esperança. Histórias de
                quem decidiu recomeçar e reencontrar seu caminho com Cristo.
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <a
                href="#"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
              >
                Ver mais histórias
                <ArrowRight
                  size={14}
                  className="text-primary transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </a>
            </ScrollReveal>
          </div>
          <StoriesCarousel />
        </section>

        {/* 05 Doar */}
        <section
          id="doar"
          className="relative mx-auto grid min-h-[45vw] w-full max-w-6xl items-start gap-12 px-6 pt-20 pb-14 md:grid-cols-[1.1fr_auto_0.9fr_1fr]"
        >
          <SectionBg slice="s05" />
          <div>
            <Eyebrow n="05">Ajude a levar esperança</Eyebrow>
            <SplitTitle
              className="text-5xl md:text-6xl"
              segments={[{ t: "Sua contribuição " }, { t: "faz a diferença.", em: true }]}
            />
            <ScrollReveal>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                Seu apoio pode ajudar na aquisição de roupões e nos materiais utilizados nas ações
                missionárias do projeto.
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <div className="mt-6 flex flex-wrap gap-2">
                {AMOUNTS.map((v) => {
                  const active = v === amount;
                  return (
                    <motion.button
                      key={v}
                      onClick={() => setAmount(v)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.94 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className={`relative rounded-md px-4 py-2 text-[11px] font-semibold transition-colors duration-300 ${
                        active
                          ? "text-primary-foreground"
                          : "border border-primary bg-transparent text-primary hover:bg-primary/10"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="amount-pill"
                          transition={{ duration: 0.45, ease: EASE }}
                          className="absolute inset-0 rounded-md bg-primary"
                        />
                      )}
                      <span className="relative z-10">{v}</span>
                    </motion.button>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>
          <ScrollScale
            axis="y"
            className="hidden w-px origin-top self-stretch bg-primary/25 md:block"
          />
          <ScrollReveal>
            <motion.div
              whileHover={{ scale: 1.04, rotate: -1 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mx-auto w-fit text-center"
            >
              <div className="mx-auto grid h-44 w-44 grid-cols-6 gap-1 rounded-xl border border-border bg-white/95 p-3 shadow-sm">
                {Array.from({ length: 36 }).map((_, i) => (
                  <span key={i} className={(i * 7) % 3 ? "bg-foreground" : ""} />
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-snug font-medium">
                QR Code Pix oficial
                <br />
                será disponibilizado aqui.
              </p>
            </motion.div>
          </ScrollReveal>
          <ScrollStagger>
            <ScrollStaggerItem index={0} total={3} y={20}>
              <p className="block text-[11px] font-bold uppercase tracking-wider">
                Chave Pix
                <span className="mt-1.5 flex items-center justify-between rounded-md bg-muted/80 px-3 py-2.5 font-normal normal-case text-muted-foreground">
                  Será disponibilizada aqui <Copy size={13} className="text-primary" />
                </span>
              </p>
            </ScrollStaggerItem>
            <ScrollStaggerItem index={1} total={3} y={20}>
              <p className="block text-[11px] font-bold uppercase tracking-wider">
                Beneficiário
                <span className="mt-1.5 block rounded-md border border-border bg-white/70 px-3 py-2.5 font-normal normal-case text-muted-foreground">
                  Nome será exibido aqui
                </span>
              </p>
            </ScrollStaggerItem>
            <ScrollStaggerItem index={2} total={3} y={16}>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                Esta é uma versão de protótipo. Os dados de pagamento serão adicionados após
                validação da equipe responsável.
              </p>
            </ScrollStaggerItem>
          </ScrollStagger>
        </section>

        {/* 06 Contato */}
        <section id="contato" className="relative flex min-h-[45vw] items-center">
          <SectionBg slice="s06" />
          <div className="relative mx-auto w-full max-w-6xl px-6 pt-20 pb-16">
            <ParallaxBox distance={30}>
              <Eyebrow n="06">Contato e participação</Eyebrow>
              <SplitTitle
                className="text-5xl md:text-6xl"
                segments={[{ t: "Vamos fazer parte\n" }, { t: "dessa missão?", em: true }]}
              />
              <ScrollReveal>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  Quer conhecer melhor o projeto, participar de uma ação ou saber como sua igreja
                  pode se envolver?
                </p>
              </ScrollReveal>
              <ScrollReveal>
                <div className="mt-9 flex flex-wrap gap-4">
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="btn-solid !px-7 !py-4 !text-sm"
                  >
                    Falar com a equipe <ArrowRight size={16} />
                  </motion.a>
                  <motion.a
                    href={withBase("/como-participar")}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="btn-outline !bg-transparent !px-7 !py-4 !text-sm"
                  >
                    Ver orientações de participação
                  </motion.a>
                </div>
              </ScrollReveal>
            </ParallaxBox>
          </div>
        </section>

        <footer className="relative mx-auto flex min-h-[20vw] w-full max-w-6xl flex-col justify-end px-6 py-8">
          <ScrollReveal y={20}>
            <div className="flex flex-wrap items-center justify-between gap-6 border-b border-border pb-8">
              <Logo />
              <nav className="flex flex-wrap gap-6 text-xs">
                {nav.map((n, i) => (
                  <motion.a
                    key={n}
                    href={`#${ids[i]}`}
                    whileHover={{ y: -2 }}
                    className="hover:text-primary"
                  >
                    {n}
                  </motion.a>
                ))}
              </nav>
              <div className="flex gap-4 text-primary">
                {[Instagram, Youtube, Facebook].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    aria-label="Rede social"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal y={12}>
            <div className="flex flex-wrap justify-between gap-4 pt-6 text-xs text-muted-foreground">
              <p>Uma iniciativa de acolhimento, esperança e renovação espiritual.</p>
              <p>Política de Privacidade &nbsp;|&nbsp; © 2025 Roupão da Fé</p>
            </div>
          </ScrollReveal>
        </footer>
      </div>
    </main>
  );
}
