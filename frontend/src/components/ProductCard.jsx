import { useState } from "react";
import { motion } from "framer-motion";

const ZOOM = 2.4;

export const formatPrice = (priceEur) => {
  if (!priceEur) return "Sob consulta";
  const cents = priceEur % 1 !== 0;
  return (
    priceEur.toLocaleString("pt-BR", {
      minimumFractionDigits: cents ? 2 : 0,
      maximumFractionDigits: cents ? 2 : 0,
    }) + " €"
  );
};

export default function ProductCard({ product, span, index, onOpen }) {
  const [lens, setLens] = useState({ on: false, x: 50, y: 50 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setLens({
      on: true,
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <motion.article
      layout
      data-testid={`product-card-${product.slug}`}
      className={`${span} group`}
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.08 }}
    >
      <div
        className="img-zoom-cursor vignette relative aspect-[4/5] overflow-hidden rounded-sm bg-ink2"
        data-testid={`product-image-frame-${product.slug}`}
        onMouseMove={onMove}
        onMouseLeave={() => setLens((s) => ({ ...s, on: false }))}
        onClick={() => onOpen(product)}
      >
        <img
          src={product.image}
          alt={`${product.name} — ${product.subtitle}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1.2s] ease-lux group-hover:scale-[1.045]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-ink/10 opacity-80" />

        {product.badge && (
          <span
            data-testid={`product-badge-${product.slug}`}
            className="absolute left-4 top-4 rounded-full border border-brass-light/40 bg-ink/60 px-4 py-1.5 text-[9px] font-medium uppercase tracking-[0.28em] text-brass-light backdrop-blur-sm"
          >
            {product.badge}
          </span>
        )}

        <div
          data-testid={`product-magnifier-lens-${product.slug}`}
          className={`pointer-events-none absolute hidden h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brass-light/70 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(22,19,17,0.6)] transition-opacity duration-300 md:block ${
            lens.on ? "opacity-100" : "opacity-0"
          }`}
          style={{
            left: `${lens.x}%`,
            top: `${lens.y}%`,
            backgroundImage: `url(${product.image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${ZOOM * 100}% ${ZOOM * 100}%`,
            backgroundPosition: `${lens.x}% ${lens.y}%`,
          }}
        />

        <button
          data-testid={`product-zoom-button-${product.slug}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpen(product);
          }}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-bone/30 bg-ink/55 px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.26em] text-bone opacity-0 backdrop-blur-md transition-all duration-500 hover:border-brass hover:text-brass-light group-hover:opacity-100 md:bottom-5"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5M8 11h6m-3-3v6" strokeLinecap="round" />
          </svg>
          Ampliar
        </button>
      </div>

      <div className="flex items-start justify-between gap-4 pt-5">
        <div>
          <h3 className="font-serif text-2xl font-light leading-tight text-ivory">
            {product.name}
            {product.subtitle && <span className="italic text-walnut/80"> — {product.subtitle}</span>}
          </h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-faint">{product.category}</p>
        </div>
        <div className="shrink-0 text-right" data-testid={`product-price-${product.slug}`}>
          <p className="font-serif text-xl text-brass-dark">{formatPrice(product.price_eur)}</p>
          <p className="mt-0.5 text-[9px] uppercase tracking-[0.24em] text-faint">
            {product.price_eur ? "a partir de" : "sob consulta"}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
