import Image from "next/image";

export function HomeHero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <Image
        src="/hero.jpg"
        alt="Forêt dans la brume du matin"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Calque sombre pour la lisibilité du texte, par-dessus la photo. */}
      <div aria-hidden="true" className="absolute inset-0 bg-foreground/60" />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-6 px-6 text-center">
        <h1 className="font-serif text-4xl tracking-wide text-background sm:text-5xl">
          Un peu de nature chez soi
        </h1>
        <p className="font-sans text-lg text-background/90">
          Des objets simples, choisis pour ralentir le quotidien.
        </p>
        <a
          href="#catalogue"
          className="mt-2 bg-accent px-8 py-3 text-sm tracking-wide text-foreground uppercase transition-colors hover:bg-secondary hover:text-background"
        >
          Découvrir la collection
        </a>
      </div>
    </section>
  );
}
