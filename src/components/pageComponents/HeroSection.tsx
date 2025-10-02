'use client'

// src/components/HeroSection/HeroSection.tsx
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import Image from 'next/image'
import HeroImage from '../../../public/assets/hero-image.png'

interface Category {
  id: string
  title: string
  slug: string
  productsCount: number
  isActive: boolean
}

export default function HeroSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          '/api/search/categories?where[isActive][equals]=true&sort=sortOrder&limit=5',
        )
        const data = await response.json()
        setCategories(data.docs || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <>
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <Image
          src={HeroImage}
          alt="hero-section"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="flex z-20 mt-28">
          <div className="bg-[#084710] w-[100px] h-[70vh]"></div>
          <div className="bg-[#F8F6F6] w-[300px] h-[70vh] p-4 text-left overflow-y-auto">
            <h3 className="text-[#084710] font-semibold text-xl my-4">All Categories</h3>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="block text-[#00000080] text-lg hover:text-[#084710] hover:font-medium transition-all duration-200 cursor-pointer"
                  >
                    {category.title}
                    {category.productsCount > 0 && (
                      <span className="text-sm text-gray-500 ml-2">({category.productsCount})</span>
                    )}
                  </Link>
                ))}
                {categories.length === 0 && !loading && (
                  <p className="text-gray-500 text-sm">No categories available</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="relative text-white z-20 p-8 max-w-4xl mx-auto mt-24">
          <h1 className="text-6xl md:text-6xl font-bold leading-tight mb-6 font-baiJamjuree">
            Shop Smart, Live Better.
          </h1>

          <p className="text-xl md:text-xl mb-8 font-baiJamjuree">
            We are dedicated to making your life simpler by offering an unparalleled selection of
            groceries, cleaning supplies, and everyday essentials. Say goodbye to the hassle of
            traditional shopping and say hello to the ultimate convenience, with everything you need
            just a few clicks away.{' '}
          </p>
          <button className="bg-[#07470F] text-lg hover:bg-black font-semibold py-2 px-8 rounded-xl ">
            Shop Now
          </button>
        </div>
      </section>
    </>
  )
}
