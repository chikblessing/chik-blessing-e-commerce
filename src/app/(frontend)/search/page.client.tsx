'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { Search } from 'lucide-react'

interface Product {
  id: string
  title: string
  slug: string
  price: number
  salePrice?: number
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

const PageClient: React.FC = () => {
  const { setHeaderTheme } = useHeaderTheme()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(query)

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`/api/search/products?search=${encodeURIComponent(query)}`)
        const data = await response.json()
        setProducts(data.docs || [])
      } catch (error) {
        console.error('Error searching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="container mx-auto px-4 pt-[150px] pb-16">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-center mb-8">Search Products</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-4 pl-12 pr-28 text-lg focus:outline-none focus:ring-2 focus:ring-[#084710]"
          />
          <Search className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#084710] hover:bg-black text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            Search
          </button>
        </form>

        {query && (
          <p className="text-gray-600 text-center mb-8">
            Showing results for: <span className="font-semibold text-[#084710]">"{query}"</span>
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-xl bg-white p-3 animate-pulse">
              <div className="bg-gray-300 h-60 rounded-2xl mb-6"></div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded mb-4 w-1/2"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
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
      ) : query ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No products found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find any products matching "{query}". Try different keywords.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              window.location.href = '/featured-products'
            }}
            className="bg-[#084710] hover:bg-black text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Browse All Products
          </button>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Start searching</h2>
          <p className="text-gray-600">Enter a search term above to find products</p>
        </div>
      )}
    </div>
  )
}

export default PageClient
