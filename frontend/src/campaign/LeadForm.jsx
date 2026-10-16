import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MODELS, useLang } from "@/campaign/i18n";

const WHATSAPP = "https://wa.me/351930636700";

function formatApiErrorDetail(detail) {
  if (detail == null) return null;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => (e && e.msg) || "").filter(Boolean).join(" ");
  if (detail && detail.msg) return detail.msg;
  return String(detail);
}

export default function LeadForm({ model, onClose }) {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: "", phone: "", email: "", location: "", model: model || "", message: "", consent: false, website: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    setForm((f) => ({ ...f, model: model || "" }));
    setStatus("idle");
    setError(null);
  }, [model]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);
    try {
      const source = sessionStorage.getItem("mognus_source") || "";
      const session_id = sessionStorage.getItem("mognus_sid") || "";
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/campaign/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language: lang, source, session_id }),
      });
      if (!res.ok) throw new Error(formatApiErrorDetail((await res.json())?.detail));
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || t("f.error"));
    }
  };

  const inputCls =
    "w-full rounded-sm border border-line bg-white px-4 py-3 text-sm text-ivory outline-none transition-colors placeholder:text-faint focus:border-brass";

  return (
    <AnimatePresence>
      {model !== null && (
        <motion.div
          data-testid="lead-form-modal"
          className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-ink/95 p-4 backdrop-blur-md sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative my-8 w-full max-w-xl rounded-md bg-bone p-6 shadow-2xl sm:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              data-testid="lead-form-close"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-line text-mute transition-colors hover:border-brass hover:text-brass-dark"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" fill="none">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            {status === "success" ? (
              <div className="py-10 text-center" data-testid="lead-form-success">
                <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brass/15">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 text-brass-dark" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="font-serif text-3xl text-ivory">{t("f.success")}</h3>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                  <a href={WHATSAPP} target="_blank" rel="noreferrer" data-testid="lead-success-whatsapp" className="rounded-full bg-brass px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink">
                    {t("f.whats")}
                  </a>
                  <button onClick={onClose} className="rounded-full border border-line px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-mute">
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-3xl font-light text-ivory">{t("form.title")}</h3>
                {form.model ? (
                  <p className="mt-2 inline-block rounded-full border border-brass/50 bg-brass/10 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-brass-dark" data-testid="lead-form-model">
                    {t("form.model")}: {form.model}
                  </p>
                ) : null}

                <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
                  <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                  <input required value={form.name} onChange={set("name")} data-testid="lead-field-name" placeholder={t("f.name")} className={inputCls} />
                  <input required value={form.phone} onChange={set("phone")} data-testid="lead-field-phone" placeholder={t("f.phone")} className={inputCls} inputMode="tel" />
                  <input required type="email" value={form.email} onChange={set("email")} data-testid="lead-field-email" placeholder={t("f.email")} className={inputCls} />
                  <input value={form.location} onChange={set("location")} data-testid="lead-field-location" placeholder={t("f.loc")} className={inputCls} />
                  <select value={form.model} onChange={set("model")} data-testid="lead-field-model" className={`${inputCls} sm:col-span-2`}>
                    <option value="">{t("form.model.any")}</option>
                    {MODELS.map((m) => (
                      <option key={m.key} value={t(`model.${m.key}.name`)}>
                        {t(`model.${m.key}.name`)}
                      </option>
                    ))}
                  </select>
                  <textarea value={form.message} onChange={set("message")} data-testid="lead-field-message" placeholder={t("f.msg")} rows={3} className={`${inputCls} sm:col-span-2 resize-none`} />

                  <label className="flex items-start gap-3 sm:col-span-2" data-testid="lead-consent-row">
                    <input type="checkbox" checked={form.consent} onChange={set("consent")} data-testid="lead-field-consent" className="mt-1 h-4 w-4 shrink-0 accent-[#C59B27]" />
                    <span className="text-[11px] leading-relaxed text-mute">{t("f.consent")}</span>
                  </label>

                  <p className="text-[11px] leading-relaxed text-faint sm:col-span-2" data-testid="lead-rgpd-text">
                    {t("f.rgpd.pre")}
                    <a href="/cozinha/privacidade" data-testid="lead-privacy-link" className="text-brass-dark underline underline-offset-2">
                      {t("f.rgpd.link")}
                    </a>
                    .
                  </p>

                  {status === "error" && (
                    <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 sm:col-span-2" data-testid="lead-form-error">
                      {error || t("f.error")}
                    </p>
                  )}

                  <button
                    type="submit"
                    data-testid="lead-form-submit"
                    disabled={status === "sending"}
                    className="rounded-full bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-bone transition-all hover:bg-ink2 disabled:opacity-60 sm:col-span-2"
                  >
                    {status === "sending" ? t("f.sending") : t("f.submit")}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
