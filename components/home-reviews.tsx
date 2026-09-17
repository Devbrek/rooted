import { SectionHeading } from "@/components/section-heading";
import { ReviewCarousel } from "@/components/review-carousel";
import { getHomepageReviews } from "@/lib/reviews";

export function HomeReviews() {
  const reviews = getHomepageReviews();

  return (
    <section className="bg-section px-6 py-20">
      <div className="mx-auto max-w-xl">
        <SectionHeading title="Avis clients" subtitle="Avis fictifs" />

        <div className="mt-12 bg-background px-6 py-10">
          <ReviewCarousel reviews={reviews} />
        </div>
      </div>
    </section>
  );
}
