'use client'

import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import Link from 'next/link'
import { useMediaQuery } from '@/hooks/use-media-query'
import Image from 'next/image'
import Banner from '../../../public/assets/biscuit.png'
import CocoaImage from '../../../public/assets/cocoa.png'
import GrainImage from '../../../public/assets/grain.png'
import 'swiper/css'
import 'swiper/css/navigation'

interface Category {
  id: string
  title: string
  slug: string
  description?: string
  image?: {
    url: string
    alt: string
  }
  productsCount: number
  isActive: boolean
}

export default function BannerSlider() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const isMobile = useMediaQuery('(max-width: 640px)')
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')

  // Fallback images for categories without images
  const fallbackImages = [Banner, CocoaImage, GrainImage]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          '/api/search/categories?where[isActive][equals]=true&sort=sortOrder&limit=10',
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

  // Responsive slides per view
  const getSlidesPerView = () => {
    if (isMobile) return 2
    if (isTablet) return 4
    return 6
  }

  return (
    <>
    <div className="bg-white">
      <div className="w-full container mx-auto py-2 my-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center">Shop by Category</h2>
          <p className="text-gray-600 text-center mt-2">
            Discover our wide range of product categories
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#084710]"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories available</p>
          </div>
        ) : (
          <Swiper
            spaceBetween={20}
            slidesPerView={getSlidesPerView()}
            navigation={true}
            modules={[Navigation]}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 20,
              },
            }}
            className="category-slider"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={category.id}>
                <Link href={`/category/${category.slug}`}>
                  <div className="group cursor-pointer text-center">
                    <div className="relative overflow-hidden rounded-lg mb-3 aspect-square bg-gray-100 hover:shadow-lg transition-all duration-300">
                      <Image
                        src={category.image?.url || fallbackImages[index % fallbackImages.length]}
                        alt={category.image?.alt || category.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        width={150}
                        height={150}
                      />
                      {/* {category.productsCount > 0 && (
                        <div className="absolute top-2 right-2 bg-[#084710] text-white text-xs px-2 py-1 rounded-full">
                          {category.productsCount}
                        </div>
                      )} */}
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-[#084710] transition-colors duration-200">
                      {category.title}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      </div>

      <style jsx global>{`
        .category-slider .swiper-button-next,
        .category-slider .swiper-button-prev {
          color: #084710;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-top: -20px;
        }

        .category-slider .swiper-button-next:after,
        .category-slider .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
        }

        .category-slider .swiper-button-next:hover,
        .category-slider .swiper-button-prev:hover {
          background: #084710;
          color: white;
        }

        .category-slider .swiper-button-disabled {
          opacity: 0.3;
        }
      `}</style>
    </>
  )
}
