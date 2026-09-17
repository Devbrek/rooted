import { SectionHeading } from "@/components/section-heading";
import { StarRating } from "@/components/star-rating";
import { ReviewCarousel } from "@/components/review-carousel";
import { getAverageRating, getProductReviews } from "@/lib/reviews";

export function ProductReviews({ productId }: { productId: string }) {
  const reviews = getProductReviews(productId);

  if (reviews.length === 0) {
    return null;
  }

  const average = getAverageRating(reviews);

  return (
    <section className="bg-section px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <SectionHeading title="Avis clients" subtitle="Avis fictifs" />

        <div className="mt-8 flex items-center justify-center gap-3">
          <StarRating rating={average} />
          <span className="font-sans text-sm text-foreground/70">
            {reviews.length} avis
          </span>
        </div>

        <div className="mt-10 bg-background px-6 py-8">
          <ReviewCarousel reviews={reviews} />
        </div>
      </div>
    </section>
  );
}
