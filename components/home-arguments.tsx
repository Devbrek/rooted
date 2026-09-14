// Icônes écrites à la main (validé avec l'utilisateur : pas de bibliothèque
// d'icônes ajoutée). Traits simples, couleur via currentColor + jetons de
// thème, cohérentes avec le ton sobre de la direction artistique.

function LeafIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-10 w-10 text-secondary"
      aria-hidden="true"
    >
      <path d="M12 21c-4-1-7-5-7-10 0-3 2-6 7-8 5 2 7 5 7 8 0 5-3 9-7 10Z" />
      <path d="M12 21V9" />
    </svg>
  );
}

function WorkshopIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-10 w-10 text-secondary"
      aria-hidden="true"
    >
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function ParcelIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-10 w-10 text-secondary"
      aria-hidden="true"
    >
      <rect x="4" y="8" width="16" height="12" rx="1" />
      <path d="M4 8 12 4l8 4" />
      <path d="M12 4v16" />
    </svg>
  );
}

const ARGUMENTS = [
  {
    title: "Matières naturelles",
    description:
      "Bois, coton, cire végétale : des matériaux simples, choisis pour leur origine naturelle.",
    Icon: LeafIcon,
  },
  {
    title: "Fabrication responsable",
    description:
      "De petites séries, pensées pour limiter le superflu plutôt que produire en masse.",
    Icon: WorkshopIcon,
  },
  {
    title: "Livraison soignée",
    description:
      "Chaque commande est emballée avec soin, pour qu'elle arrive intacte.",
    Icon: ParcelIcon,
  },
];

export function HomeArguments() {
  return (
    <section className="bg-section px-6 py-20">
      <ul className="mx-auto grid max-w-4xl gap-12 sm:grid-cols-3">
        {ARGUMENTS.map(({ title, description, Icon }) => (
          <li
            key={title}
            className="flex flex-col items-center gap-4 text-center"
          >
            <Icon />
            <h3 className="font-serif text-lg tracking-wide text-foreground uppercase">
              {title}
            </h3>
            <p className="font-sans text-sm text-foreground/80">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
