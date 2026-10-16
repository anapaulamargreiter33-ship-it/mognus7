import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/campaign/i18n";

export const readConsent = () => {
  try {
    return JSON.parse(localStorage.getItem("mognus_cookie_consent") || "null");
  } catch {
    return null;
  }
};

export default function CookieConsent() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, ads: false });

  useEffect(() => {
    const consent = readConsent();
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
    applyConsent(consent);
  }, []);

  const applyConsent = (consent) => {
    if (consent.ads) loadMetaPixel();
  };

  const save = (data) => {
    localStorage.setItem("mognus_cookie_consent", JSON.stringify({ essential: true, ...data, at: new Date().toISOString() }));
    setVisible(false);
    applyConsent(data);
  };

  const acceptAll = () => save({ analytics: true, ads: true });
  const rejectAll = () => save({ analytics: false, ads: false });
  const savePrefs = () => save(prefs);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-testid="cookie-banner"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[120] mx-auto max-w-2xl rounded-md border border-inkline bg-ink/95 p-6 shadow-2xl backdrop-blur-md sm:bottom-6"
          role="dialog"
          aria-live="polite"
        >
          <h3 className="font-serif text-xl text-bone">{t("cookie.title")}</h3>
          <p className="mt-2 text-xs leading-relaxed text-bone/60">
            {t("cookie.msg")}
            <a href="/cozinha/cookies" data-testid="cookie-policy-link" className="text-brass-light underline underline-offset-2">
              {t("cookie.policy")}
            </a>
            .
          </p>

          {configuring && (
            <div className="mt-4 space-y-3 rounded-sm border border-inkline bg-ink2/60 p-4" data-testid="cookie-preferences">
              <label className="flex items-center justify-between text-xs text-bone/70">
                <span>{t("cookie.essential")}</span>
                <span className="rounded-full bg-brass/20 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-brass-light">ON</span>
              </label>
              <label className="flex items-center justify-between text-xs text-bone/70">
                <span>{t("cookie.analytics")}</span>
                <input type="checkbox" checked={prefs.analytics} onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))} data-testid="cookie-toggle-analytics" className="h-4 w-4 accent-[#C59B27]" />
              </label>
              <label className="flex items-center justify-between text-xs text-bone/70">
                <span>{t("cookie.ads")}</span>
                <input type="checkbox" checked={prefs.ads} onChange={(e) => setPrefs((p) => ({ ...p, ads: e.target.checked }))} data-testid="cookie-toggle-ads" className="h-4 w-4 accent-[#C59B27]" />
              </label>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3" data-testid="cookie-actions">
            {configuring ? (
              <button data-testid="cookie-save-prefs" onClick={savePrefs} className="rounded-full bg-brass px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink">
                {t("cookie.save")}
              </button>
            ) : (
              <button data-testid="cookie-accept-all" onClick={acceptAll} className="rounded-full bg-brass px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink">
                {t("cookie.accept")}
              </button>
            )}
            <button data-testid="cookie-reject" onClick={rejectAll} className="rounded-full border border-bone/25 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-bone/80 hover:border-brass hover:text-brass-light">
              {t("cookie.reject")}
            </button>
            <button data-testid="cookie-configure" onClick={() => setConfiguring((c) => !c)} className="rounded-full border border-transparent px-6 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-bone/50 hover:text-bone">
              {t("cookie.config")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function loadMetaPixel() {
  const PIXEL_ID = window._META_PIXEL_ID;
  if (!PIXEL_ID || window.fbq) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  window.fbq = window.fbq || function () { window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments); };
  window.fbq.queue = window.fbq.queue || [];
  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}
