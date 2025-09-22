'use client'

// src/components/HeroSection/HeroSection.tsx
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'


import { useMediaQuery } from '@/hooks/use-media-query'
import Image from 'next/image'
import HeroImage from "../../../public/assets/hero-image.png"
import Banner from "../../../public/assets/biscuit.png";
import CocoaImage from "../../../public/assets/cocoa.png";
import GrainImage from "../../../public/assets/grain.png";
import 'swiper/css'
import 'swiper/css/navigation'



export default function BannerSlider() {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')
  return (
    <>
      <div className="w-full container mx-auto my-8">
        <Swiper
          spaceBetween={5}
          slidesPerView={6}
          navigation={true}
          modules={[Navigation]}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
        >
          <SwiperSlide>
            <Image src={CocoaImage} alt="banner-img" className="" />
            <p className="font-semibold text-md">Product Name</p>
          </SwiperSlide>
          <SwiperSlide>
            {' '}
            <Image src={Banner} alt="banner-img" className="" />
            <p className="font-semibold text-md">Product Name</p>
          </SwiperSlide>
          <SwiperSlide>
            <Image src={Banner} alt="banner-img" className="" />
            <p className="font-semibold text-md">Product Name</p>
          </SwiperSlide>
          <SwiperSlide>
            <Image src={Banner} alt="banner-img" className="" />
            <p className="font-semibold text-md">Product Name</p>
          </SwiperSlide>
          <SwiperSlide>
            <Image src={CocoaImage} alt="banner-img" className="" />
            <p className="font-semibold text-md">Product Name</p>
          </SwiperSlide>
          <SwiperSlide>
            <Image src={CocoaImage} alt="banner-img" className="" />
            <p className="font-semibold text-md">Product Name</p>
          </SwiperSlide>
          <SwiperSlide>
            <Image src={CocoaImage} alt="banner-img" className="" />
            <p className="font-semibold text-md">Product Name</p>
          </SwiperSlide>
          <SwiperSlide>
            <Image src={GrainImage} alt="banner-img" className="" />
            <p className="font-semibold text-md">Product Name</p>
          </SwiperSlide>
          <SwiperSlide>
            <Image src={GrainImage} alt="banner-img" className="" />
            <p className="font-semibold text-md">Product Name</p>
          </SwiperSlide>
          <SwiperSlide>
            <Image src={GrainImage} alt="banner-img" className="" />
            <p className="font-semibold text-md">Product Name</p>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  )}