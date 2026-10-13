import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const STATS = [
  { n: "120 h", l: "de trabalho manual por cama" },
  { n: "1905", l: "o nascimento do ícone" },
  { n: "100%", l: "materiais naturais" },
];

const reveal = {
  hidden: { opacity: 0, y: 36 },
  show: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: d },
  }),
};

function ParallaxFigure({ src, caption, className = "", testid }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  return (
    <motion.figure
      ref={ref}
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      data-testid={testid}
      className={`group relative overflow-hidden rounded-sm ${className}`}
    >
      <motion.img
        src={src}
        alt={caption}
        loading="lazy"
        style={{ y, scale: 1.12 }}
        className="h-full w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-5 text-[10px] uppercase tracking-[0.28em] text-bone/75">
        {caption}
      </figcaption>
    </motion.figure>
  );
}

export default function Craft() {
  return (
    <section id="atelier" data-testid="craftsmanship-heritage-section" className="bg-ink py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="lg:col-span-7"
          >
            <p className="mb-4 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.4em] text-brass-light">
              <span className="h-px w-10 bg-brass" />
              O Atelier
            </p>
            <h2 className="font-serif text-4xl font-light leading-tight text-bone sm:text-5xl lg:text-6xl">
              Uma aula mestre,
              <br />
              <span className="italic text-brass-light">costurada à mão.</span>
            </h2>
          </motion.div>
          <motion.div
            variants={reveal}
            custom={0.15}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex items-end lg:col-span-5"
          >
            <p className="text-sm leading-relaxed text-bone/60 sm:text-base">
              Até duas semanas de trabalho manual separam cada cama MOGNU&rsquo;S do resto do
              mundo: crina de cavalo pentheada, lã virgem em camadas generosas e molas ensacadas —
              tudo fixado à mão, ponto a ponto. E cada peça carrega a placa de latão gravada com a
              nossa marca, discreta sobre a nogueira, legível sob a lupa.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-10">
          <ParallaxFigure
            src="/images/editorial/editorial_hands.jpg"
            caption="Tufting à mão, ponto a ponto"
            className="aspect-[4/3] md:col-span-7"
            testid="craft-figure-hands"
          />
          <div className="flex flex-col gap-6 md:col-span-5 lg:gap-10">
            <ParallaxFigure
              src="/images/products/detail_border_macro.jpg"
              caption="A placa de latão: amplie e leia a marca"
              className="aspect-[4/3] md:aspect-auto md:flex-1"
              testid="craft-figure-macro"
            />
            <div className="grid grid-cols-3 gap-4 border-t border-inkline pt-8">
              {STATS.map((s) => (
                <div key={s.l} data-testid="craft-stat">
                  <p className="font-serif text-2xl text-brass-light sm:text-3xl">{s.n}</p>
                  <p className="mt-2 text-[9px] uppercase leading-relaxed tracking-[0.22em] text-bone/50">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <ParallaxFigure
            src="/images/editorial/editorial_materials.jpg"
            caption="Crina, lã e linho — só o que a natureza dá"
            className="aspect-[16/9] md:col-span-8"
            testid="craft-figure-materials"
          />
          <ParallaxFigure
            src="/images/editorial/editorial_plaque.jpg"
            caption="Latão gravado Mognu's — a assinatura da casa"
            className="aspect-[16/9] md:col-span-4"
            testid="craft-figure-plaque"
          />
        </div>
      </div>
    </section>
  );
}
