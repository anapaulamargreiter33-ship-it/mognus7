import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LangProvider, useLang } from "@/campaign/i18n";
import CampaignNav from "@/campaign/CampaignNav";
import CampaignHero from "@/campaign/CampaignHero";
import KitchenGallery from "@/campaign/KitchenGallery";
import KitchenLightbox from "@/campaign/KitchenLightbox";
import LeadForm from "@/campaign/LeadForm";
import CookieConsent, { readConsent } from "@/campaign/CookieConsent";
import CampaignFooter from "@/campaign/CampaignFooter";
import { CampaignSection, ContactoSection, FoundSection, HistoriaSection, PorqueSection, ProcessSection } from "@/campaign/CampaignSections";

function LandingInner() {
  const { lang } = useLang();
  const [formModel, setFormModel] = useState(null); // null = fechado; string = aberto
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

  const openForm = (modelLabel) => {
    if (modelLabel) setSelectedModel(modelLabel);
    setFormModel(modelLabel ?? "");
  };

  return (
    <main id="top" className="bg-bone text-ivory antialiased">
      <CampaignNav onOpenModel={openForm} />
      <CampaignHero />
      <KitchenGallery onOpenModel={openForm} onZoom={setZoomModel} />
      <FoundSection onOpenModel={openForm} selectedModel={selectedModel} />
      <CampaignSection />
      <ProcessSection />
      <PorqueSection />
      <HistoriaSection />
      <ContactoSection onOpenModel={openForm} />
      <CampaignFooter onOpenModel={openForm} />
      <KitchenLightbox model={zoomModel} onClose={() => setZoomModel(null)} onWantMore={(label) => { setZoomModel(null); openForm(label); }} />
      <LeadForm model={formModel} onClose={() => setFormModel(null)} />
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
