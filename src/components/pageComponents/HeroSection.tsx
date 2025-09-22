'use client'

// src/components/HeroSection/HeroSection.tsx
import React from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'
import Image from 'next/image'
import HeroImage from "../../../public/assets/hero-image.png"

export default function HeroSection() {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')
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
          <div className="bg-[#F8F6F6] w-[300px] h-[70vh] p-4 text-left">
            <h3 className="text-[#084710] font-semibold text-xl my-4">All Categories</h3>
            <p className="text-[#00000080] text-lg my-6">Groceries & Food</p>
            <p className="text-[#00000080] text-lg my-6">Groceries & Food</p>{' '}
            <p className="text-[#00000080] text-lg my-6">Groceries & Food</p>{' '}
            <p className="text-[#00000080] text-lg my-6">Groceries & Food</p>{' '}
            <p className="text-[#00000080] text-lg my-6">Groceries & Food</p>
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
};