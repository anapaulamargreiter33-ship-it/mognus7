import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const LINES = ["Móveis exclusivos,", "feitos à mão,", "sob medida."];

const lineVariants = {
  hidden: { y: "115%" },
  show: (i) => ({
    y: "0%",
    transition: { duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 1.05 + i * 0.13 },
  }),
};

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} id="top" data-testid="hero-section" className="relative min-h-screen overflow-hidden bg-ink">
      <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
        <img
          src="/images/real/hero_carpentry.jpg"
          alt="Móveis sob medida MOGNU'S — estante com lareira em madeira à medida"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/45 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-5 pb-14 pt-32 sm:px-8 lg:pb-20"
        style={{ opacity: fade }}
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="mb-6 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.4em] text-brass-light sm:text-xs"
        >
          <span className="h-px w-10 bg-brass" />
          Carpintaria MOGNU'S — Loulé, Algarve
        </motion.p>

        <h1 className="font-serif text-[13vw] font-light leading-[1.02] text-bone sm:text-7xl lg:text-8xl">
          {LINES.map((line, i) => (
            <span key={line} className="mask-line">
              <motion.span
                custom={i}
                variants={lineVariants}
                initial="hidden"
                animate="show"
                className={`block ${i === 2 ? "italic text-brass-light" : ""}`}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-8 max-w-md text-sm leading-relaxed text-bone/70 sm:text-base"
        >
          Da cozinha ao quarto: cozinhas, roupeiros e bibliotecas sob medida — e mobiliário pronto
          a amar: camas, colchões, sofás e mesas, cada peça assinada com a placa de latão gravada{" "}
          <em className="text-brass-light not-italic">Mognu&rsquo;s</em>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <a
            href="#colecao"
            data-testid="hero-cta-collection"
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector("#colecao");
              if (window.__lenis && el) window.__lenis.scrollTo(el, { offset: -70 });
              else if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative overflow-hidden rounded-full bg-brass px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-ink transition-transform duration-500 hover:scale-[1.03]"
          >
            <span className="relative z-10">Ver a loja</span>
            <span className="absolute inset-0 -translate-x-full bg-brass-light transition-transform duration-700 ease-out group-hover:translate-x-0" />
          </a>
          <a
            href="#sobmedida"
            data-testid="hero-cta-atelier"
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector("#sobmedida");
              if (window.__lenis && el) window.__lenis.scrollTo(el, { offset: -70 });
              else if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-full border border-bone/25 px-9 py-4 text-[11px] font-medium uppercase tracking-[0.26em] text-bone/85 transition-colors duration-500 hover:border-brass hover:text-brass-light"
          >
            Sob medida
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 1 }}
          className="mt-14 flex flex-wrap items-center gap-x-12 gap-y-6 border-t border-bone/10 pt-8"
        >
          {[
            { n: "43", l: "peças na loja" },
            { n: "100%", l: "feitas à mão" },
            { n: "Loulé", l: "Algarve · Portugal" },
          ].map((s) => (
            <div key={s.l} data-testid="hero-stat">
              <p className="font-serif text-3xl text-brass-light">{s.n}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-bone/50">{s.l}</p>
            </div>
          ))}
          <div
            data-testid="brass-plaque-badge"
            className="brass-plate ml-auto hidden rounded-sm px-5 py-2.5 md:block"
          >
            <p className="brass-plate-engraved font-serif text-sm tracking-[0.3em]">MOGNU&rsquo;S</p>
            <p className="brass-plate-engraved mt-0.5 text-[7px] uppercase tracking-[0.4em] opacity-80">
              Latão gravado · Madeira
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 lg:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="h-10 w-px bg-gradient-to-b from-transparent via-brass to-transparent"
        />
      </motion.div>
    </section>
  );
}
