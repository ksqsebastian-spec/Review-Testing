"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export default function StarRating({ rating, onRatingChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Your Rating
      </label>
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
        {rating === 0 && "Click to rate"}
        {rating === 1 && "Poor"}
        {rating === 2 && "Fair"}
        {rating === 3 && "Good"}
        {rating === 4 && "Very Good"}
        {rating === 5 && "Excellent"}
      </div>
    </div>
  );
}
