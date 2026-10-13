import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MognusMark } from "@/components/MognusLogo";
import { formatPrice } from "@/components/ProductCard";

const LEVELS = [1, 1.75, 3];

export default function Lightbox({ product, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [showMacro, setShowMacro] = useState(false);
  const [bounds, setBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const wrapRef = useRef(null);

  useEffect(() => {
    setZoom(1);
    setShowMacro(false);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const measure = () => {
      const el = wrapRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      setBounds({
        left: (-(zoom - 1) / 2) * width,
        right: ((zoom - 1) / 2) * width,
        top: (-(zoom - 1) / 2) * height,
        bottom: ((zoom - 1) / 2) * height,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [zoom, product, showMacro]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=")
        setZoom((z) => LEVELS[Math.min(LEVELS.indexOf(z) + 1, LEVELS.length - 1)]);
      if (e.key === "-") setZoom((z) => LEVELS[Math.max(LEVELS.indexOf(z) - 1, 0)]);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  const image = showMacro && product?.macro_image ? product.macro_image : product?.image;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          data-testid="product-magnifier-modal"
          className="fixed inset-0 z-[100] flex flex-col bg-ink/97 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <div
            className="flex items-center justify-between border-b border-inkline px-5 py-4 sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <MognusMark className="h-8 w-8" />
              <div>
                <h3 className="font-serif text-lg text-bone sm:text-xl">
                  {product.name} <span className="italic text-brass-light">— {product.subtitle}</span>
                </h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-faint">
                  {product.category} · {formatPrice(product.price_eur)}
                </p>
              </div>
            </div>
            <button
              data-testid="lightbox-close"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/20 text-bone/80 transition-colors hover:border-brass hover:text-brass-light"
              aria-label="Fechar ampliação"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" fill="none">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div
            ref={wrapRef}
            className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-6 sm:px-10"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              key={`${product.slug}-${showMacro}-${zoom}`}
              src={image}
              alt={`${product.name} ampliado`}
              data-testid="lightbox-image"
              drag={zoom > 1}
              dragElastic={0.12}
              dragMomentum={false}
              dragConstraints={bounds}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: zoom }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className={`max-h-full max-w-full rounded-sm object-contain shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)] ${
                zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""
              }`}
            />
            <p className="pointer-events-none absolute bottom-3 left-1/2 w-full max-w-[85%] -translate-x-1/2 text-center text-[9px] uppercase leading-relaxed tracking-[0.3em] text-bone/40 sm:w-auto sm:max-w-none">
              {zoom > 1 ? "Arraste para explorar" : "Amplie para ler a placa de latão Mognu's"}
            </p>
          </div>

          <div
            className="flex items-center justify-center gap-3 border-t border-inkline px-5 py-4 sm:justify-between sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            {product.macro_image && (
              <button
                data-testid="lightbox-macro-toggle"
                onClick={() => {
                  setShowMacro((s) => !s);
                  setZoom(1);
                }}
                className={`rounded-full border px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.24em] transition-colors ${
                  showMacro
                    ? "border-brass bg-brass text-ink"
                    : "border-bone/25 text-bone/80 hover:border-brass hover:text-brass-light"
                }`}
              >
                {showMacro ? "Ver produto" : "Ver placa de latão"}
              </button>
            )}
            <div className="flex items-center gap-2" data-testid="lightbox-zoom-controls">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  data-testid={`lightbox-zoom-${l}x`}
                  onClick={() => setZoom(l)}
                  className={`h-10 w-10 rounded-full border text-[11px] transition-colors ${
                    zoom === l
                      ? "border-brass bg-brass font-semibold text-ink"
                      : "border-bone/25 text-bone/70 hover:border-brass-light hover:text-brass-light"
                  }`}
                >
                  {l}×
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
