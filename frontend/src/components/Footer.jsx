import { motion } from "framer-motion";
import MognusLogo from "@/components/MognusLogo";

const COLLECTION_LINKS = [
  { label: "Colchões", href: "#colecao" },
  { label: "Conjuntos de Cama", href: "#colecao" },
  { label: "Toppers", href: "#colecao" },
  { label: "Travesseiros", href: "#colecao" },
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
              Atelier de camas e colchões de luxo. Materiais naturais, costura manual e a
              assinatura em latão gravado em cada peça.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.34em] text-brass-light">
              A Coleção
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
              Agende uma consultoria sob demanda para definir medidas, materiais e acabamentos.
            </p>
            <a
              href="mailto:atelier@mognus.com"
              data-testid="footer-contact-cta"
              className="mt-6 inline-block rounded-full border border-brass/60 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.26em] text-brass-light transition-all duration-500 hover:bg-brass hover:text-ink"
            >
              Falar com o atelier
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-inkline pt-8 text-[10px] uppercase tracking-[0.24em] text-bone/35 sm:flex-row">
          <p>© 2026 MOGNU&rsquo;S — Todos os direitos reservados</p>
          <p data-testid="footer-price-note">Preços em euros (€) · Catálogo europeu de referência</p>
        </div>
      </div>
    </footer>
  );
}
