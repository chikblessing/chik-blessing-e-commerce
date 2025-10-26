'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/providers/Cart'
import { useWishlist } from '@/providers/Wishlist'
import ProductImage from '../../../public/assets/image1.png'

interface Product {
  id: string
  title: string
  slug: string
  price: number
  salePrice?: number
  shortDescription?: string
  images?: Array<{
    image: {
      url: string
      alt: string
    }
    alt: string
    isFeature: boolean
  }>
  brand: string
  rating: {
    average: number
    count: number
  }
  status: string
}

interface ProductCardProps {
  product: Product
  onWishlistToggle?: (productId: string, isInWishlist: boolean) => void
  onAddToCart?: (productId: string) => void
}

function StarRating({ rating = 0 }: { rating: number }) {
  return (
    <div className="flex mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.26 15.82,19.02 10,15.27 4.18,19.02 6,12.26 0.49,7.64 7.41,7.36" />
        </svg>
      ))}
    </div>
  )
}

export default function ProductCard({ product, onWishlistToggle, onAddToCart }: ProductCardProps) {
  const { addItem: addToCart } = useCart()
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist: checkIsInWishlist,
  } = useWishlist()

  const [isClicked, setIsClicked] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Check if item is in wishlist on mount and when wishlist changes
  useEffect(() => {
    setIsInWishlist(checkIsInWishlist(product.id))
  }, [product.id, checkIsInWishlist])

  const handleWishlistClick = async () => {
    setIsClicked(true)

    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id)
        onWishlistToggle?.(product.id, false)
      } else {
        await addToWishlist(product)
        onWishlistToggle?.(product.id, true)
      }
    } catch (error) {
      console.error('Error updating wishlist:', error)
    }

    setTimeout(() => {
      setIsClicked(false)
    }, 200)
  }

  const handleAddToCart = async () => {
    if (isAddingToCart) return // Prevent double clicks

    setIsAddingToCart(true)
    try {
      // Use the default SKU or product ID as variant SKU
      const variantSku = (product as any).inventory?.sku || product.id
      await addToCart(product as any, variantSku, 1)
      onAddToCart?.(product.id)

      // Show success feedback (optional)
      console.log('Added to cart:', product.title)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const featuredImage = product.images?.find((img) => img.isFeature) || product.images?.[0]
  const displayPrice = product.salePrice || product.price
  const imageUrl = featuredImage?.image?.url || ProductImage

  return (
    <div className="border border-[#084710] rounded-xl bg-white p-3">
      <div className="relative mb-6">
        <Link href={`/product/${product.slug}`}>
          <div className="w-full h-60 bg-gray-100 rounded-2xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={featuredImage?.alt || product.title}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
              width={150}
              height={200}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.src = ProductImage.src
              }}
            />
          </div>
        </Link>
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 bg-white hover:bg-gray-50 p-2 rounded-full shadow-md transition-all duration-300 group
                   ${isClicked ? 'scale-125' : 'scale-100'}
                   hover:scale-110 active:scale-95`}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
            {isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            <div className="absolute top-full right-2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
          </div>

          {/* Heart Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            className={`transition-all duration-300 ${
              isInWishlist
                ? 'fill-red-500 text-red-500'
                : 'fill-none text-gray-400 hover:text-red-500'
            }`}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div>
        <div className="text-sm text-muted-foreground">
          {product.status === 'out-of-stock' ? 'Out of stock' : 'Available'}
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-lg font-semibold my-2 hover:text-[#084710] cursor-pointer transition-colors">
            {product.title}
          </h3>
        </Link>
        <StarRating rating={Math.round(product.rating.average)} />
        <p className="text-xl font-semibold my-2">₦{displayPrice.toLocaleString()}</p>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart || product.status === 'out-of-stock'}
        className={`w-full flex justify-center gap-3 items-center py-3 px-8 rounded-xl transition-colors duration-200 ${
          product.status === 'out-of-stock'
            ? 'bg-gray-400 cursor-not-allowed'
            : isAddingToCart
              ? 'bg-gray-600 cursor-wait'
              : 'bg-[#084710] hover:bg-black'
        }`}
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="rgba(255,255,255,1)"
          >
            <path d="M4.00436 6.41686L0.761719 3.17422L2.17593 1.76001L5.41857 5.00265H20.6603C21.2126 5.00265 21.6603 5.45037 21.6603 6.00265C21.6603 6.09997 21.6461 6.19678 21.6182 6.29L19.2182 14.29C19.0913 14.713 18.7019 15.0027 18.2603 15.0027H6.00436V17.0027H17.0044V19.0027H5.00436C4.45207 19.0027 4.00436 18.5549 4.00436 18.0027V6.41686ZM6.00436 7.00265V13.0027H17.5163L19.3163 7.00265H6.00436ZM5.50436 23.0027C4.67593 23.0027 4.00436 22.3311 4.00436 21.5027C4.00436 20.6742 4.67593 20.0027 5.50436 20.0027C6.33279 20.0027 7.00436 20.6742 7.00436 21.5027C7.00436 22.3311 6.33279 23.0027 5.50436 23.0027ZM17.5044 23.0027C16.6759 23.0027 16.0044 22.3311 16.0044 21.5027C16.0044 20.6742 16.6759 20.0027 17.5044 20.0027C18.3328 20.0027 19.0044 20.6742 19.0044 21.5027C19.0044 22.3311 18.3328 23.0027 17.5044 23.0027Z"></path>
          </svg>
        </span>
        <span className="text-white text-lg">
          {product.status === 'out-of-stock'
            ? 'Out of Stock'
            : isAddingToCart
              ? 'Adding...'
              : 'Add to Cart'}
        </span>
      </button>
    </div>
  )
}
