import { SectionHeading } from "@/components/section-heading";

export function ProductMaterialCare({ care }: { care: string }) {
  return (
    <section className="bg-section px-6 py-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <SectionHeading title="Matière & entretien" />
        <p className="text-center font-sans text-foreground">{care}</p>
      </div>
    </section>
  );
}
