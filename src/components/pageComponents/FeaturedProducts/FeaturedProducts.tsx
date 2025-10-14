'use client'

import React, { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'

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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/search/products?limit=4&sort=-createdAt')
        const data = await response.json()
        setProducts(data.docs || [])
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <>
      <div className="bg-[#F8F6F6] py-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-semibold text-center my-8">Featured Products</h3>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
              {[...Array(4)].map((_, i) => (
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
              <p className="text-gray-500 text-lg">No featured products available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
              {products.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard
                    product={product}
                    onWishlistToggle={(productId, isInWishlist) => {
                      console.log(`Product ${productId} wishlist status: ${isInWishlist}`)
                      // Here you can implement wishlist functionality
                    }}
                    onAddToCart={(productId) => {
                      console.log(`Add product ${productId} to cart`)
                      // Here you can implement add to cart functionality
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
