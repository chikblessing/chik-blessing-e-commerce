'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('details')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [reviews, setReviews] = useState(initialReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isWishlistClicked, setIsWishlistClicked] = useState(false)
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false)

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

  const handleBuyNow = async () => {
    if (isBuyingNow) return

    setIsBuyingNow(true)
    try {
      const variantSku = product.inventory?.sku || product.id
      await addToCart(product, variantSku, quantity)
      router.push('/checkout')
    } catch (error) {
      console.error('Error during buy now:', error)
    } finally {
      setIsBuyingNow(false)
    }
  }

  const handleWishlistToggle = async () => {
    setIsWishlistClicked(true)
    setTimeout(() => setIsWishlistClicked(false), 300)

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

  // Social Share Functions
  const getProductUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href
    }
    return ''
  }

  const handleShareFacebook = () => {
    const url = getProductUrl()
    const description = encodeURIComponent(
      product.shortDescription ||
        `Check out ${product.title} for ₦${displayPrice.toLocaleString()}`,
    )

    // Use Facebook's share dialog for better functionality
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${description}`,
      '_blank',
      'width=600,height=600',
    )
  }

  const handleShareTwitter = () => {
    const url = getProductUrl()
    const text = `Check out ${product.title} - ₦${displayPrice.toLocaleString()}`
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      '_blank',
      'width=600,height=400',
    )
  }

  const handleShareWhatsApp = () => {
    const url = getProductUrl()
    const text = `Check out ${product.title} - ₦${displayPrice.toLocaleString()} ${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleShareInstagram = async () => {
    const url = getProductUrl()
    const text = `Check out ${product.title} - ₦${displayPrice.toLocaleString()}\n${url}`

    try {
      await navigator.clipboard.writeText(text)
      alert(
        '✅ Product link copied!\n\nTo share on Instagram:\n1. Open Instagram app\n2. Create a new post or story\n3. Paste the link in your caption or bio',
      )
    } catch (error) {
      console.error('Failed to copy link:', error)
      alert('Failed to copy link. Please try again.')
    }
  }

  const handleShareTelegram = () => {
    const url = getProductUrl()
    const text = `Check out ${product.title} - ₦${displayPrice.toLocaleString()}`
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      '_blank',
    )
  }

  const handleCopyLink = async () => {
    const url = getProductUrl()
    try {
      await navigator.clipboard.writeText(url)
      setShowCopiedTooltip(true)
      setTimeout(() => setShowCopiedTooltip(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
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
          <div className="bg-gray-100 p-2 rounded-lg overflow-hidden">
            <Image
              src={
                images[selectedImageIndex]?.image?.url || featuredImage?.image?.url || ProductImage
              }
              alt={images[selectedImageIndex]?.alt || product.title}
              className="w-[400px] h-[400px] mx-auto object-contain"
              width={300}
              height={300}
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
        <div className="space-y-6 relative">
          {/* Wishlist Icon Button - Top Right */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-0 right-0 bg-white hover:bg-gray-50 p-3 rounded-full shadow-md transition-all duration-300 group z-10 ${
              isWishlistClicked ? 'scale-125' : 'scale-100'
            } hover:scale-110 active:scale-95`}
            title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
              {isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              <div className="absolute top-full right-3 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
            </div>

            {/* Heart Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className={`transition-all duration-300 ${
                isInWishlist(product.id)
                  ? 'fill-red-500 text-red-500'
                  : 'fill-none text-gray-400 hover:text-red-500'
              }`}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 pr-16">{product.title}</h1>
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
              onClick={handleBuyNow}
              disabled={isBuyingNow || product.status !== 'published'}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                product.status !== 'published'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isBuyingNow
                    ? 'bg-gray-600 cursor-wait'
                    : 'bg-[#084710] hover:bg-black'
              } text-white`}
            >
              {product.status !== 'published'
                ? 'Out of Stock'
                : isBuyingNow
                  ? 'Processing...'
                  : 'Buy Now'}
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.status !== 'published'}
              className={`w-full py-3 px-6 rounded-lg font-medium border-2 transition-colors ${
                product.status !== 'published'
                  ? 'border-gray-400 text-gray-400 cursor-not-allowed'
                  : isAddingToCart
                    ? 'border-gray-600 text-gray-600 cursor-wait'
                    : 'border-[#084710] text-[#084710] hover:bg-[#084710] hover:text-white'
              }`}
            >
              {product.status !== 'published'
                ? 'Out of Stock'
                : isAddingToCart
                  ? 'Adding to Cart...'
                  : 'Add to Cart'}
            </button>

            {/* Social Media Share Buttons */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Share this product:</p>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <button
                  onClick={handleShareFacebook}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] hover:bg-[#0d65d9] text-white transition-colors"
                  title="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>

                {/* Twitter/X */}
                <button
                  onClick={handleShareTwitter}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 text-white transition-colors"
                  title="Share on Twitter/X"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1fb855] text-white transition-colors"
                  title="Share on WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
                  </svg>
                </button>

                {/* Telegram */}
                <button
                  onClick={handleShareTelegram}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white transition-colors"
                  title="Share on Telegram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                  </svg>
                </button>

                {/* Instagram */}
                <button
                  onClick={handleShareInstagram}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] hover:opacity-90 text-white transition-opacity"
                  title="Share on Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </button>

                {/* Copy Link */}
                <div className="relative">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                    title="Copy link"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  {/* Copied Tooltip */}
                  {showCopiedTooltip && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-1.5 rounded whitespace-nowrap">
                      Link copied!
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
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

      {/* Related Product */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-center mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="h-full">
                <ProductCard
                  product={relatedProduct}
                  onWishlistToggle={(productId, isInWishlist) => {
                    console.log(`Product ${productId} wishlist status: ${isInWishlist}`)
                  }}
                  onAddToCart={(productId) => {
                    console.log(`Added product ${productId} to cart`)
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
