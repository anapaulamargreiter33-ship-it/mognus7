import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import Home from "@/pages/Home";
import ErrorBoundary from "@/components/ErrorBoundary";
import CampaignLanding from "@/pages/CampaignLanding";
import CampaignPolicies from "@/pages/CampaignPolicies";
import AdminLogin from "@/pages/AdminLogin";
import AdminPanel from "@/pages/AdminPanel";

function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cozinha" element={<CampaignLanding />} />
          <Route path="/cozinha/privacidade" element={<CampaignPolicies page="privacy" />} />
          <Route path="/cozinha/cookies" element={<CampaignPolicies page="cookies" />} />
          <Route path="/cozinha/admin" element={<AdminLogin />} />
          <Route path="/cozinha/admin/painel" element={<AdminPanel />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
