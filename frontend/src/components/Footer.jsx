import { motion } from "framer-motion";
import MognusLogo from "@/components/MognusLogo";

const COLLECTION_LINKS = [
  { label: "Camas & Colchões", href: "#colecao" },
  { label: "Sofás", href: "#colecao" },
  { label: "Mesas", href: "#colecao" },
  { label: "Mobiliário", href: "#colecao" },
  { label: "Sob Medida", href: "#sobmedida" },
];

const scrollTo = (e, href) => {
  e.preventDefault();
  const el = document.querySelector(href);
  if (window.__lenis && el) window.__lenis.scrollTo(el, { offset: -70 });
  else if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  return (
    <footer id="contato" data-testid="footer" className="border-t border-inkline bg-ink pb-10 pt-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-outline select-none whitespace-nowrap text-center font-serif text-[18vw] leading-none lg:text-[13rem]"
        >
          MOGNU&rsquo;S
        </motion.p>

        <div id="marca" className="mt-16 grid grid-cols-1 gap-12 border-t border-inkline pt-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <MognusLogo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone/55">
              Carpintaria e loja de mobiliário em Loulé, Algarve. Cozinhas, roupeiros e bibliotecas
              sob medida — e camas, colchões, sofás e mesas feitos à mão.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.34em] text-brass-light">
              A Loja
            </p>
            <ul className="space-y-3">
              {COLLECTION_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={(e) => scrollTo(e, l.href)}
                    data-testid={`footer-link-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-sm text-bone/60 transition-colors hover:text-brass-light"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.34em] text-brass-light">
              Consultas
            </p>
            <p className="text-sm leading-relaxed text-bone/60">
              Defina medidas, materiais e acabamentos com a nossa equipa — orçamento sem
              compromisso.
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-bone/40">
              Estrada da Cimpor, Cabeça Alta 7 · 8100-298 Loulé
            </p>
            <a
              href="mailto:geral@mognuscompany.com"
              data-testid="footer-contact-cta"
              className="mt-6 inline-block rounded-full border border-brass/60 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.26em] text-brass-light transition-all duration-500 hover:bg-brass hover:text-ink"
            >
              Solicite um orçamento
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-inkline pt-8 text-[10px] uppercase tracking-[0.24em] text-bone/35 sm:flex-row">
          <p>© 2026 Mognus Company — MOGNU&rsquo;S · Loulé, Algarve</p>
          <p data-testid="footer-price-note">Preços em euros (€) · Loja mognuscompany.com</p>
        </div>
      </div>
    </footer>
  );
}
