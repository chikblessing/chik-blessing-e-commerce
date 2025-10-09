'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/providers/Cart'
import { useWishlist } from '@/providers/Wishlist'
import ProductCard from '@/components/ProductCard'
import ReviewSummary from '@/components/Reviews/ReviewSummary'
import ReviewList from '@/components/Reviews/ReviewList'
import ReviewForm from '@/components/Reviews/ReviewForm'
import ProductImage from '../../../../../public/assets/image1.png'

interface ProductClientProps {
  product: any
  relatedProducts: any[]
  reviews: any[]
}

export default function ProductClient({
  product,
  relatedProducts,
  reviews: initialReviews,
}: ProductClientProps) {
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('details')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [reviews, setReviews] = useState(initialReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)

  const images = product.images || []
  const featuredImage = images.find((img: any) => img.isFeature) || images[0]
  const displayPrice = product.salePrice || product.price
  const originalPrice = product.price
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - product.salePrice) / originalPrice) * 100)
    : 0

  const handleAddToCart = async () => {
    if (isAddingToCart) return

    setIsAddingToCart(true)
    try {
      const variantSku = product.inventory?.sku || product.id
      await addToCart(product, variantSku, quantity)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id)
      } else {
        await addToWishlist(product)
      }
    } catch (error) {
      console.error('Error updating wishlist:', error)
    }
  }

  const handleReviewSubmitted = async () => {
    setShowReviewForm(false)
    // Refresh reviews
    try {
      const response = await fetch(`/api/products/${product.id}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Error refreshing reviews:', error)
    }
  }

  const StarRating = ({ rating = 0, count = 0 }: { rating: number; count: number }) => (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.26 15.82,19.02 10,15.27 4.18,19.02 6,12.26 0.49,7.64 7.41,7.36" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-gray-600">({count} reviews)</span>
    </div>
  )

  return (
    <div className="container mx-auto px-4 pt-[150px] pb-8">
      {/* Product Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={
                images[selectedImageIndex]?.image?.url || featuredImage?.image?.url || ProductImage
              }
              alt={images[selectedImageIndex]?.alt || product.title}
              className="w-full h-full object-cover"
              width={500}
              height={500}
            />
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-2">
            {images.slice(0, 4).map((img: any, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImageIndex === index ? 'border-[#084710]' : 'border-gray-200'
                }`}
              >
                <Image
                  src={img.image?.url || ProductImage}
                  alt={img.alt || product.title}
                  className="w-full h-full object-cover"
                  width={80}
                  height={80}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <StarRating
              rating={Math.round(product.rating?.average || 0)}
              count={product.rating?.count || 0}
            />
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-[#084710]">
              ₦{displayPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  ₦{originalPrice.toLocaleString()}
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                  -{discountPercentage}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${product.status === 'published' ? 'bg-green-500' : 'bg-red-500'}`}
              ></div>
              <span className="text-sm font-medium">
                {product.status === 'published' ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <span className="text-sm text-gray-600">Free Shipping on orders 10 days+</span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100 transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.status !== 'published'}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                product.status !== 'published'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isAddingToCart
                    ? 'bg-gray-600 cursor-wait'
                    : 'bg-[#084710] hover:bg-black'
              } text-white`}
            >
              {product.status !== 'published'
                ? 'Out of Stock'
                : isAddingToCart
                  ? 'Adding to Cart...'
                  : 'Add to Cart'}
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`w-full py-3 px-6 rounded-lg font-medium border-2 transition-colors ${
                isInWishlist(product.id)
                  ? 'border-red-500 text-red-500 bg-red-50'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {isInWishlist(product.id) ? '❤ Remove from Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-16">
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-[#084710] text-[#084710]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Product Details
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-[#084710] text-[#084710]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Rating & Reviews
            </button>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Product Overview</h3>
                  <div className="prose max-w-none">
                    {product.description && typeof product.description === 'string' ? (
                      <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    ) : (
                      <div className="text-gray-700 leading-relaxed">
                        {/* Handle rich text content */}
                        <p>
                          {product.shortDescription ||
                            'Premium quality product with excellent features.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {product.features && product.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature: any, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-[#084710] mt-1">•</span>
                          <span className="text-gray-700">{feature.feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-4">Shipping & Returns</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1l1.68 5.39A3 3 0 008.62 15h5.76a3 3 0 002.94-2.61L18 7H7.83l-.2-.8A1 1 0 006.66 6H3V4z" />
                      </svg>
                      <span>Free shipping over ₦5,000 • 3-5 business days</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>30-day return • Next business day</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-[#084710] text-white px-4 py-2 rounded-lg hover:bg-black transition-colors"
                  >
                    {showReviewForm ? 'Cancel' : 'Write a Review'}
                  </button>
                </div>

                {showReviewForm && (
                  <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
                )}

                <ReviewList reviews={reviews} />
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {activeTab === 'reviews' && product.rating && product.rating.count > 0 ? (
              <ReviewSummary
                average={product.rating.average}
                count={product.rating.count}
                breakdown={product.rating.breakdown}
              />
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">Specifications</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium">{product.inventory?.weight || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU</span>
                    <span className="font-medium">{product.inventory?.sku || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock</span>
                    <span className="font-medium">{product.inventory?.stock || 0} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eco-friendly</span>
                    <span className="font-medium">Yes</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-center mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                onWishlistToggle={(productId, isInWishlist) => {
                  console.log(`Product ${productId} wishlist status: ${isInWishlist}`)
                }}
                onAddToCart={(productId) => {
                  console.log(`Added product ${productId} to cart`)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
