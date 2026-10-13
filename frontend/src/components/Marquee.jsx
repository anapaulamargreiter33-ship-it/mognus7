const ITEMS = [
  "Madeira maciça",
  "Sob medida ao milímetro",
  "Cozinhas",
  "Roupeiros",
  "Camas",
  "Colchões",
  "Sofás",
  "Mesas",
  "Loulé · Algarve",
];

export default function Marquee() {
  return (
    <div
      data-testid="editorial-marquee"
      className="group relative overflow-hidden border-y border-inkline bg-ink py-6"
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
            {ITEMS.map((item) => (
              <span key={`${half}-${item}`} className="flex items-center">
                <span className="whitespace-nowrap px-8 font-serif text-lg italic text-bone/80 sm:text-xl">
                  {item}
                </span>
                <span className="h-1.5 w-1.5 rotate-45 bg-brass" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
