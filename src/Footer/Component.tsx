import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import type { Footer } from '@/payload-types'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import Image from 'next/image'
import { Input } from '@/components/ui/input'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []

  return (
    <footer className="relative">
      {/* Subscribe box */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -top-16 w-full max-w-4xl mx-auto px-4">
        <div className="bg-[#084710] rounded-xl px-8 py-6 text-center shadow-lg">
          <h3 className="text-white text-xl md:text-2xl font-bold mb-4">
            Subscribe for the Latest Offers & Updates
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-[#084710] font-semibold rounded-lg hover:bg-black hover:text-white transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      {/* Subscribe box end */}

      <div className="min-h-[300px] mt-auto border-t border-border bg-[#F8F6F6] text-black pt-24">
        <div className="container py-8 px-4 md:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
              <Link className="flex items-center" href="/">
                <Image
                  src="/assets/cbgs-logo.png"
                  alt="Chiks E-commerce"
                  width={80}
                  height={45}
                  priority
                />
              </Link>

              <p className="text-sm md:text-base font-medium text-[#00000099] leading-relaxed max-w-md">
                Your trusted source for everyday needs. We make grocery shopping effortless with
                secure payments, timely deliveries, and a commitment to serving you better, every
                time.
              </p>
              <div>
                <div className="flex gap-4 items-center">
                  <span className="p-3 rounded-full border border-[#00000033] hover:bg-black hover:text-white transition-all duration-300 cursor-pointer group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="currentColor"
                    >
                      <path d="M17.6874 3.0625L12.6907 8.77425L8.37045 3.0625H2.11328L9.58961 12.8387L2.50378 20.9375H5.53795L11.0068 14.6886L15.7863 20.9375H21.8885L14.095 10.6342L20.7198 3.0625H17.6874ZM16.6232 19.1225L5.65436 4.78217H7.45745L18.3034 19.1225H16.6232Z"></path>
                    </svg>
                  </span>
                  <span className="p-3 rounded-full border border-[#00000033] hover:bg-black hover:text-white transition-all duration-300 cursor-pointer group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="currentColor"
                    >
                      <path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"></path>
                    </svg>
                  </span>
                  <span className="p-3 rounded-full border border-[#00000033] hover:bg-black hover:text-white transition-all duration-300 cursor-pointer group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="currentColor"
                    >
                      <path d="M12.001 9C10.3436 9 9.00098 10.3431 9.00098 12C9.00098 13.6573 10.3441 15 12.001 15C13.6583 15 15.001 13.6569 15.001 12C15.001 10.3427 13.6579 9 12.001 9ZM12.001 7C14.7614 7 17.001 9.2371 17.001 12C17.001 14.7605 14.7639 17 12.001 17C9.24051 17 7.00098 14.7629 7.00098 12C7.00098 9.23953 9.23808 7 12.001 7ZM18.501 6.74915C18.501 7.43926 17.9402 7.99917 17.251 7.99917C16.5609 7.99917 16.001 7.4384 16.001 6.74915C16.001 6.0599 16.5617 5.5 17.251 5.5C17.9393 5.49913 18.501 6.0599 18.501 6.74915ZM12.001 4C9.5265 4 9.12318 4.00655 7.97227 4.0578C7.18815 4.09461 6.66253 4.20007 6.17416 4.38967C5.74016 4.55799 5.42709 4.75898 5.09352 5.09255C4.75867 5.4274 4.55804 5.73963 4.3904 6.17383C4.20036 6.66332 4.09493 7.18811 4.05878 7.97115C4.00703 9.0752 4.00098 9.46105 4.00098 12C4.00098 14.4745 4.00753 14.8778 4.05877 16.0286C4.0956 16.8124 4.2012 17.3388 4.39034 17.826C4.5591 18.2606 4.7605 18.5744 5.09246 18.9064C5.42863 19.2421 5.74179 19.4434 6.17187 19.6094C6.66619 19.8005 7.19148 19.9061 7.97212 19.9422C9.07618 19.9939 9.46203 20 12.001 20C14.4755 20 14.8788 19.9934 16.0296 19.9422C16.8117 19.9055 17.3385 19.7996 17.827 19.6106C18.2604 19.4423 18.5752 19.2402 18.9074 18.9085C19.2436 18.5718 19.4445 18.2594 19.6107 17.8283C19.8013 17.3358 19.9071 16.8098 19.9432 16.0289C19.9949 14.9248 20.001 14.5389 20.001 12C20.001 9.52552 19.9944 9.12221 19.9432 7.97137C19.9064 7.18906 19.8005 6.66149 19.6113 6.17318C19.4434 5.74038 19.2417 5.42635 18.9084 5.09255C18.573 4.75715 18.2616 4.55693 17.8271 4.38942C17.338 4.19954 16.8124 4.09396 16.0298 4.05781C14.9258 4.00605 14.5399 4 12.001 4ZM12.001 2C14.7176 2 15.0568 2.01 16.1235 2.06C17.1876 2.10917 17.9135 2.2775 18.551 2.525C19.2101 2.77917 19.7668 3.1225 20.3226 3.67833C20.8776 4.23417 21.221 4.7925 21.476 5.45C21.7226 6.08667 21.891 6.81333 21.941 7.8775C21.9885 8.94417 22.001 9.28333 22.001 12C22.001 14.7167 21.991 15.0558 21.941 16.1225C21.8918 17.1867 21.7226 17.9125 21.476 18.55C21.2218 19.2092 20.8776 19.7658 20.3226 20.3217C19.7668 20.8767 19.2076 21.22 18.551 21.475C17.9135 21.7217 17.1876 21.89 16.1235 21.94C15.0568 21.9875 14.7176 22 12.001 22C9.28431 22 8.94514 21.99 7.87848 21.94C6.81431 21.8908 6.08931 21.7217 5.45098 21.475C4.79264 21.2208 4.23514 20.8767 3.67931 20.3217C3.12348 19.7658 2.78098 19.2067 2.52598 18.55C2.27848 17.9125 2.11098 17.1867 2.06098 16.1225C2.01348 15.0558 2.00098 14.7167 2.00098 12C2.00098 9.28333 2.01098 8.94417 2.06098 7.8775C2.11014 6.8125 2.27848 6.0875 2.52598 5.45C2.78014 4.79167 3.12348 4.23417 3.67931 3.67833C4.23514 3.1225 4.79348 2.78 5.45098 2.525C6.08848 2.2775 6.81348 2.11 7.87848 2.06C8.94514 2.0125 9.28431 2 12.001 2Z"></path>
                    </svg>
                  </span>
                  <span className="p-3 rounded-full border border-[#00000033] hover:bg-black hover:text-white transition-all duration-300 cursor-pointer group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="currentColor"
                    >
                      <path d="M12.001 9.55005C12.9181 8.61327 14.1121 8 15.501 8C18.5385 8 21.001 10.4624 21.001 13.5V21H19.001V13.5C19.001 11.567 17.434 10 15.501 10C13.568 10 12.001 11.567 12.001 13.5V21H10.001V8.5H12.001V9.55005ZM5.00098 6.5C4.17255 6.5 3.50098 5.82843 3.50098 5C3.50098 4.17157 4.17255 3.5 5.00098 3.5C5.8294 3.5 6.50098 4.17157 6.50098 5C6.50098 5.82843 5.8294 6.5 5.00098 6.5ZM4.00098 8.5H6.00098V21H4.00098V8.5Z"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Explore Section */}
              <div className="space-y-3">
                <h3 className="font-bold text-base md:text-lg text-black">Explore</h3>
                <nav className="space-y-2">
                  <Link
                    href="/properties"
                    className="block text-sm md:text-base text-[#00000099] hover:text-[#07470F] transition-colors duration-200"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/rent"
                    className="block text-sm md:text-base text-[#00000099] hover:text-[#07470F] transition-colors duration-200"
                  >
                    Agricultural Export Information
                  </Link>
                  <Link
                    href="/short-term"
                    className="block text-sm md:text-base text-[#00000099] hover:text-[#07470F] transition-colors duration-200"
                  >
                    Shipping Information
                  </Link>
                  <Link
                    href="/new-projects"
                    className="block text-sm md:text-base text-[#00000099] hover:text-[#07470F] transition-colors duration-200"
                  >
                    Customer Service
                  </Link>
                </nav>
              </div>

              {/* Service Section */}
              <div className="space-y-3">
                <h3 className="font-bold text-base md:text-lg text-black">Resources</h3>
                <nav className="space-y-2">
                  <p className="block text-sm md:text-base text-[#00000099] hover:text-[#07470F] transition-colors duration-200">
                    How to shop on Chik Blessing
                  </p>
                  <p className="block text-sm md:text-base text-[#00000099] hover:text-[#07470F] transition-colors duration-200">
                    Delivery options and timeline
                  </p>
                  <p className="block text-sm md:text-base text-[#00000099] hover:text-[#07470F] transition-colors duration-200">
                    How to return a product
                  </p>
                </nav>
              </div>

              {/* Quick Links Section */}
              <div className="space-y-3">
                <h3 className="font-bold text-base md:text-lg text-black">Quick Links</h3>
                <nav className="space-y-2">
                  <Link
                    href="/blog"
                    className="block text-sm md:text-base text-[#00000099] hover:text-[#07470F] transition-colors duration-200"
                  >
                    Blogs
                  </Link>
                  <Link
                    href="/faqs"
                    className="block text-sm md:text-base text-[#00000099] hover:text-[#07470F] transition-colors duration-200"
                  >
                    FAQs
                  </Link>
                  <Link
                    href="/reviews"
                    className="block text-sm md:text-base text-[#00000099] hover:text-[#07470F] transition-colors duration-200"
                  >
                    Reviews
                  </Link>
                </nav>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-8 pt-6 border-t border-black/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-black/60">
              <p>© 2025 Chiks Blessing Global Limited. All rights reserved.</p>
              <div className="flex gap-4">
                <Link
                  href="/privacy"
                  className="hover:text-black/80 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-black/80 transition-colors duration-200">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
