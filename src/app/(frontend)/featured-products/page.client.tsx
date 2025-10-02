'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ProductImage from '../../../../public/assets/image1.png'

export default function ProductsClient() {
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false)
  const [isClicked, setIsClicked] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 200])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)

  // Price filter constants
  const MIN_PRICE = 0
  const MAX_PRICE = 500

  // Simulate loading products
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 2 second loading simulation

    return () => clearTimeout(timer)
  }, [])

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

  const handlePriceChange = (index: 0 | 1, value: string) => {
    const numValue = value === '' ? (index === 0 ? MIN_PRICE : MAX_PRICE) : parseInt(value)

    if (isNaN(numValue)) return

    const clampedValue = Math.max(MIN_PRICE, Math.min(MAX_PRICE, numValue))

    setPriceRange((prev) => {
      const newRange: [number, number] = [...prev]
      newRange[index] = clampedValue

      // Ensure min doesn't exceed max and vice versa
      if (index === 0 && clampedValue > prev[1]) {
        newRange[1] = clampedValue
      } else if (index === 1 && clampedValue < prev[0]) {
        newRange[0] = clampedValue
      }

      return newRange
    })
  }

  const handleWishlistClick = () => {
    setIsInWishlist(!isInWishlist)
    setIsClicked(true)

    // Reset click animation after 200ms
    setTimeout(() => {
      setIsClicked(false)
    }, 200)
  }

  function StarRating({ rating = 0 }) {
    return (
      <div className="flex  mb-2">
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

  const ProductSkeleton = () => (
    <div className="border border-[#084710] rounded-xl bg-white p-3 animate-pulse">
      <div className="relative mb-6">
        <div className="w-full h-60 bg-gray-200 rounded-2xl"></div>
        <div className="absolute top-2 right-2 bg-gray-200 p-2 rounded-full w-10 h-10"></div>
      </div>

      <div>
        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="flex mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="h-5 w-5 bg-gray-200 rounded mr-1"></div>
          ))}
        </div>
        <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
      </div>

      <div className="w-full h-12 bg-gray-200 rounded-xl mt-4"></div>
    </div>
  )
  return (
    <>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1"></div>
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-bold my-6">Featured Products</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/*filter components */}
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
                <div className="mb-1">Grocery</div>
                <div className="font-semibold text-gray-900 mb-1">Dried Beans, Grains & Rice</div>
                <div>Rice & Grains</div>
              </div>

              {/* Brand Filter */}
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

                <div className="space-y-3 mt-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#084710] border-gray-300 rounded focus:ring-green-500"
                      checked={selectedBrands.includes('Big Bull')}
                      onChange={() => handleBrandChange('Big Bull')}
                    />
                    <span className="ml-3 text-gray-600">Big Bull</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#084710] border-gray-300 rounded focus:ring-green-500"
                      checked={selectedBrands.includes('Patriot')}
                      onChange={() => handleBrandChange('Patriot')}
                    />
                    <span className="ml-3 text-gray-600">Patriot</span>
                  </label>
                </div>
              </div>

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
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>

                  <div className="relative">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-[#084710] rounded-full"
                        style={{
                          marginLeft: `${(priceRange[0] / MAX_PRICE) * 100}%`,
                          width: `${((priceRange[1] - priceRange[0]) / MAX_PRICE) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="w-full flex gap-4 mt-4">
                    <input
                      type="number"
                      placeholder={`$${MIN_PRICE}`}
                      min={MIN_PRICE}
                      max={MAX_PRICE}
                      className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#084710]"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(0, e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder={`$${MAX_PRICE}`}
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
              <button className="w-full bg-[#084710] text-white py-3 px-4 rounded-xl hover:bg-black transition-colors font-medium">
                Apply Filter
              </button>
            </div>
          </div>
          {/*filter components end */}
          <div className="lg:col-span-2">
            {/* <h3 className="text-3xl font-semibold my-6">Featured Products</h3> */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {isLoading ? (
                // Show skeleton loaders while loading
                <>
                  <ProductSkeleton />
                  <ProductSkeleton />
                  <ProductSkeleton />
                  <ProductSkeleton />
                  <ProductSkeleton />
                  <ProductSkeleton />
                </>
              ) : (
                // Show actual products after loading
                <>
                  {/* Product Card 1 */}
                  <div className="border border-[#084710] rounded-xl bg-white p-3">
                    <div className="relative mb-6">
                      <Image
                        src={ProductImage}
                        alt="product-img"
                        className="w-full h-60 object-cover rounded-2xl"
                        width={300}
                        height={400}
                      />
                      <button
                        onClick={handleWishlistClick}
                        className={`absolute top-2 right-2 bg-white hover:bg-gray-50 p-2 rounded-full shadow-md transition-all duration-300 group 
                                 ${isClicked ? 'scale-125' : 'scale-100'} 
                                 hover:scale-110 active:scale-95`}
                        title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          {isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                          <div className="absolute top-full right-2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
                        </div>

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
                      <h3 className="text-lg font-semibold my-2">Premium Rice</h3>
                      <StarRating rating={4} />
                      <p className="text-xl font-semibold my-2">₦15,000</p>
                    </div>

                    <button className="w-full flex justify-center gap-3 items-center py-3 px-8 bg-[#084710] hover:bg-black rounded-xl transition-colors duration-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="rgba(255,255,255,1)"
                      >
                        <path d="M4.00436 6.41686L0.761719 3.17422L2.17593 1.76001L5.41857 5.00265H20.6603C21.2126 5.00265 21.6603 5.45037 21.6603 6.00265C21.6603 6.09997 21.6461 6.19678 21.6182 6.29L19.2182 14.29C19.0913 14.713 18.7019 15.0027 18.2603 15.0027H6.00436V17.0027H17.0044V19.0027H5.00436C4.45207 19.0027 4.00436 18.5549 4.00436 18.0027V6.41686ZM6.00436 7.00265V13.0027H17.5163L19.3163 7.00265H6.00436ZM5.50436 23.0027C4.67593 23.0027 4.00436 22.3311 4.00436 21.5027C4.00436 20.6742 4.67593 20.0027 5.50436 20.0027C6.33279 20.0027 7.00436 20.6742 7.00436 21.5027C7.00436 22.3311 6.33279 23.0027 5.50436 23.0027ZM17.5044 23.0027C16.6759 23.0027 16.0044 22.3311 16.0044 21.5027C16.0044 20.6742 16.6759 20.0027 17.5044 20.0027C18.3328 20.0027 19.0044 20.6742 19.0044 21.5027C19.0044 22.3311 18.3328 23.0027 17.5044 23.0027Z"></path>
                      </svg>
                      <span className="text-white text-lg">Add to Cart</span>
                    </button>
                  </div>

                  {/* Product Card 2 */}
                  <div className="border border-[#084710] rounded-xl bg-white p-3">
                    <div className="relative mb-6">
                      <Image
                        src={ProductImage}
                        alt="product-img"
                        className="w-full h-60 object-cover rounded-2xl"
                        width={300}
                        height={400}
                      />
                      <button
                        onClick={handleWishlistClick}
                        className={`absolute top-2 right-2 bg-white hover:bg-gray-50 p-2 rounded-full shadow-md transition-all duration-300 group 
                                 ${isClicked ? 'scale-125' : 'scale-100'} 
                                 hover:scale-110 active:scale-95`}
                        title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          {isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                          <div className="absolute top-full right-2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
                        </div>

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
                      <h3 className="text-lg font-semibold my-2">Organic Beans</h3>
                      <StarRating rating={5} />
                      <p className="text-xl font-semibold my-2">₦25,000</p>
                    </div>

                    <button className="w-full flex justify-center gap-3 items-center py-3 px-8 bg-[#084710] hover:bg-black rounded-xl transition-colors duration-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="rgba(255,255,255,1)"
                      >
                        <path d="M4.00436 6.41686L0.761719 3.17422L2.17593 1.76001L5.41857 5.00265H20.6603C21.2126 5.00265 21.6603 5.45037 21.6603 6.00265C21.6603 6.09997 21.6461 6.19678 21.6182 6.29L19.2182 14.29C19.0913 14.713 18.7019 15.0027 18.2603 15.0027H6.00436V17.0027H17.0044V19.0027H5.00436C4.45207 19.0027 4.00436 18.5549 4.00436 18.0027V6.41686ZM6.00436 7.00265V13.0027H17.5163L19.3163 7.00265H6.00436ZM5.50436 23.0027C4.67593 23.0027 4.00436 22.3311 4.00436 21.5027C4.00436 20.6742 4.67593 20.0027 5.50436 20.0027C6.33279 20.0027 7.00436 20.6742 7.00436 21.5027C7.00436 22.3311 6.33279 23.0027 5.50436 23.0027ZM17.5044 23.0027C16.6759 23.0027 16.0044 22.3311 16.0044 21.5027C16.0044 20.6742 16.6759 20.0027 17.5044 20.0027C18.3328 20.0027 19.0044 20.6742 19.0044 21.5027C19.0044 22.3311 18.3328 23.0027 17.5044 23.0027Z"></path>
                      </svg>
                      <span className="text-white text-lg">Add to Cart</span>
                    </button>
                  </div>

                  {/* Product Card 3 */}
                  <div className="border border-[#084710] rounded-xl bg-white p-3">
                    <div className="relative mb-6">
                      <Image
                        src={ProductImage}
                        alt="product-img"
                        className="w-full h-60 object-cover rounded-2xl"
                        width={300}
                        height={400}
                      />
                      <button
                        onClick={handleWishlistClick}
                        className={`absolute top-2 right-2 bg-white hover:bg-gray-50 p-2 rounded-full shadow-md transition-all duration-300 group 
                                 ${isClicked ? 'scale-125' : 'scale-100'} 
                                 hover:scale-110 active:scale-95`}
                        title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          {isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                          <div className="absolute top-full right-2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
                        </div>

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
                      <h3 className="text-lg font-semibold my-2">Mixed Grains</h3>
                      <StarRating rating={3} />
                      <p className="text-xl font-semibold my-2">₦18,500</p>
                    </div>

                    <button className="w-full flex justify-center gap-3 items-center py-3 px-8 bg-[#084710] hover:bg-black rounded-xl transition-colors duration-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="rgba(255,255,255,1)"
                      >
                        <path d="M4.00436 6.41686L0.761719 3.17422L2.17593 1.76001L5.41857 5.00265H20.6603C21.2126 5.00265 21.6603 5.45037 21.6603 6.00265C21.6603 6.09997 21.6461 6.19678 21.6182 6.29L19.2182 14.29C19.0913 14.713 18.7019 15.0027 18.2603 15.0027H6.00436V17.0027H17.0044V19.0027H5.00436C4.45207 19.0027 4.00436 18.5549 4.00436 18.0027V6.41686ZM6.00436 7.00265V13.0027H17.5163L19.3163 7.00265H6.00436ZM5.50436 23.0027C4.67593 23.0027 4.00436 22.3311 4.00436 21.5027C4.00436 20.6742 4.67593 20.0027 5.50436 20.0027C6.33279 20.0027 7.00436 20.6742 7.00436 21.5027C7.00436 22.3311 6.33279 23.0027 5.50436 23.0027ZM17.5044 23.0027C16.6759 23.0027 16.0044 22.3311 16.0044 21.5027C16.0044 20.6742 16.6759 20.0027 17.5044 20.0027C18.3328 20.0027 19.0044 20.6742 19.0044 21.5027C19.0044 22.3311 18.3328 23.0027 17.5044 23.0027Z"></path>
                      </svg>
                      <span className="text-white text-lg">Add to Cart</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
