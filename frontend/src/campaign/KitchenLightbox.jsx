import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MODELS, useLang } from "@/campaign/i18n";

export default function KitchenLightbox({ model, onClose, onWantMore }) {
  const { t } = useLang();

  useEffect(() => {
    if (!model) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/campaign/model-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: model.key, session_id: sessionStorage.getItem("mognus_sid") || "" }),
    }).catch(() => {});
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [model, onClose]);

  return (
    <AnimatePresence>
      {model && (
        <motion.div
          data-testid="kitchen-lightbox"
          className="fixed inset-0 z-[100] flex flex-col bg-ink/97 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <div className="flex items-center justify-between border-b border-inkline px-5 py-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl text-bone sm:text-2xl">
              <span className="text-brass-light">{model.id}</span> — {t(`model.${model.key}.name`)}
            </h3>
            <button
              data-testid="kitchen-lightbox-close"
              onClick={onClose}
              aria-label="Fechar"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/20 text-bone/80 transition-colors hover:border-brass hover:text-brass-light"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" fill="none">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-hidden px-4 py-6" onClick={(e) => e.stopPropagation()}>
            <motion.img
              key={model.key}
              src={model.img}
              alt={`${t(`model.${model.key}.name`)} — MOGNU'S`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-full max-w-full rounded-sm object-contain shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]"
            />
          </div>
          <div
            className="flex flex-col items-center justify-between gap-4 border-t border-inkline px-5 py-4 sm:flex-row sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="max-w-lg text-center text-xs leading-relaxed text-bone/55 sm:text-left">
              {t(`model.${model.key}.desc`)} · {t("badge.inspiration")}.
            </p>
            <button
              data-testid="kitchen-lightbox-cta"
              onClick={() => onWantMore(t(`model.${model.key}.name`))}
              className="rounded-full bg-brass px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink transition-transform hover:scale-[1.03]"
            >
              {t("cta.model")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
