import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MODELS, useLang } from "@/campaign/i18n";

const WHATSAPP = "https://wa.me/351930636700";

function formatApiErrorDetail(detail) {
  if (detail == null) return null;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => (e && e.msg) || "").filter(Boolean).join(" ");
  if (detail && detail.msg) return detail.msg;
  return String(detail);
}

function buildMessage(form) {
  const lines = [
    `Olá! Sou ${form.name}, vi a campanha da MOGNU'S e quero pedir um orçamento para uma cozinha por medida.`,
    "",
    `Estilo de cozinha: ${form.model || "Outro estilo / à minha escolha"}`,
    `Localidade: ${form.location || "—"}`,
    `Contacto: ${form.phone} · ${form.email}`,
  ];
  if (form.message.trim()) lines.push("", form.message.trim());
  return lines.join("\n");
}

export default function LeadFormSection({ selectedModel }) {
  const { t, lang } = useLang();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    model: "",
    message: "",
    consent: false,
    marketing: false,
    website: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [whatsUrl, setWhatsUrl] = useState("");

  useEffect(() => {
    if (selectedModel) setForm((f) => ({ ...f, model: selectedModel }));
  }, [selectedModel]);

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
      const url = `${WHATSAPP}?text=${encodeURIComponent(buildMessage(form))}`;
      setWhatsUrl(url);
      window.open(url, "_blank", "noopener");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || t("f.error"));
    }
  };

  const inputCls =
    "w-full rounded-sm border border-line bg-white px-4 py-3 text-sm text-ivory outline-none transition-colors placeholder:text-faint focus:border-brass";

  return (
    <section id="pedido" data-testid="lead-form-section" className="bg-bone py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 max-w-2xl"
        >
          <p className="mb-4 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.4em] text-brass-dark">
            <span className="h-px w-10 bg-brass" />
            {t("form.eyebrow")}
          </p>
          <h2 className="font-serif text-4xl font-light leading-tight text-ivory sm:text-5xl lg:text-6xl">
            {t("form.title")}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-mute sm:text-base">{t("form.sub")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl rounded-md border border-line bg-white p-6 shadow-[0_30px_70px_-40px_rgba(22,19,17,0.35)] sm:p-10"
        >
          {status === "success" ? (
            <div className="py-10 text-center" data-testid="lead-form-success">
              <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brass/15">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-brass-dark" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h3 className="font-serif text-3xl font-light text-ivory">{t("f.success")}</h3>
              <a
                href={whatsUrl || WHATSAPP}
                target="_blank"
                rel="noreferrer"
                data-testid="lead-success-whatsapp"
                className="mt-7 inline-block rounded-full bg-brass px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink transition-transform hover:scale-[1.03]"
              >
                {t("f.whats")} →
              </a>
            </div>
          ) : (
            <>
              <p className="mb-6 inline-block rounded-full border border-brass/40 bg-brass/10 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-brass-dark" data-testid="lead-form-legend">
                {t("form.legend")}
              </p>
              <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
                <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-mute" htmlFor="lead-name">{t("f.name")} *</label>
                  <input id="lead-name" required value={form.name} onChange={set("name")} data-testid="lead-field-name" placeholder={t("f.name")} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-mute" htmlFor="lead-email">{t("f.email")} *</label>
                  <input id="lead-email" required type="email" value={form.email} onChange={set("email")} data-testid="lead-field-email" placeholder={t("f.email")} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-mute" htmlFor="lead-phone">{t("f.phone")} *</label>
                  <input id="lead-phone" required value={form.phone} onChange={set("phone")} data-testid="lead-field-phone" placeholder={t("f.phone")} className={inputCls} inputMode="tel" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-mute" htmlFor="lead-location">{t("f.loc")} *</label>
                  <input id="lead-location" required value={form.location} onChange={set("location")} data-testid="lead-field-location" placeholder={t("f.loc")} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-mute" htmlFor="lead-model">{t("form.style")}</label>
                  <select id="lead-model" value={form.model} onChange={set("model")} data-testid="lead-field-model" className={`${inputCls}`}>
                    <option value="">{t("form.style.any")}</option>
                    {MODELS.map((m) => (
                      <option key={m.key} value={t(`model.${m.key}.name`)}>
                        {t(`model.${m.key}.name`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-mute" htmlFor="lead-message">{t("form.project")}</label>
                  <textarea id="lead-message" value={form.message} onChange={set("message")} data-testid="lead-field-message" placeholder={t("f.ph.msg")} rows={3} className={`${inputCls} resize-none`} />
                </div>

                <label className="flex items-start gap-3 sm:col-span-2" data-testid="lead-consent-row">
                  <input type="checkbox" required checked={form.consent} onChange={set("consent")} data-testid="lead-field-consent" className="mt-1 h-4 w-4 shrink-0 accent-[#C59B27]" />
                  <span className="text-[11px] leading-relaxed text-mute">{t("f.consent")}</span>
                </label>
                <label className="flex items-start gap-3 sm:col-span-2" data-testid="lead-marketing-row">
                  <input type="checkbox" checked={form.marketing} onChange={set("marketing")} data-testid="lead-field-marketing" className="mt-1 h-4 w-4 shrink-0 accent-[#C59B27]" />
                  <span className="text-[11px] leading-relaxed text-mute">{t("f.marketing")}</span>
                </label>

                <p className="text-[11px] leading-relaxed text-faint sm:col-span-2" data-testid="lead-rgpd-text">
                  <a href="/cozinha/privacidade" data-testid="lead-privacy-link" className="text-brass-dark underline underline-offset-2">
                    {t("priv.link")}
                  </a>
                </p>

                {status === "error" && (
                  <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 sm:col-span-2" data-testid="lead-form-error">
                    {error || t("f.error")}
                  </p>
                )}

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    data-testid="lead-form-submit"
                    disabled={status === "sending"}
                    className="group relative w-full overflow-hidden rounded-full bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-bone transition-all hover:scale-[1.01] disabled:opacity-60 sm:w-auto"
                  >
                    <span className="relative z-10">{status === "sending" ? t("f.sending") : `${t("f.submit")} →`}</span>
                  </button>
                  <p className="mt-3 text-[10px] leading-relaxed text-faint" data-testid="lead-form-note">
                    {t("f.note")}
                  </p>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
