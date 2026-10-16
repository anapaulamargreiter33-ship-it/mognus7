import { useEffect, useState } from "react";
import { LANGS, useLang } from "@/campaign/i18n";

const NAV_CTA = {
  pt: "Pedir orçamento",
  de: "Angebot anfordern",
  fr: "Demander un devis",
  es: "Solicitar presupuesto",
};

export default function CampaignNav({ onOpenModel }) {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (window.__lenis && el) window.__lenis.scrollTo(el, { offset: -70 });
    else if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: t("gal.eyebrow"), href: "#modelos" },
    { label: t("camp.eyebrow"), href: "#campanha" },
    { label: t("proc.title2"), href: "#processo" },
    { label: t("about.eyebrow"), href: "#sobre" },
  ];

  return (
    <header
      data-testid="campaign-nav"
      className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${scrolled ? "border-b border-inkline/70 bg-ink/90 backdrop-blur-md" : "bg-gradient-to-b from-ink/70 to-transparent"}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="/cozinha" onClick={(e) => scrollTo(e, "#top")} aria-label="MOGNU'S — Cozinhas" data-testid="campaign-nav-logo">
          <img src="/images/campaign/mognus-logo.png" alt="MOGNU'S — logótipo oficial" className="h-10 w-auto rounded-sm bg-bone p-1.5 sm:h-11" />
        </a>
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => scrollTo(e, l.href)}
              className="group relative text-[10px] font-medium uppercase tracking-[0.26em] text-bone/70 transition-colors hover:text-bone"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-brass transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-bone/20 p-1" data-testid="language-selector">
            {LANGS.map((l) => (
              <button
                key={l.code}
                data-testid={`lang-${l.code}`}
                onClick={() => setLang(l.code)}
                className={`rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-[0.1em] transition-colors ${
                  lang === l.code ? "bg-brass text-ink" : "text-bone/60 hover:text-bone"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            data-testid="campaign-nav-cta"
            onClick={() => onOpenModel("")}
            className="hidden rounded-full bg-brass px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink transition-transform hover:scale-[1.03] sm:block"
          >
            {NAV_CTA[lang] || "Pedir orçamento"}
          </button>
        </div>
      </div>
    </header>
  );
}
