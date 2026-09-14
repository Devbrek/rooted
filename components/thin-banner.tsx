import Image from "next/image";

// Bandeau photo fin, même gabarit pour /panier et /commande (WIREFRAME).
export function ThinBanner({ title }: { title: string }) {
  return (
    <div className="relative flex h-48 items-center justify-center overflow-hidden">
      <Image
        src="/bandeau.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-foreground/60" />
      <h1 className="relative z-10 font-serif text-3xl tracking-wide text-background sm:text-4xl">
        {title}
      </h1>
    </div>
  );
}
