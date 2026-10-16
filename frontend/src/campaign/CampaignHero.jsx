import { motion } from "framer-motion";
import { useLang } from "@/campaign/i18n";

const lineVariants = {
  hidden: { y: "115%" },
  show: (i) => ({
    y: "0%",
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 + i * 0.14 },
  }),
};

const scrollTo = (e, href) => {
  e.preventDefault();
  const el = document.querySelector(href);
  if (window.__lenis && el) window.__lenis.scrollTo(el, { offset: -70 });
  else if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function CampaignHero() {
  const { t } = useLang();
  return (
    <section data-testid="campaign-hero" className="relative min-h-screen overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <img
          src="/images/campaign/hero.jpg"
          alt="Cozinha por medida MOGNU'S com ilha central"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/50 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/55" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-5 pb-14 pt-32 sm:px-8 lg:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="mb-6 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.38em] text-brass-light sm:text-xs"
        >
          <span className="h-px w-10 bg-brass" />
          {t("hero.eyebrow")}
        </motion.p>

        <h1 className="font-serif text-[12vw] font-light leading-[1.04] text-bone sm:text-6xl lg:text-7xl">
          {["t1", "t2"].map((k, i) => (
            <span key={k} className="mask-line">
              <motion.span
                custom={i}
                variants={lineVariants}
                initial="hidden"
                animate="show"
                className={`block ${i === 1 ? "italic text-brass-light" : ""}`}
              >
                {t(`hero.${k}`)}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-7 max-w-lg text-sm leading-relaxed text-bone/75 sm:text-base"
        >
          {t("hero.sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="mt-9 flex flex-wrap items-center gap-5"
        >
          <a
            href="#modelos"
            data-testid="campaign-hero-cta"
            onClick={(e) => scrollTo(e, "#modelos")}
            className="group relative overflow-hidden rounded-full bg-brass px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-ink transition-transform duration-500 hover:scale-[1.03]"
          >
            <span className="relative z-10">{t("hero.btn")}</span>
            <span className="absolute inset-0 -translate-x-full bg-brass-light transition-transform duration-700 ease-out group-hover:translate-x-0" />
          </a>
          <span className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-bone/50">
            <span className="h-1.5 w-1.5 rotate-45 bg-brass" />
            Instagram · Facebook
          </span>
        </motion.div>
      </div>
    </section>
  );
}
