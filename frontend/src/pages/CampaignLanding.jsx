import { useEffect, useRef, useState } from "react";
import { LangProvider, useLang } from "@/campaign/i18n";
import CampaignNav from "@/campaign/CampaignNav";
import CampaignHero from "@/campaign/CampaignHero";
import KitchenGallery from "@/campaign/KitchenGallery";
import KitchenLightbox from "@/campaign/KitchenLightbox";
import LeadFormSection from "@/campaign/LeadForm";
import CookieConsent from "@/campaign/CookieConsent";
import CampaignFooter from "@/campaign/CampaignFooter";
import { AboutSection, AdminSection, FinalCtaSection, FoundSection, PrivacySection, ProcessSection } from "@/campaign/CampaignSections";

function LandingInner() {
  const { lang } = useLang();
  const [selectedModel, setSelectedModel] = useState("");
  const [zoomModel, setZoomModel] = useState(null);
  const sourceRef = useRef("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm_source = params.get("utm_source") || "";
    const utm_medium = params.get("utm_medium") || "";
    const utm_campaign = params.get("utm_campaign") || "";
    sourceRef.current = [utm_source, utm_medium, utm_campaign].filter(Boolean).join(" / ");
    sessionStorage.setItem("mognus_source", sourceRef.current);
    if (!sessionStorage.getItem("mognus_sid")) {
      sessionStorage.setItem("mognus_sid", `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);
    }
    if (!sessionStorage.getItem("mognus_visit_sent")) {
      sessionStorage.setItem("mognus_visit_sent", "1");
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/campaign/visit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionStorage.getItem("mognus_sid"), language: lang, utm_source, utm_medium, utm_campaign, referrer: document.referrer || "" }),
      }).catch(() => {});
    }
  }, [lang]);

  useEffect(() => {
    if (window.location.hostname.split(".")[0] !== "cozinhas") return;
    document.title = "MOGNU'S | Cozinhas por medida — Campanha 15 dias úteis";
    const link = document.querySelector("link[rel='canonical']") || document.createElement("link");
    link.rel = "canonical";
    link.href = "https://cozinhas.mognuscompany.com/";
    document.head.appendChild(link);
  }, []);

  const goToForm = (modelLabel) => {
    setSelectedModel(modelLabel || "");
    const el = document.getElementById("pedido");
    if (el) {
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -40 });
      else el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main id="top" className="bg-bone text-ivory antialiased">
      <CampaignNav onOpenModel={goToForm} />
      <CampaignHero />
      <KitchenGallery onZoom={setZoomModel} />
      <FoundSection onOpenModel={goToForm} selectedModel={selectedModel} />
      <ProcessSection />
      <AboutSection />
      <LeadFormSection selectedModel={selectedModel} />
      <FinalCtaSection />
      <AdminSection />
      <PrivacySection />
      <CampaignFooter onOpenModel={goToForm} />
      <KitchenLightbox
        model={zoomModel}
        onClose={() => setZoomModel(null)}
        onWantMore={(label) => {
          setZoomModel(null);
          goToForm(label);
        }}
      />
      <CookieConsent />
    </main>
  );
}

export default function CampaignLanding() {
  return (
    <LangProvider>
      <LandingInner />
    </LangProvider>
  );
}
