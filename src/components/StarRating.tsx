
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  total?: number;
  initialRating?: number;
  size?: number;
  disabled?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ 
  total = 5, 
  initialRating = 0, 
  size = 24, 
  disabled = false,
  onChange 
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  
  const handleRatingChange = (newRating: number) => {
    if (disabled) return;
    
    setRating(newRating);
    if (onChange) {
      onChange(newRating);
    }
  };
  
  return (
    <div className="flex">
      {[...Array(total)].map((_, i) => {
        const starValue = i + 1;
        const filled = hover > 0 ? starValue <= hover : starValue <= rating;
        
        return (
          <button
            type="button"
            key={i}
            className={`${
              disabled ? 'cursor-default' : 'cursor-pointer'
            } p-0 bg-transparent border-none focus:outline-none transition-transform hover:scale-110`}
            onClick={() => handleRatingChange(starValue)}
            onMouseEnter={() => !disabled && setHover(starValue)}
            onMouseLeave={() => !disabled && setHover(0)}
          >
            <Star 
              size={size} 
              className={`${
                filled ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
              } transition-colors`} 
            />
          </button>
        );
      })}
    </div>
  );
}
