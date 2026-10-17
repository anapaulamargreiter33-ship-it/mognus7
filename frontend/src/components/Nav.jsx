import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MognusLogo from "@/components/MognusLogo";

const LINKS = [
  { label: "A Loja", href: "#colecao" },
  { label: "Sob Medida", href: "#sobmedida" },
  { label: "A Marca", href: "#marca" },
  { label: "Contato", href: "#contato" },
];

const scrollTo = (e, href) => {
  e.preventDefault();
  const el = document.querySelector(href);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -70 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        data-testid="nav"
        className={`fixed inset-x-0 top-0 z-[70] transition-all duration-500 ${
          scrolled ? "border-b border-inkline/70 bg-ink/85 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" onClick={(e) => scrollTo(e, "#top")} data-testid="nav-logo" aria-label="MOGNU'S — início">
            <img src="/images/campaign/mognus-logo-oficial.png" alt="MOGNU'S" className="h-11 w-auto sm:h-12" />
          </a>
          <nav className="hidden items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => scrollTo(e, l.href)}
                data-testid={`nav-link-${l.href.slice(1)}`}
                className="group relative text-[11px] font-medium uppercase tracking-[0.28em] text-bone/70 transition-colors hover:text-bone"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-brass transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="#contato"
              onClick={(e) => scrollTo(e, "#contato")}
              data-testid="nav-cta"
              className="hidden rounded-full border border-brass/60 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-brass-light transition-all duration-500 hover:bg-brass hover:text-ink md:block"
            >
              Consultoria
            </a>
            <button
              data-testid="nav-menu-button"
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
              aria-label="Abrir menu"
            >
              <span className="h-px w-6 bg-bone" />
              <span className="h-px w-6 bg-brass" />
              <span className="h-px w-6 bg-bone" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="nav-mobile-menu"
            className="fixed inset-0 z-[90] flex flex-col bg-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <img src="/images/campaign/mognus-logo-oficial.png" alt="MOGNU'S" className="h-10 w-auto" />
              <button
                data-testid="nav-menu-close"
                onClick={() => setOpen(false)}
                className="text-[11px] uppercase tracking-[0.3em] text-bone/70"
                aria-label="Fechar menu"
              >
                Fechar
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-start justify-center gap-2 px-8">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    scrollTo(e, l.href);
                    setOpen(false);
                  }}
                  className="font-serif text-5xl text-bone/90"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
