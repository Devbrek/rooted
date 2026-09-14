import { SectionHeading } from "@/components/section-heading";

export function HomeMission() {
  return (
    <section className="bg-background px-6 py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <SectionHeading title="Notre démarche" />
        <p className="text-center font-sans text-lg text-foreground">
          Chez Rooted, nous choisissons des objets simples et des matières
          naturelles, pensés pour durer plutôt que pour s&rsquo;accumuler.
          Une sélection resserrée, loin du superflu.
        </p>
      </div>
    </section>
  );
}
