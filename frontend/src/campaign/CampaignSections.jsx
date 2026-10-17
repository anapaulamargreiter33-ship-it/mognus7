import { motion } from "framer-motion";
import { WHATSAPP_URL, useLang } from "@/campaign/i18n";

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
          <h2 className="font-serif text-4xl font-light leading-tight text-bone sm:text-5xl">
            {t("found.title")}
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-bone/60 sm:text-base">{t("found.text")}</p>
          <button
            data-testid="found-cta"
            onClick={() => onOpenModel(selectedModel || "")}
            className="mt-8 rounded-full bg-brass px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink transition-transform hover:scale-[1.03]"
          >
            {t("found.cta")} →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const { t } = useLang();
  const steps = ["1", "2", "3"];
  return (
    <section id="processo" data-testid="process-section" className="bg-bone py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.4em] text-brass-dark">
            <span className="h-px w-10 bg-brass" />
            {t("proc.eyebrow")}
          </p>
          <h2 className="font-serif text-4xl font-light leading-tight text-ivory sm:text-5xl lg:text-6xl">
            {t("proc.title1")}
            <br />
            <span className="italic text-walnut">{t("proc.title2")}</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3" data-testid="process-steps">
              {steps.map((n, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="border-t border-line pt-6"
                  data-testid={`process-step-${n}`}
                >
                  <span className="font-serif text-4xl text-brass-dark">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 font-serif text-xl text-ivory">{t(`proc.${n}t`)}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-mute">{t(`proc.${n}d`)}</p>
                </motion.div>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              data-testid="process-note"
              className="mt-10 border-l-2 border-brass pl-6 text-sm leading-relaxed text-mute"
            >
              {t("proc.note")}
            </motion.p>
          </div>
          <motion.figure
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-sm lg:col-span-5"
            data-testid="process-image"
          >
            <img
              src="/images/campaign/contacto-interior.webp"
              alt="Interior de cozinha contemporânea MOGNU'S"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-full"
            />
          </motion.figure>
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  const { t } = useLang();
  return (
    <section id="sobre" data-testid="about-section" className="bg-ink py-20 lg:py-32">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src="/images/campaign/mognus-logo-oficial.png"
            alt="MOGNU'S — logótipo oficial"
            className="mx-auto mb-8 h-16 w-auto"
            data-testid="about-logo"
          />
          <h2 className="font-serif text-4xl font-light leading-tight text-bone sm:text-5xl lg:text-6xl">
            {t("about.title1")}
            <br />
            <span className="italic text-brass-light">{t("about.title2")}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-bone/65 sm:text-base">{t("about.text")}</p>
          <a
            href="https://mognuscompany.com/"
            target="_blank"
            rel="noreferrer"
            data-testid="about-cta"
            className="mt-9 inline-block rounded-full border border-brass/60 px-9 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-brass-light transition-all duration-500 hover:bg-brass hover:text-ink"
          >
            {t("about.cta")} ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  const { t } = useLang();
  return (
    <section id="final" data-testid="final-cta-section" className="relative overflow-hidden bg-ink py-20 lg:py-32">
      <div className="absolute inset-0 opacity-20">
        <img src="/images/campaign/encontrou.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/45" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 flex items-center justify-center gap-4 text-[10px] font-medium uppercase tracking-[0.4em] text-brass-light">
            <span className="h-px w-10 bg-brass" />
            {t("final.eyebrow")}
            <span className="h-px w-10 bg-brass" />
          </p>
          <h2 className="font-serif text-5xl font-light leading-tight text-bone sm:text-6xl">
            {t("final.title")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-bone/65 sm:text-base">{t("final.text")}</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            data-testid="final-whatsapp"
            className="group relative mt-9 inline-block overflow-hidden rounded-full bg-brass px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-ink transition-transform duration-500 hover:scale-[1.03]"
          >
            <span className="relative z-10">{t("final.cta")} →</span>
            <span className="absolute inset-0 -translate-x-full bg-brass-light transition-transform duration-700 ease-out group-hover:translate-x-0" />
          </a>
          <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-bone/40">{t("final.note")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16"
          data-testid="campaign-video-block"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-brass-light">{t("video.label")}</p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-bone/50">{t("video.text")}</p>
          <video
            data-testid="campaign-video"
            controls
            playsInline
            preload="none"
            poster="/images/campaign/hero.jpg"
            src="/videos/video_anuncio.mp4"
            className="mt-6 aspect-video w-full rounded-sm border border-inkline bg-ink2 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]"
          />
        </motion.div>
      </div>
    </section>
  );
}

export function AdminSection() {
  const { t } = useLang();
  return (
    <section data-testid="admin-section" className="border-y border-line bg-bone2 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 sm:px-8 lg:flex-row lg:items-center">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-[0.34em] text-faint">{t("admin.eyebrow")}</p>
          <h3 className="mt-2 font-serif text-2xl font-light text-ivory">{t("admin.title")}</h3>
          <p className="mt-1 text-xs leading-relaxed text-mute">{t("admin.text")}</p>
        </div>
        <a
          href="/cozinha/admin"
          data-testid="admin-panel-link"
          className="rounded-full border border-walnut/30 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.24em] text-walnut transition-all duration-500 hover:border-brass hover:text-brass-dark"
        >
          {t("admin.cta")} →
        </a>
      </div>
    </section>
  );
}

export function PrivacySection() {
  const { t } = useLang();
  return (
    <section id="privacidade" data-testid="privacy-section" className="bg-bone2 pb-16">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h3 className="font-serif text-2xl font-light text-ivory">{t("priv.title")}</h3>
        <p className="mt-3 text-xs leading-relaxed text-mute">{t("priv.text")}</p>
        <a
          href="/cozinha/privacidade"
          data-testid="privacy-link"
          className="mt-4 inline-block border-b border-brass pb-0.5 text-[11px] font-medium uppercase tracking-[0.2em] text-brass-dark transition-colors hover:text-brass"
        >
          {t("priv.link")} →
        </a>
      </div>
    </section>
  );
}

export { scrollTo };
