'use client'

import React, { useState, useMemo } from 'react'
import ProductCard from '@/components/ProductCard/ProductCard'
import { Product, Category } from '@/payload-types'
import { useCart } from '@/providers/Cart'
import { useWishlist } from '@/providers/Wishlist'
import toast from 'react-hot-toast'

interface ProductsClientProps {
  initialProducts: Product[]
  categories: Category[]
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Price filter constants
  const MIN_PRICE = 0
  const MAX_PRICE = 1000000

  // Get unique brands from products
  const brands = useMemo(() => {
    const brandSet = new Set(initialProducts.map((p) => p.brand).filter(Boolean))
    return Array.from(brandSet).sort()
  }, [initialProducts])

  // Filter products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false
      }

      // Price filter
      const price = product.salePrice ?? product.price
      if (price < priceRange[0] || price > priceRange[1]) {
        return false
      }

      // Rating filter
      if (selectedRatings.length > 0) {
        const productRating = Math.round(product.rating?.average || 0)
        const meetsRating = selectedRatings.some((rating) => productRating >= rating)
        if (!meetsRating) return false
      }

      // Category filter
      if (selectedCategories.length > 0) {
        const productCategories = Array.isArray(product.categories)
          ? product.categories.map((cat) => (typeof cat === 'string' ? cat : cat.id))
          : []
        const hasCategory = selectedCategories.some((catId) => productCategories.includes(catId))
        if (!hasCategory) return false
      }

      return true
    })
  }, [initialProducts, selectedBrands, priceRange, selectedRatings, selectedCategories])

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    )
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId],
    )
  }

  const handleRatingChange = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating],
    )
  }

  const handlePriceChange = (index: 0 | 1, value: string) => {
    const numValue = value === '' ? (index === 0 ? MIN_PRICE : MAX_PRICE) : parseInt(value)
    if (isNaN(numValue)) return

    const clampedValue = Math.max(MIN_PRICE, Math.min(MAX_PRICE, numValue))

    setPriceRange((prev) => {
      const newRange: [number, number] = [...prev]
      newRange[index] = clampedValue

      if (index === 0 && clampedValue > prev[1]) {
        newRange[1] = clampedValue
      } else if (index === 1 && clampedValue < prev[0]) {
        newRange[0] = clampedValue
      }

      return newRange
    })
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setPriceRange([MIN_PRICE, MAX_PRICE])
    setSelectedRatings([])
    setSelectedCategories([])
  }

  const handleWishlistToggle = async (productId: string, currentlyInWishlist: boolean) => {
    const product = initialProducts.find((p) => p.id === productId)
    if (!product) return

    try {
      if (currentlyInWishlist) {
        await removeFromWishlist(productId)
        toast.success('Removed from wishlist')
      } else {
        await addToWishlist(product)
        toast.success('Added to wishlist')
      }
    } catch (_error) {
      toast.error('Failed to update wishlist')
    }
  }

  const handleAddToCart = async (productId: string) => {
    const product = initialProducts.find((p) => p.id === productId)
    if (!product) return

    try {
      const variantSku = product.inventory?.sku || product.id
      await addToCart(product, variantSku, 1)
      // Toast is handled by the Cart provider
    } catch (_error) {
      toast.error('Failed to add to cart')
    }
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

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#084710] rounded-xl p-6 sticky top-24">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Filters</h3>
              {(selectedBrands.length > 0 ||
                selectedRatings.length > 0 ||
                selectedCategories.length > 0 ||
                priceRange[0] !== MIN_PRICE ||
                priceRange[1] !== MAX_PRICE) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">CATEGORIES</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#084710] border-gray-300 rounded focus:ring-green-500"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                      />
                      <span className="ml-3 text-gray-600 text-sm">{category.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">BRAND</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#084710] border-gray-300 rounded focus:ring-green-500"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                      />
                      <span className="ml-3 text-gray-600 text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">PRICE</h4>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>₦{priceRange[0].toLocaleString()}</span>
                  <span>₦{priceRange[1].toLocaleString()}</span>
                </div>

                <div className="w-full flex gap-4 mt-4">
                  <input
                    type="number"
                    placeholder="Min"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#084710]"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#084710]"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Product Rating Filter */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">PRODUCT RATING</h4>
              <div className="space-y-2">
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
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="mx-auto mb-6">
            <h3 className="text-3xl font-bold">Featured Products</h3>
            <p className="text-gray-600 mt-2">
              Showing {filteredProducts.length} of {initialProducts.length} products
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters to see more products</p>
              <button
                onClick={clearFilters}
                className="bg-[#084710] text-white px-6 py-3 rounded-lg hover:bg-black transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="mx-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard
                    key={product.id}
                    product={product as any}
                    onWishlistToggle={(productId, isInWishlist) =>
                      handleWishlistToggle(productId, isInWishlist)
                    }
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
