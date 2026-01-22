"use client";

import { useState } from "react";
import { Language, t } from "@/lib/translations";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  language: Language;
}

export default function StarRating({ rating, onRatingChange, language }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const tr = t(language);

  const getRatingText = (r: number) => {
    switch (r) {
      case 1: return tr.poor;
      case 2: return tr.fair;
      case 3: return tr.good;
      case 4: return tr.veryGood;
      case 5: return tr.excellent;
      default: return tr.clickToRate;
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="star text-4xl focus:outline-none"
          >
            <span
              className={
                star <= (hoverRating || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>
      <div className="text-center mt-2 text-sm text-gray-500">
        {getRatingText(rating)}
      </div>
    </div>
  );
}
