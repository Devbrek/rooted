// Icônes écrites à la main (SVG, pas de bibliothèque ajoutée), génériques
// pour ne reproduire le logo d'aucun réseau réel. Ni lien ni bouton : aucun
// compte fictif ne pointe vers quoi que ce soit (chantier R).
function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z" />
    </svg>
  );
}

function BubbleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 5h16v11H8l-4 4V5Z" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7l1.5-2.5h5L16 7" />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  );
}

const SOCIAL_ICONS = [
  { label: "Réseau social fictif — actualités", Icon: GlobeIcon },
  { label: "Réseau social fictif — messages", Icon: BubbleIcon },
  { label: "Réseau social fictif — photos", Icon: CameraIcon },
];

export function SocialIcons() {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs tracking-wide text-foreground/60 uppercase">
        Réseaux sociaux fictifs
      </p>
      <ul className="flex gap-4">
        {SOCIAL_ICONS.map(({ label, Icon }) => (
          <li key={label}>
            <span
              role="img"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center border border-accent/30 text-foreground/70 transition-colors hover:border-secondary hover:bg-background hover:text-secondary"
            >
              <Icon />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
