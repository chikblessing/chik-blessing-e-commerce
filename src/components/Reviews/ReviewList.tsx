'use client'

import React from 'react'

interface Review {
  id: string
  title: string
  comment: string
  rating: number
  customer: {
    name: string
    firstName?: string
    lastName?: string
  }
  isVerifiedPurchase: boolean
  createdAt: string
}

interface ReviewListProps {
  reviews: Review[]
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⭐</div>
        <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to review this product!</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getCustomerName = (customer: Review['customer']) => {
    if (customer.firstName && customer.lastName) {
      return `${customer.firstName} ${customer.lastName}`
    }
    return customer.name || 'Anonymous'
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.26 15.82,19.02 10,15.27 4.18,19.02 6,12.26 0.49,7.64 7.41,7.36" />
                    </svg>
                  ))}
                </div>
                {review.isVerifiedPurchase && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified Purchase
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-gray-900">{review.title}</h4>
            </div>
          </div>

          <p className="text-gray-700 mb-3">{review.comment}</p>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium">{getCustomerName(review.customer)}</span>
            <span>•</span>
            <span>{formatDate(review.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
