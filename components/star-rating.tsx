// Étoiles écrites à la main (SVG), sans dépendance. Texte accessible porté
// par le conteneur (role="img"), les étoiles individuelles sont décoratives.
function formatRating(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(".", ",");
}

export function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating);

  return (
    <div
      role="img"
      aria-label={`Note : ${formatRating(rating)} sur 5`}
      className="flex items-center gap-0.5"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          width="16"
          height="16"
          aria-hidden="true"
          className={index < rounded ? "fill-accent" : "fill-section"}
        >
          <path d="M10 1.5l2.472 5.008 5.528.803-4 3.9.944 5.507L10 14.75l-4.944 2.6.944-5.507-4-3.9 5.528-.803z" />
        </svg>
      ))}
    </div>
  );
}
