import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import Lightbox from "@/components/Lightbox";

const TABS = [
  { key: "all", label: "Tudo" },
  { key: "mattresses", label: "Colchões" },
  { key: "bed-sets", label: "Conjuntos" },
  { key: "toppers", label: "Toppers" },
  { key: "pillows", label: "Travesseiros" },
];

const SPANS = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

export default function Catalog({ products, error }) {
  const [tab, setTab] = useState("all");
  const [active, setActive] = useState(null);

  const filtered = useMemo(() => {
    if (!products) return null;
    return tab === "all" ? products : products.filter((p) => p.category_key === tab);
  }, [products, tab]);

  const counts = useMemo(() => {
    if (!products) return {};
    return products.reduce((acc, p) => {
      acc[p.category_key] = (acc[p.category_key] || 0) + 1;
      return acc;
    }, { all: products.length });
  }, [products]);

  return (
    <section id="colecao" data-testid="product-catalog-section" className="bg-bone py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="mb-4 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.4em] text-brass-dark">
              <span className="h-px w-10 bg-brass" />
              A Coleção
            </p>
            <h2 className="font-serif text-4xl font-light leading-tight text-ivory sm:text-5xl lg:text-6xl">
              Vinte e três peças,
              <br />
              <span className="italic text-walnut">uma obsessão.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-mute">
            Passe o cursor sobre cada imagem para acionar a lupa — materiais, acabamentos e a
            placa de latão gravada aparecem com nitidez.
          </p>
        </motion.div>

        <div className="mb-14 flex flex-wrap gap-2 border-b border-line pb-px" data-testid="catalog-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              data-testid={`catalog-tab-${t.key}`}
              onClick={() => setTab(t.key)}
              className={`relative px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 ${
                tab === t.key ? "text-ivory" : "text-faint hover:text-mute"
              }`}
            >
              {t.label}
              {counts[t.key] ? (
                <sup className="ml-1.5 font-serif text-[10px] text-brass-dark">{counts[t.key]}</sup>
              ) : null}
              {tab === t.key && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute inset-x-0 -bottom-px h-px bg-brass"
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          ))}
        </div>

        {error && (
          <p data-testid="catalog-error" className="py-20 text-center font-serif text-2xl text-mute">
            Não foi possível carregar a coleção. Recarregue a página.
          </p>
        )}

        {!error && filtered === null && (
          <div data-testid="catalog-loading" className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] w-full rounded-sm bg-bone2" />
                <div className="mt-4 h-4 w-2/3 bg-bone2" />
              </div>
            ))}
          </div>
        )}

        {filtered && filtered.length === 0 && (
          <p className="py-20 text-center font-serif text-2xl text-faint">Nenhuma peça nesta coleção.</p>
        )}

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 md:grid-cols-12">
          <AnimatePresence mode="popLayout">
            {filtered &&
              filtered.map((p, i) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  index={i}
                  span={SPANS[i % SPANS.length]}
                  onOpen={setActive}
                />
              ))}
          </AnimatePresence>
        </div>
      </div>

      <Lightbox product={active} onClose={() => setActive(null)} />
    </section>
  );
}
