import { motion } from "framer-motion";
import { CAMP_POINTS, useLang } from "@/campaign/i18n";

const scrollTo = (e, href) => {
  e.preventDefault();
  const el = document.querySelector(href);
  if (window.__lenis && el) window.__lenis.scrollTo(el, { offset: -70 });
  else if (el) el.scrollIntoView({ behavior: "smooth" });
};

export function FoundSection({ onOpenModel, selectedModel }) {
  const { t } = useLang();
  return (
    <section id="encontrou" data-testid="found-kitchen-section" className="bg-ink py-20 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
        <motion.figure
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-sm lg:col-span-6"
        >
          <img src="/images/campaign/encontrou.jpg" alt="Detalhe de cozinha MOGNU'S com placa de latão" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-5 text-[9px] uppercase tracking-[0.28em] text-bone/70">
            {t("badge.inspiration")}
          </figcaption>
        </motion.figure>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6"
        >
          <p className="mb-4 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.4em] text-brass-light">
            <span className="h-px w-10 bg-brass" />
            {t("found.eyebrow")}
          </p>
          <h2 className="font-serif text-4xl font-light leading-tight text-bone sm:text-5xl">
            {t("found.title")}
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-bone/60 sm:text-base">{t("found.text")}</p>
          <button
            data-testid="found-cta"
            onClick={() => onOpenModel(selectedModel || "")}
            className="mt-8 rounded-full bg-brass px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink transition-transform hover:scale-[1.03]"
          >
            {t("cta.model")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export function CampaignSection() {
  const { t, lang } = useLang();
  const points = CAMP_POINTS[lang] || CAMP_POINTS.pt;
  return (
    <section id="campanha" data-testid="campaign-section" className="bg-bone py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.4em] text-brass-dark">
            <span className="h-px w-10 bg-brass" />
            {t("camp.eyebrow")}
          </p>
          <h2 className="font-serif text-4xl font-light leading-tight text-ivory sm:text-5xl lg:text-6xl">
            {t("camp.title1")}
            <br />
            <span className="italic text-walnut">{t("camp.title2")}</span>
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7" data-testid="campaign-points">
          {points.map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-sm border border-line bg-white p-4"
            >
              <span className="font-serif text-xl text-brass-dark">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-[11px] font-medium uppercase leading-relaxed tracking-[0.14em] text-ivory">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="rounded-sm border border-line bg-white p-7"
            data-testid="campaign-conditions"
          >
            <h3 className="font-serif text-2xl text-ivory">{t("camp.cond.title")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-mute">{t("camp.cond.text")}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.08 }}
            className="rounded-sm border border-line bg-white p-7"
            data-testid="campaign-payment"
          >
            <h3 className="font-serif text-2xl text-ivory">{t("camp.pay.title")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-mute">{t("camp.pay.text")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const { t } = useLang();
  const steps = ["1", "2", "3", "4"];
  return (
    <section id="processo" data-testid="process-section" className="bg-ink py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl font-light leading-tight text-bone sm:text-5xl"
        >
          {t("proc.title1")}
          <br />
          <span className="italic text-brass-light">{t("proc.title2")}</span>
        </motion.h2>
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-4" data-testid="process-steps">
          {steps.map((n, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-inkline pt-6"
              data-testid={`process-step-${n}`}
            >
              <span className="font-serif text-4xl text-brass-light">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-serif text-xl text-bone">{t(`proc.${n}t`)}</h3>
              <p className="mt-2 text-xs leading-relaxed text-bone/50">{t(`proc.${n}d`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  const { t } = useLang();
  return (
    <section id="sobre" data-testid="about-section" className="bg-bone py-20 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6"
        >
          <p className="mb-4 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.4em] text-brass-dark">
            <span className="h-px w-10 bg-brass" />
            {t("about.eyebrow")}
          </p>
          <h2 className="font-serif text-4xl font-light leading-tight text-ivory sm:text-5xl">
            {t("about.title1")}
            <br />
            <span className="italic text-walnut">{t("about.title2")}</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-mute sm:text-base">{t("about.text")}</p>
          <div className="mt-7 flex flex-wrap gap-4">
            <a href="https://mognuscompany.com" target="_blank" rel="noreferrer" data-testid="about-site-link" className="rounded-full border border-walnut/40 px-7 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-walnut transition-colors hover:border-brass hover:text-brass-dark">
              {t("about.site")} ↗
            </a>
            <a href="https://www.instagram.com/mognuscompany/" target="_blank" rel="noreferrer" data-testid="about-instagram-link" className="rounded-full border border-walnut/40 px-7 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-walnut transition-colors hover:border-brass hover:text-brass-dark">
              {t("about.insta")} ↗
            </a>
          </div>
        </motion.div>
        <motion.figure
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-sm lg:col-span-6"
        >
          <img src="/images/campaign/about_carpenter.jpg" alt="Carpinteiro MOGNU'S a inspecionar porta de cozinha" loading="lazy" className="aspect-[4/3] w-full object-cover" />
        </motion.figure>
      </div>
    </section>
  );
}

export { scrollTo };
