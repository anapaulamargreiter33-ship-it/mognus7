export const MognusMark = ({ className = "h-9 w-9" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="30" stroke="#C59B27" strokeWidth="2" />
    <circle cx="32" cy="32" r="24.5" stroke="#8C6B16" strokeWidth="0.8" />
    <path
      d="M18 44V21l14 15 14-15v23"
      stroke="#DFBA62"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function MognusLogo({ className = "", markClass = "h-9 w-9", tone = "light" }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <MognusMark className={markClass} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif text-xl tracking-[0.22em] ${
            tone === "light" ? "text-bone" : "text-ivory"
          }`}
        >
          MOGNU&rsquo;S
        </span>
        <span
          className={`mt-1 text-[9px] font-medium uppercase tracking-[0.34em] ${
            tone === "light" ? "text-brass-light/80" : "text-brass-dark"
          }`}
        >
          Carpintaria
        </span>
      </span>
    </span>
  );
}
