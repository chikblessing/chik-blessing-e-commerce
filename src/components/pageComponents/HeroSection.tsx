'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import HeroImage from '../../../public/assets/hero-image.png'

interface Category {
  id: string
  title: string
  slug: string
  productsCount: number
  isActive: boolean
  parent?: {
    id: string
    title: string
  } | null
  subcategories?: Category[]
}

export default function HeroSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch all active categories
        const response = await fetch(
          '/api/search/categories?where[isActive][equals]=true&sort=sortOrder&limit=100',
        )
        const data = await response.json()
        const allCategories = data.docs || []

        // Organize categories into parent-child structure
        const parentCategories = allCategories.filter((cat: Category) => !cat.parent)
        const childCategories = allCategories.filter((cat: Category) => cat.parent)

        // Attach subcategories to their parents
        const categoriesWithSubs = parentCategories.map((parent: Category) => ({
          ...parent,
          subcategories: childCategories.filter(
            (child: Category) =>
              child.parent && typeof child.parent === 'object' && child.parent.id === parent.id,
          ),
        }))

        setCategories(categoriesWithSubs)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  // Memoize total categories count
  const totalCategories = useMemo(() => {
    return categories.reduce((acc, cat) => {
      return acc + 1 + (cat.subcategories?.length || 0)
    }, 0)
  }, [categories])

  return (
    <>
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Background Image */}
        <Image
          src={HeroImage}
          alt="hero-section"
          className="absolute inset-0 w-full h-full object-cover z-0"
          priority
        />

        {/* Overlay for better text readability */}
        {/* <div className="absolute inset-0 bg-black/30 z-10"></div> */}

        {/* Categories Sidebar - Desktop */}
        <div className="hidden lg:flex z-20 mt-28 ">
          <div className="bg-[#084710] w-[100px] h-[70vh] flex items-center justify-center">
            <div className="transform -rotate-90 whitespace-nowrap">
              {/* <span className="text-white font-semibold text-lg tracking-wider">CATEGORIES</span> */}
            </div>
          </div>
          <div className="bg-[#F8F6F6] w-[300px] h-[70vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-300 bg-white">
              <h3 className="text-[#084710] font-semibold text-xl">All Categories</h3>
              <p className="text-xs text-gray-500 mt-1">{totalCategories} total items</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="category-item">
                      <div className="flex items-center justify-between group hover:bg-gray-100 rounded-lg px-2 transition-colors">
                        <Link
                          href={`/category/${category.slug}`}
                          className="flex-1 text-[#00000080] text-base hover:text-[#084710] hover:font-medium transition-all duration-200 cursor-pointer py-2.5"
                        >
                          <span className="flex items-center gap-2">
                            {category.title}
                            {/* {category.productsCount > 0 && (
                              <span className="text-xs bg-[#084710] text-white px-2 py-0.5 rounded-full">
                                {category.productsCount}
                              </span>
                            )} */}
                          </span>
                        </Link>

                        {category.subcategories && category.subcategories.length > 0 && (
                          <button
                            onClick={() => toggleCategory(category.id)}
                            className="p-2 hover:bg-gray-200 rounded-md transition-colors flex-shrink-0"
                            aria-label={
                              expandedCategories.has(category.id)
                                ? 'Collapse subcategories'
                                : 'Expand subcategories'
                            }
                          >
                            <svg
                              className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                                expandedCategories.has(category.id) ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Subcategories Dropdown */}
                      {category.subcategories &&
                        category.subcategories.length > 0 &&
                        expandedCategories.has(category.id) && (
                          <div className="ml-4 mt-1 mb-2 space-y-1 border-l-2 border-[#084710] pl-3 animate-slideDown">
                            {category.subcategories.map((subcat) => (
                              <Link
                                key={subcat.id}
                                href={`/category/${subcat.slug}`}
                                className="block text-[#00000060] text-sm hover:text-[#084710] hover:font-medium hover:bg-gray-50 transition-all duration-200 cursor-pointer py-2 px-2 rounded-md"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                  {subcat.title}
                                  {/* {subcat.productsCount > 0 && (
                                    <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full ml-auto">
                                      {subcat.productsCount}
                                    </span>
                                  )} */}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                  {categories.length === 0 && !loading && (
                    <div className="text-center py-8">
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="text-gray-500 text-sm">No categories available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Categories Toggle Button */}
        <button
          onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
          className="lg:hidden fixed top-20 mt-[100px] left-4 z-30 bg-[#084710] text-white p-3 rounded-full shadow-lg hover:bg-[#0a5c14] transition-colors"
          aria-label="Toggle categories"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="currentColor"
          >
            <path d="M6.17071 18C6.58254 16.8348 7.69378 16 9 16C10.3062 16 11.4175 16.8348 11.8293 18H22V20H11.8293C11.4175 21.1652 10.3062 22 9 22C7.69378 22 6.58254 21.1652 6.17071 20H2V18H6.17071ZM12.1707 11C12.5825 9.83481 13.6938 9 15 9C16.3062 9 17.4175 9.83481 17.8293 11H22V13H17.8293C17.4175 14.1652 16.3062 15 15 15C13.6938 15 12.5825 14.1652 12.1707 13H2V11H12.1707ZM6.17071 4C6.58254 2.83481 7.69378 2 9 2C10.3062 2 11.4175 2.83481 11.8293 4H22V6H11.8293C11.4175 7.16519 10.3062 8 9 8C7.69378 8 6.58254 7.16519 6.17071 6H2V4H6.17071ZM9 6C9.55228 6 10 5.55228 10 5C10 4.44772 9.55228 4 9 4C8.44772 4 8 4.44772 8 5C8 5.55228 8.44772 6 9 6ZM15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12C14 12.5523 14.4477 13 15 13ZM9 20C9.55228 20 10 19.5523 10 19C10 18.4477 9.55228 18 9 18C8.44772 18 8 18.4477 8 19C8 19.5523 8.44772 20 9 20Z"></path>
          </svg>
        </button>

        {/* Mobile Categories Drawer */}
        {isCategoriesOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsCategoriesOpen(false)}
            ></div>
            <div className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl animate-slideInLeft overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-300 bg-[#084710] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-xl">All Categories</h3>
                  <p className="text-xs text-white/80 mt-1">{totalCategories} total items</p>
                </div>
                <button
                  onClick={() => setIsCategoriesOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-md transition-colors"
                  aria-label="Close categories"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="category-item">
                        <div className="flex items-center justify-between group hover:bg-gray-100 rounded-lg px-2 transition-colors">
                          <Link
                            href={`/category/${category.slug}`}
                            onClick={() => setIsCategoriesOpen(false)}
                            className="flex-1 text-[#00000080] text-base hover:text-[#084710] hover:font-medium transition-all duration-200 cursor-pointer py-2.5"
                          >
                            <span className="flex items-center gap-2">
                              {category.title}
                              {category.productsCount > 0 && (
                                <span className="text-xs bg-[#084710] text-white px-2 py-0.5 rounded-full">
                                  {category.productsCount}
                                </span>
                              )}
                            </span>
                          </Link>

                          {category.subcategories && category.subcategories.length > 0 && (
                            <button
                              onClick={() => toggleCategory(category.id)}
                              className="p-2 hover:bg-gray-200 rounded-md transition-colors flex-shrink-0"
                            >
                              <svg
                                className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                                  expandedCategories.has(category.id) ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>

                        {category.subcategories &&
                          category.subcategories.length > 0 &&
                          expandedCategories.has(category.id) && (
                            <div className="ml-4 mt-1 mb-2 space-y-1 border-l-2 border-[#084710] pl-3 animate-slideDown">
                              {category.subcategories.map((subcat) => (
                                <Link
                                  key={subcat.id}
                                  href={`/category/${subcat.slug}`}
                                  onClick={() => setIsCategoriesOpen(false)}
                                  className="block text-[#00000060] text-sm hover:text-[#084710] hover:font-medium hover:bg-gray-50 transition-all duration-200 cursor-pointer py-2 px-2 rounded-md"
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                    {subcat.title}
                                    {subcat.productsCount > 0 && (
                                      <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full ml-auto">
                                        {subcat.productsCount}
                                      </span>
                                    )}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {/* Hero Content */}
        <div className="relative text-white z-20 p-8 max-w-4xl mx-auto mt-24 ">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 font-baiJamjuree drop-shadow-lg">
            Shop Smart, Live Better.
          </h1>

          <p className="text-xl md:text-xl mb-8 font-baiJamjuree">
            We are dedicated to making your life simpler by offering an unparalleled selection of
            groceries, cleaning supplies, and everyday essentials. Say goodbye to the hassle of
            traditional shopping and say hello to the ultimate convenience, with everything you need
            just a few clicks away.
          </p>
          <Link
            href="/featured-products"
            className="inline-block bg-[#07470F] text-lg hover:bg-black font-semibold py-3 px-10 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}
