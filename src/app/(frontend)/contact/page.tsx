'use client'
import CounterItem from '@/components/pageComponents/Counter/CounterItem'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function AboutPage() {
  return (
    <>
      <section
        className="relative mt-[100px] w-full h-[450px] flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage: "url('/assets/contact-hero-img.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 text-center bg-black opacity-30 z-10" />
        <div className="max-w-3xl mx-auto">
          <h1 className="relative z-20 text-white text-5xl font-bold mt-20">Get In Touch</h1>
          <p className="relative z-20 text-white text-lg mt-5">
            Have questions about our products or services? We&apos;re here to help! Reach out to our
            friendly customer service team.
          </p>
        </div>
      </section>
    </>
  )
}