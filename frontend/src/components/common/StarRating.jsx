import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({
  rating = 5,
  interactive = false,
  onRatingChange,
  size = 20,
  className = '',
}) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const activeRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= activeRating;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`transition-transform ${
              interactive
                ? 'cursor-pointer hover:scale-125 focus:outline-none'
                : 'cursor-default'
            }`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-stone-300 fill-stone-100'
              } transition-colors duration-150`}
            />
          </button>
        );
      })}
    </div>
  );
}
