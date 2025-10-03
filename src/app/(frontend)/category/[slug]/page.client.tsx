'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

interface Category {
  id: string
  title: string
  slug: string
  description?: string
  productsCount: number
  parent?: {
    id: string
    title: string
    slug: string
  }
}

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

interface CategoryClientProps {
  category: Category
}

export default function CategoryClient({ category }: CategoryClientProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 200])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [brands, setBrands] = useState<string[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/search/products?where[categories][in]=${category.id}&limit=12`,
        )
        const data = await response.json()
        setProducts(data.docs || [])

        // Extract unique brands
        const brandList =
          data.docs
            ?.map((product: Product) => product.brand)
            .filter(
              (brand: any): brand is string => typeof brand === 'string' && brand.length > 0,
            ) || []

        const uniqueBrands: string[] = [...new Set(brandList)]
        setBrands(uniqueBrands)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category.id])

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    )
  }

  const handleRatingChange = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating],
    )
  }

  const FilterStars = ({ count }: { count: number }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= count ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.26 15.82,19.02 10,15.27 4.18,19.02 6,12.26 0.49,7.64 7.41,7.36" />
        </svg>
      ))}
    </div>
  )

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
    const ratingMatch =
      selectedRatings.length === 0 ||
      selectedRatings.some((rating) => product.rating.average >= rating)

    return brandMatch && priceMatch && ratingMatch
  })

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#084710]">
            Home
          </Link>
          {category.parent && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/category/${category.parent.slug}`} className="hover:text-[#084710]">
                {category.parent.title}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{category.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1"></div>
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{category.title}</h1>
              {category.description && <p className="text-gray-600 mt-2">{category.description}</p>}
              <p className="text-sm text-gray-500 mt-2">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filter components */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#084710] rounded-xl p-6 sticky top-4">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Filters</h3>
                <button className="text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M21 18V21H19V18H17V16H23V18H21ZM5 18V21H3V18H1V16H7V18H5ZM11 6V3H13V6H15V8H9V6H11ZM11 10H13V21H11V10ZM3 14V3H5V14H3ZM19 14V3H21V14H19Z"></path>
                  </svg>
                </button>
              </div>

              {/* Category Breadcrumb */}
              <div className="mb-6 text-sm text-gray-600">
                <div className="mb-1">Category</div>
                <div className="font-semibold text-gray-900 mb-1">{category.title}</div>
                {category.parent && <div>Parent: {category.parent.title}</div>}
              </div>

              {/* Brand Filter */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <button
                    className="flex items-center justify-between w-full py-3 font-semibold text-left"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <span>BRAND</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isFilterOpen && (
                    <div className="space-y-3 mt-3">
                      {brands.map((brand) => (
                        <label key={brand} className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-[#084710] border-gray-300 rounded focus:ring-green-500"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                          />
                          <span className="ml-3 text-gray-600">{brand}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Price Filter */}
              <div className="mb-6">
                <button className="flex items-center justify-between w-full py-3 font-semibold text-left">
                  <span>PRICE</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>₦{priceRange[0]}</span>
                    <span>₦{priceRange[1]}</span>
                  </div>

                  <div className="w-full flex gap-4 mt-4">
                    <input
                      type="number"
                      placeholder="₦50"
                      className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#084710]"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                      }
                    />
                    <input
                      type="number"
                      placeholder="₦200"
                      className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value) || 200])
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Product Rating Filter */}
              <div className="mb-6">
                <button className="flex items-center justify-between w-full py-3 font-semibold text-left">
                  <span>PRODUCT RATING</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <div className="space-y-3 mt-3">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#084710] border-gray-300 rounded focus:ring-green-500"
                        checked={selectedRatings.includes(rating)}
                        onChange={() => handleRatingChange(rating)}
                      />
                      <div className="ml-3 flex items-center gap-2">
                        <FilterStars count={rating} />
                        <span className="text-sm text-gray-600">& Above</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Filter Button */}
              <button
                className="w-full bg-[#084710] text-white py-3 px-4 rounded-xl hover:bg-black transition-colors font-medium"
                onClick={() => {
                  // Filters are applied automatically through state changes
                  console.log('Filters applied:', { selectedBrands, priceRange, selectedRatings })
                }}
              >
                Apply Filter
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-xl bg-white p-3 animate-pulse"
                  >
                    <div className="bg-gray-300 h-60 rounded-2xl mb-6"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded mb-4 w-1/2"></div>
                    <div className="h-12 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSelectedBrands([])
                    setPriceRange([50, 200])
                    setSelectedRatings([])
                  }}
                  className="mt-4 text-[#084710] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
