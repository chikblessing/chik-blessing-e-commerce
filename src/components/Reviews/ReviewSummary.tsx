'use client'

import React from 'react'

interface RatingBreakdown {
  fiveStars: number
  fourStars: number
  threeStars: number
  twoStars: number
  oneStar: number
}

interface ReviewSummaryProps {
  average: number
  count: number
  breakdown: RatingBreakdown
}

export default function ReviewSummary({ average, count, breakdown }: ReviewSummaryProps) {
  const ratingData = [
    { stars: 5, count: breakdown.fiveStars },
    { stars: 4, count: breakdown.fourStars },
    { stars: 3, count: breakdown.threeStars },
    { stars: 2, count: breakdown.twoStars },
    { stars: 1, count: breakdown.oneStar },
  ]

  const getPercentage = (starCount: number) => {
    if (count === 0) return 0
    return Math.round((starCount / count) * 100)
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>

      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">{average.toFixed(1)}</div>
          <div className="flex justify-center my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-5 w-5 ${star <= Math.round(average) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.26 15.82,19.02 10,15.27 4.18,19.02 6,12.26 0.49,7.64 7.41,7.36" />
              </svg>
            ))}
          </div>
          <div className="text-sm text-gray-600">{count} reviews</div>
        </div>
      </div>

      <div className="space-y-2">
        {ratingData.map(({ stars, count: starCount }) => (
          <div key={stars} className="flex items-center gap-2">
            <span className="text-sm text-gray-600 w-8">{stars}★</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all"
                style={{ width: `${getPercentage(starCount)}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 w-12 text-right">
              {getPercentage(starCount)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
