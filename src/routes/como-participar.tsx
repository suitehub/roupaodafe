import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Flag, HeartHandshake, Phone, Quote } from "lucide-react";
import {
  EASE,
  LoadReveal,
  ScrollHeader,
  ScrollReveal,
  ScrollStagger,
  ScrollStaggerItem,
  SplitTitle,
} from "@/components/scroll-effects";
import { Eyebrow, Logo } from "@/components/site-chrome";
import fundo2 from "@/assets/fundo2.jpg";

export const Route = createFileRoute("/como-participar")({
  head: () => ({
    meta: [
      { title: "Como participar — Roupão da Fé" },
      {
        name: "description",
        content:
          "Manual de orientação do Projeto Roupão da Fé: introdução, justificativa e o passo a passo em 17 etapas.",
      },
      { property: "og:title", content: "Como participar — Roupão da Fé" },
      {
        property: "og:description",
        content: "Manual de orientação: introdução, justificativa e passo a passo em 17 etapas.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ComoParticipar,
});

type Step = { n: number; title: string; text: string; tags?: string[] };

const STEPS: Step[] = [
  {
    n: 1,
    title: "Lançamento no concílio",
    text: "O projeto será lançado no concílio de pastores e anciãos no início do ano.",
    tags: ["Concílio Pastoral", "Concílio de Anciãos"],
  },
  {
    n: 2,
    title: "Oração de dedicação",
    text: "Oração de dedicação em favor dos roupões que serão utilizados para a salvação de pessoas. O único propósito do roupão é colaborar para a salvação. Tenha certeza que Deus fará grandes maravilhas, pois Ele é o maior interessado nessa missão.",
    tags: ["Apresentação e dedicação"],
  },
  {
    n: 3,
    title: "Liste os amigos",
    text: "Prepare uma lista de todos os interessados e ex-adventistas junto à secretaria da igreja e procure levantar informações a respeito deles.",
  },
  {
    n: 4,
    title: "Jornada de oração",
    text: "Realize uma jornada de oração ou vigília, buscando o poder do Espírito Santo para tocar no coração dos amigos interessados e ex-adventistas.",
    tags: ["Vigília de consagração", "Consagração no distrito"],
  },
  {
    n: 5,
    title: "Apoio da comissão",
    text: "Apresente o projeto do roupão da fé para a comissão da igreja (é necessário o apoio de toda a liderança).",
  },
  {
    n: 6,
    title: "Alvo e encomenda",
    text: "Defina o alvo de batismo de cada igreja e faça a encomenda dos roupões de batismo para cada igreja. Procure o seu pastor distrital para a encomenda dos roupões.",
  },
  {
    n: 7,
    title: "Consagração na igreja",
    text: "Faça a consagração dos roupões de batismo no sábado de manhã (presença do pastor, anciãos e líderes). Cada um pode segurar um roupão à frente da igreja no momento da oração de consagração.",
  },
  {
    n: 8,
    title: "Embalagem surpresa",
    text: "Coloque os roupões em uma linda embalagem. Procure não colocar em embalagens transparentes, pois a entrega do roupão é surpresa. Você pode usar a sua criatividade para preparar uma linda embalagem. O importante é preparar com esmero esse presente de amor.",
    tags: ["Opções sugestivas de embalagens"],
  },
  {
    n: 9,
    title: "Capacitação",
    text: "Realize encontros de capacitação em prol das visitações, apelos e entregas dos roupões da fé.",
  },
  {
    n: 10,
    title: "Equipe de visitação",
    text: "Organize líderes missionários e que ganham pessoas para Jesus para que façam parte da equipe de visitação. Separe-os em duplas. No momento das visitações, é uma oportunidade de falar menos e ouvir mais. Em sua maioria, amigos ex-adventistas em especial não possuem dúvidas acerca das doutrinas — às vezes é uma mágoa, rancor, ressentimento ou dificuldade. Durante a conversa amigável, procure identificar a causa da apostasia.",
  },
  {
    n: 11,
    title: "Semana de oração",
    text: "Planeje uma semana de oração ou série de conferências para convidar todos esses amigos para esse encontro especial.",
  },
  {
    n: 12,
    title: "Bom pregador",
    text: "Escolha um bom pregador que será um instrumento nas mãos de Deus para levar pessoas à decisão.",
  },
  {
    n: 13,
    title: "Estratégias de convite",
    text: "Organize as estratégias para convidar esses amigos que vocês estão orando para participarem da semana ou conferência.",
  },
  {
    n: 14,
    title: "Jovens e desbravadores",
    text: "Procure apoio dos jovens e desbravadores para realizarem serenatas ou outras maneiras criativas para convidarem todos esses amigos.",
  },
  {
    n: 15,
    title: "Todos os departamentos",
    text: "Comece a semana de oração com a participação de todos os departamentos da igreja. Se organizem para uma semana especial e inesquecível pensando nesses amigos interessados.",
  },
  {
    n: 16,
    title: "Celebração batismal",
    text: "Prepare uma linda celebração batismal com todos os amigos usando o roupão da fé.",
  },
  {
    n: 17,
    title: "Batizado vira missionário",
    text: "A pessoa que usou o roupão da fé no dia do batismo deverá ser motivada e instruída para orar e trabalhar em favor de um amigo especial. O roupão que ela usou será entregue para essa pessoa — a ideia é que o roupão seja um presente de amor. Enquanto houver roupão, haverá oportunidades de salvação.",
  },
];

function PageHeader() {
  return (
    <ScrollHeader className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo href="/" />
        <motion.a
          href="/"
          whileHover={{ x: -3 }}
          className="inline-flex items-center gap-2 text-[11px] font-bold text-foreground/70 hover:text-primary"
        >
          <ArrowLeft size={14} /> Voltar ao início
        </motion.a>
      </div>
    </ScrollHeader>
  );
}

function ComoParticipar() {
  return (
    <main className="relative overflow-hidden bg-[#faf7f2]">
      {/* Fundo claro com ondas e traços vermelhos em tela cheia */}
      <img
        src={fundo2}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-fill"
      />
      {/* Véu branco (20%) sobre o fundo, só nesta página */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-white/20" />
      <div className="relative z-10">
        <PageHeader />

        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-6 pt-32 pb-14 md:pt-36">
          <Eyebrow>Manual de orientação</Eyebrow>
          <SplitTitle
            as="h1"
            mode="load"
            delay={0.15}
            className="max-w-2xl text-5xl md:text-6xl"
            segments={[{ t: "Como participar do\n" }, { t: "Roupão da Fé.", em: true }]}
          />
          <LoadReveal delay={0.35}>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Uma ferramenta para somar forças com pastores, líderes e membros no propósito de
              salvar pessoas — na sua região, distrito, igreja, comunidade e vida.
            </p>
          </LoadReveal>
          <LoadReveal delay={0.45}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <motion.a
                href="#passo-a-passo"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="btn-solid !text-xs"
              >
                <BookOpen size={15} /> Começar pelo passo 1
              </motion.a>
              <motion.a
                href="tel:+5511987612710"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="btn-outline !bg-transparent !text-xs"
              >
                <Phone size={15} /> (11) 98761-2710
              </motion.a>
            </div>
          </LoadReveal>
          <LoadReveal delay={0.55}>
            <div className="mt-10 flex flex-wrap gap-2 text-[11px] font-semibold text-muted-foreground">
              {["Introdução", "Justificativa", "17 passos", "Missão contínua"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-primary/25 bg-white/60 px-4 py-1.5"
                >
                  {chip}
                </span>
              ))}
            </div>
          </LoadReveal>
        </section>

        {/* Introdução */}
        <section className="mx-auto max-w-3xl px-6 py-14">
          <Eyebrow n="01">Introdução</Eyebrow>
          <SplitTitle
            className="text-4xl md:text-5xl"
            segments={[{ t: "O nosso tempo é\n" }, { t: "hoje, agora.", em: true }]}
          />
          <ScrollReveal>
            <div className="mt-10 rounded-2xl bg-primary p-8 text-primary-foreground md:p-10">
              <Quote size={28} className="opacity-60" />
              <p className="mt-4 font-serif text-xl leading-relaxed italic md:text-2xl">
                “O cristão que não se envolve com a salvação de pessoas é como um bombeiro que corre
                para um prédio em chamas preocupado com o quadro torto na parede.”
              </p>
              <p className="mt-4 text-xs font-bold tracking-[0.2em] uppercase opacity-70">
                Dwight Moody
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                O mundo está sendo consumido pelas chamas do pecado, injustiça e maldade; as pessoas
                estão gritando por socorro e a cada dia, milhares perdem a vida e a salvação. Temos
                condições de ajudá-las, pois devemos proclamar o evangelho que liberta e transforma.
              </p>
              <p>
                Somos como um bombeiro que de alguma forma pode ajudar a amenizar as chamas e salvar
                vidas, mas muitas vezes estamos preocupados com os “quadros tortos na parede”.
                Focamos apenas nos detalhes periféricos e que não têm relação com a salvação eterna.
              </p>
              <p>
                “Teremos a eternidade para celebrar com os amigos que serão salvos, mas temos apenas
                esta vida para alcançá-los.” É verdade que o evangelho é eterno, mas não temos a
                eternidade para pregá-lo.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Justificativa */}
        <section className="mx-auto max-w-3xl px-6 py-14">
          <Eyebrow n="02">Justificativa</Eyebrow>
          <SplitTitle
            className="text-4xl md:text-5xl"
            segments={[{ t: "A materialização\n" }, { t: "de um sonho.", em: true }]}
          />
          <ScrollReveal>
            <div className="mt-10 rounded-2xl border border-primary/20 bg-white/70 p-8 text-center md:p-10">
              <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
                Vidas alcançadas pelo projeto
              </p>
              <p className="mt-2 font-serif text-6xl text-primary md:text-7xl">38 mil</p>
              <p className="mt-2 text-sm text-muted-foreground">
                pessoas levadas à decisão pelo batismo em todo o Brasil.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Cada amigo interessado e ex-adventista poderá ter a oportunidade de receber esse
                presente de amor e sentir possível a realização do sonho de se entregar a Jesus.
                Sonhar é bom, realizar é melhor.
              </p>
              <p>
                Que tal orar e trabalhar em favor da salvação das pessoas ao seu redor? Pense no seu
                esposo, esposa, filhos, sobrinhos, netos, amigos e vizinhos — não seria uma grande
                alegria recebê-los na igreja para se prepararem para a volta de Jesus?
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="mt-8 rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-10">
              <p className="font-serif text-xl leading-relaxed italic md:text-2xl">
                “Você não pode voltar e mudar o começo, mas pode recomeçar hoje e mudar o final.”
              </p>
              <p className="mt-4 text-xs font-bold tracking-[0.2em] uppercase opacity-70">
                C. S. Lewis
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Passo a passo */}
        <section id="passo-a-passo" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-14">
          <Eyebrow n="03">Passo a passo</Eyebrow>
          <SplitTitle
            className="text-4xl md:text-5xl"
            segments={[{ t: "17 etapas para\n" }, { t: "salvar pessoas.", em: true }]}
          />
          <ScrollReveal>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Do lançamento no concílio à celebração batismal — e além: cada batizado se torna um
              missionário.
            </p>
          </ScrollReveal>
          <StepsTimeline />

          <ScrollReveal>
            <div className="mt-10 rounded-2xl bg-primary p-8 text-primary-foreground md:p-10">
              <p className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase opacity-70">
                <Flag size={14} /> Importante
              </p>
              <p className="mt-3 font-serif text-xl leading-relaxed italic md:text-2xl">
                O recém-converso deverá ser acompanhado e treinado para ser um missionário também.
              </p>
              <p className="mt-4 flex items-start gap-2 text-[13px] leading-relaxed opacity-85">
                <HeartHandshake size={16} className="mt-0.5 shrink-0" />
                Enquanto houver roupão, haverá oportunidades de salvação.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Contato */}
        <section className="mx-auto max-w-3xl px-6 py-14">
          <Eyebrow n="04">Contato</Eyebrow>
          <SplitTitle
            className="text-4xl md:text-5xl"
            segments={[{ t: "Vamos fazer parte\n" }, { t: "dessa missão?", em: true }]}
          />
          <ScrollReveal>
            <div className="mt-8 flex flex-wrap gap-3">
              <motion.a
                href="tel:+5511987612710"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="btn-solid !text-xs"
              >
                <Phone size={15} /> (11) 98761-2710
              </motion.a>
              <motion.a
                href="/"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="btn-outline !bg-transparent !text-xs"
              >
                <ArrowLeft size={15} /> Voltar ao início
              </motion.a>
            </div>
          </ScrollReveal>
        </section>

        <footer className="mx-auto flex w-full max-w-6xl flex-col justify-end px-6 py-8">
          <ScrollReveal y={12}>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
              <Logo href="/" />
              <p>Manual de orientação — Projeto Roupão da Fé.</p>
              <a
                href="/"
                className="inline-flex items-center gap-2 font-semibold hover:text-primary"
              >
                Voltar ao início <ArrowRight size={13} />
              </a>
            </div>
          </ScrollReveal>
        </footer>
      </div>
    </main>
  );
}

/*
 * Linha do tempo das 17 etapas: trilho com preenchimento ligado ao scroll
 * + cartões que entram em cascata. Só transform/opacity (leve).
 */
function StepsTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.55"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative mt-12">
      {/* trilho */}
      <div aria-hidden className="absolute top-3 bottom-3 left-[27px] w-[3px] md:left-[31px]">
        <div className="absolute inset-0 rounded-full bg-primary/15" />
        <motion.div
          style={{ scaleY: fill }}
          className="absolute inset-0 origin-top rounded-full bg-primary"
        />
      </div>

      <ScrollStagger className="space-y-5">
        {STEPS.map((step) => {
          const num = String(step.n).padStart(2, "0");
          return (
            <ScrollStaggerItem key={step.n} index={step.n - 1} total={STEPS.length} y={40}>
              <div className="relative pl-[68px] md:pl-[88px]">
                <motion.span
                  whileHover={{ scale: 1.1, rotate: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="absolute top-0 left-0 grid h-14 w-14 place-items-center rounded-full border-2 border-primary/20 bg-white font-serif text-lg text-primary shadow-md md:h-16 md:w-16"
                >
                  {num}
                </motion.span>
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="relative overflow-hidden rounded-3xl border border-border bg-white/85 p-6 shadow-[0_15px_45px_-25px_rgba(120,20,20,0.45)] backdrop-blur-sm md:p-7"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-7 -right-1 font-serif text-[6.5rem] leading-none text-primary/[0.07] select-none"
                  >
                    {num}
                  </span>
                  <p className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">
                    Etapa {num} de 17
                  </p>
                  <h3 className="mt-1 font-serif text-2xl">{step.title}</h3>
                  <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                  {step.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/[0.07] px-3 py-1 text-[10px] font-bold tracking-wide text-primary uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.article>
              </div>
            </ScrollStaggerItem>
          );
        })}
      </ScrollStagger>
    </div>
  );
}
