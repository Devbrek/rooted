"use client";

import { useEffect, useState } from "react";
import { StarRating } from "@/components/star-rating";
import type { Review } from "@/lib/reviews";

const ROTATION_INTERVAL_MS = 2500;

export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reviews.length <= 1) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % reviews.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {reviews.map((review) => (
            <div
              key={`${review.author}-${review.text}`}
              className="flex w-full shrink-0 flex-col items-center gap-3 px-2 text-center"
            >
              <StarRating rating={review.rating} />
              <p className="font-sans text-foreground">{review.text}</p>
              <p className="font-serif text-sm text-secondary">
                {review.author}
              </p>
            </div>
          ))}
        </div>
      </div>

      {reviews.length > 1 ? (
        <div className="flex items-center gap-2">
          {reviews.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`Avis ${dotIndex + 1} sur ${reviews.length}`}
              aria-current={dotIndex === index}
              className={`h-2 w-2 rounded-full transition-colors ${
                dotIndex === index ? "bg-secondary" : "bg-accent/40"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
