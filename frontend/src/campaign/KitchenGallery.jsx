import { motion } from "framer-motion";
import { MODELS, useLang } from "@/campaign/i18n";

export default function KitchenGallery({ onOpenModel, onZoom }) {
  const { t } = useLang();

  const scrollBy = (dir) => {
    const track = document.getElementById("kitchen-track");
    if (track) track.scrollBy({ left: dir * track.clientWidth * 0.75, behavior: "smooth" });
  };

  return (
    <section id="modelos" data-testid="kitchen-gallery" className="bg-bone py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="mb-4 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.4em] text-brass-dark">
              <span className="h-px w-10 bg-brass" />
              {t("gal.eyebrow")}
            </p>
            <h2 className="font-serif text-4xl font-light leading-tight text-ivory sm:text-5xl lg:text-6xl">
              {t("gal.title1")}
              <br />
              <span className="italic text-walnut">{t("gal.title2")}</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="hidden max-w-xs text-xs leading-relaxed text-mute md:block">{t("gal.hint")}</p>
            <div className="hidden gap-2 md:flex">
              <button
                data-testid="gallery-arrow-left"
                onClick={() => scrollBy(-1)}
                aria-label="Anterior"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-walnut transition-colors hover:border-brass hover:text-brass-dark"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                data-testid="gallery-arrow-right"
                onClick={() => scrollBy(1)}
                aria-label="Seguinte"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-walnut transition-colors hover:border-brass hover:text-brass-dark"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative">
        <div
          id="kitchen-track"
          data-testid="kitchen-track"
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {MODELS.map((m, i) => (
            <motion.article
              key={m.key}
              data-testid={`kitchen-card-${m.key}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
              className="group w-[86vw] shrink-0 snap-center sm:w-[520px] lg:w-[600px]"
            >
              <div className="img-zoom-cursor relative aspect-[4/3] overflow-hidden rounded-sm bg-ink2 vignette">
                <img
                  src={m.img}
                  alt={`${t(`model.${m.key}.name`)} — cozinha por medida MOGNU'S`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-lux group-hover:scale-[1.04]"
                />
                <span className="absolute left-4 top-4 rounded-full border border-bone/25 bg-ink/55 px-4 py-1.5 text-[9px] font-medium uppercase tracking-[0.26em] text-bone/85 backdrop-blur-sm">
                  {t("badge.inspiration")}
                </span>
                <span className="absolute right-4 top-4 font-serif text-3xl text-bone/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  {m.id}
                </span>
                <button
                  data-testid={`kitchen-zoom-${m.key}`}
                  onClick={() => onZoom(m)}
                  className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-bone/30 bg-ink/55 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.24em] text-bone opacity-0 backdrop-blur-md transition-all duration-500 hover:border-brass hover:text-brass-light group-hover:opacity-100"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5M8 11h6m-3-3v6" strokeLinecap="round" />
                  </svg>
                  {t("zoom")}
                </button>
              </div>
              <div className="pt-5">
                <h3 className="font-serif text-2xl font-light text-ivory">
                  <span className="text-brass-dark">{m.id}</span> — {t(`model.${m.key}.name`)}
                </h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-mute">{t(`model.${m.key}.desc`)}</p>
                <button
                  data-testid={`kitchen-cta-${m.key}`}
                  onClick={() => onOpenModel(t(`model.${m.key}.name`))}
                  className="mt-4 inline-flex items-center gap-2 border-b border-brass pb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark transition-colors hover:text-brass"
                >
                  {t("cta.model")}
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
