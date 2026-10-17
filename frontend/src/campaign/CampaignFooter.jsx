import { motion } from "framer-motion";
import { useLang } from "@/campaign/i18n";
import { scrollTo } from "@/campaign/CampaignSections";

export default function CampaignFooter({ onOpenModel }) {
  const { t } = useLang();
  return (
    <footer id="contactos" data-testid="campaign-footer" className="border-t border-inkline bg-ink pb-10 pt-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <img src="/images/campaign/mognus-logo-oficial.png" alt="MOGNU'S — logótipo oficial" className="h-14 w-auto" data-testid="footer-official-logo" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-bone/55">{t("footer.tagline")}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-bone/40">{t("footer.tagline2")}</p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-brass-light/80">{t("footer.campaign")}</p>
            <button
              data-testid="footer-cta"
              onClick={() => onOpenModel("")}
              className="mt-6 rounded-full border border-brass/60 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.24em] text-brass-light transition-all duration-500 hover:bg-brass hover:text-ink"
            >
              {t("cta.model")}
            </button>
          </div>
          <div className="md:col-span-4">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.34em] text-brass-light">{t("footer.contact")}</p>
            <ul className="space-y-3 text-sm text-bone/60">
              <li>MOGNU'S LDA</li>
              <li>Estrada de Vale Judeu 8 · 8100-298 Loulé · Portugal</li>
              <li>
                <a href="tel:+351930636700" data-testid="footer-phone" className="transition-colors hover:text-brass-light">+351 930 636 700</a>
                {" · "}
                <a href="https://wa.me/351930636700" target="_blank" rel="noreferrer" data-testid="footer-whatsapp" className="transition-colors hover:text-brass-light">WhatsApp</a>
              </li>
              <li><a href="mailto:geral@mognuscompany.com" data-testid="footer-email" className="transition-colors hover:text-brass-light">geral@mognuscompany.com</a></li>
              <li>
                <a href="https://maps.google.com/?q=Mognus+Company,+Estrada+de+Vale+Judeu+8,+8100-298+Loul%C3%A9" target="_blank" rel="noreferrer" data-testid="footer-maps" className="text-brass-light underline underline-offset-2">
                  {t("footer.maps")} ↗
                </a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.34em] text-brass-light">{t("footer.follow")}</p>
            <ul className="space-y-3 text-sm text-bone/60">
              <li><a href="https://mognuscompany.com" target="_blank" rel="noreferrer" data-testid="footer-site" className="transition-colors hover:text-brass-light">mognuscompany.com ↗</a></li>
              <li><a href="https://www.instagram.com/mognuscompany/" target="_blank" rel="noreferrer" data-testid="footer-instagram" className="transition-colors hover:text-brass-light">Instagram ↗</a></li>
              <li><a href="/cozinha/privacidade" data-testid="footer-privacy" className="transition-colors hover:text-brass-light">{t("footer.privacy")}</a></li>
              <li><a href="/cozinha/cookies" data-testid="footer-cookies" className="transition-colors hover:text-brass-light">{t("footer.cookies")}</a></li>
              <li><a href="https://www.livroreclamacoes.pt/" target="_blank" rel="noreferrer" data-testid="footer-livro" className="transition-colors hover:text-brass-light">{t("footer.livro")} ↗</a></li>
              <li><a href="/cozinha/admin" data-testid="footer-admin" className="text-bone/30 transition-colors hover:text-brass-light">Admin</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-inkline pt-8 text-[10px] uppercase tracking-[0.24em] text-bone/35 sm:flex-row">
          <p>{t("footer.rights")}</p>
          <button data-testid="footer-back-top" onClick={(e) => scrollTo(e, "#top")} className="transition-colors hover:text-brass-light">
            ↑ Topo
          </button>
        </div>
      </div>
    </footer>
  );
}
