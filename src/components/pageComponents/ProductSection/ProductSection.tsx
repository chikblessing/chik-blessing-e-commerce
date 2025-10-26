'use client'

import React, { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  slug: string
  price: number
  salePrice?: number
  shortDescription?: string
  images: Array<{
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

interface ProductSectionProps {
  title: string
  apiEndpoint: string
  viewAllLink?: string
  limit?: number
}

export default function ProductSection({
  title,
  apiEndpoint,
  viewAllLink,
  limit = 4,
}: ProductSectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiEndpoint)
        const data = await response.json()
        setProducts(data.docs || [])
      } catch (error) {
        console.error(`Error fetching ${title}:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [apiEndpoint, title])

  return (
    <div className="bg-[#F8F6F6] py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-semibold">{title}</h3>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-[#084710] hover:text-black font-medium flex items-center gap-2"
            >
              View All
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path
                  d="M6 12l4-4-4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="h-full">
                <div className="border border-gray-200 rounded-xl bg-white p-3 animate-pulse h-full flex flex-col">
                  <div className="bg-gray-300 h-60 rounded-2xl mb-6"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4 w-1/2"></div>
                  <div className="h-12 bg-gray-300 rounded mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available.</p>
          </div>
        ) : (
          <div className="mx-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {products.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard
                  product={product}
                  onWishlistToggle={(productId, isInWishlist) => {
                    console.log(`Product ${productId} wishlist status: ${isInWishlist}`)
                  }}
                  onAddToCart={(productId) => {
                    console.log(`Add product ${productId} to cart`)
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
