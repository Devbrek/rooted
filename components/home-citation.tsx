import Image from "next/image";

export function HomeCitation() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Photo purement décorative : le contenu porté est la citation. */}
      <Image src="/citation.jpg" alt="" fill sizes="100vw" className="object-cover" />
      <div aria-hidden="true" className="absolute inset-0 bg-foreground/60" />

      <blockquote className="relative z-10 max-w-2xl px-6 text-center font-serif text-2xl text-background italic sm:text-3xl">
        « Nous croyons qu&rsquo;un intérieur apaisé commence par peu de
        choses, choisies avec soin. »
      </blockquote>
    </section>
  );
}
