'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useCart } from '@/providers/Cart'
import { useWishlist } from '@/providers/Wishlist'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import Image from 'next/image'
import { AlignJustify, Search, ShoppingCart, Heart } from 'lucide-react'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useAuth } from '@/providers/Auth'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const { totalItems: cartItems } = useCart()
  const { totalItems: wishlistItems } = useWishlist()
  const pathname = usePathname()
  const { user } = useAuth()
  const isMobile = useMediaQuery('(max-width: 640px)')
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const headerClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
    isScrolled ? 'bg-white shadow-lg py-3' : 'bg-[#F8F6F6] py-5'
  } `

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href
    const baseClasses = `hover:text-[#07470F] transition-colors duration-300 text-lg font-medium`
    const activeClasses = isActive
      ? isScrolled
        ? 'text-[#34CC34] font-bold'
        : 'text-black font-bold'
      : ''
    const scrollClasses = isScrolled
      ? 'text-black hover:text-[#34CC34] font-semibold'
      : 'text-black'
    return `${baseClasses} ${isActive ? activeClasses : scrollClasses}`
  }

  const getLinkMobile = (href: string) => {
    const isActive = pathname === href
    const baseClasses = `text-black hover:text-[#194754] transition-colors duration-300 text-lg font-medium`
    const activeClasses = isActive
      ? isScrolled
        ? 'text-[#194754] font-bold'
        : 'text-black font-bold'
      : ''
    const scrollClasses = isScrolled
      ? 'text-black hover:text-[#34CC34] font-bold'
      : 'text-black font-bold'
    return `${baseClasses} ${isActive ? activeClasses : scrollClasses}`
  }

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  const MobileDrawerContent = () => (
    <DrawerContent>
      <div className="mx-auto my-8">
        <Image src="/assets/cbgs-logo.png" alt="Cbgs-logo" width={80} height={45} priority />
      </div>
      <div className="flex flex-col space-y-6 mx-auto my-8 px-6 pb-8">
        {/* User Info Section */}
        {user ? (
          <div className="pb-4 border-b border-gray-200">
            <p className="text-lg font-semibold text-gray-900">
              Hi, {user.name || user.email?.split('@')[0]}
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        ) : (
          <div className="pb-4 border-b border-gray-200">
            <Link href="/auth/login" onClick={handleMobileLinkClick}>
              <button className="w-full bg-[#084710] hover:bg-black text-white text-md py-3 rounded-lg transition-colors">
                Sign In
              </button>
            </Link>
            <p className="text-center text-sm text-gray-600 mt-2">
              New customer?{' '}
              <Link
                href="/auth/register"
                className="text-[#084710] font-semibold"
                onClick={handleMobileLinkClick}
              >
                Create account
              </Link>
            </p>
          </div>
        )}

        {/* Navigation Links */}
        <Link
          href="/wishlist"
          className={getLinkMobile('/wishlist')}
          onClick={handleMobileLinkClick}
        >
          <div className="flex items-center gap-3 relative">
            <span className="relative">
              <Heart className="w-6 h-6" />
              {wishlistItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {wishlistItems > 99 ? '99+' : wishlistItems}
                </span>
              )}
            </span>
            <span>Wishlist</span>
          </div>
        </Link>

        <Link href="/cart" className={getLinkMobile('/cart')} onClick={handleMobileLinkClick}>
          <div className="flex items-center gap-3 relative">
            <span className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#084710] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItems > 99 ? '99+' : cartItems}
                </span>
              )}
            </span>
            <span>Cart</span>
          </div>
        </Link>

        {user && (
          <Link href="/orders" className={getLinkMobile('/orders')} onClick={handleMobileLinkClick}>
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M3 10H2V4.00293C2 3.44903 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.43788 22 4.00293V10H21V20.0015C21 20.553 20.5551 21 20.0066 21H3.9934C3.44476 21 3 20.5525 3 20.0015V10ZM19 10H5V19H19V10ZM4 5V8H20V5H4ZM9 12H15V14H9V12Z"></path>
              </svg>
              <span>My Orders</span>
            </div>
          </Link>
        )}

        {user && (
          <Link
            href="/account"
            className={getLinkMobile('/account')}
            onClick={handleMobileLinkClick}
          >
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M9.74462 21.7446C5.30798 20.7219 2 16.7473 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 16.7473 18.692 20.7219 14.2554 21.7446L12 24L9.74462 21.7446ZM7.01173 18.2567C7.92447 18.986 9.00433 19.5215 10.1939 19.7957L10.7531 19.9246L12 21.1716L13.2469 19.9246L13.8061 19.7957C15.0745 19.5033 16.2183 18.9139 17.1676 18.1091C15.8965 16.8078 14.1225 16 12.1597 16C10.1238 16 8.29083 16.8692 7.01173 18.2567ZM5.61562 16.8214C7.25644 15.0841 9.58146 14 12.1597 14C14.644 14 16.8931 15.0065 18.5216 16.634C19.4563 15.3185 20 13.7141 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 13.7964 4.59708 15.4722 5.61562 16.8214ZM12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13ZM12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"></path>
              </svg>
              <span>Account Settings</span>
            </div>
          </Link>
        )}

        <Link href="/blog" className={getLinkMobile('/blog')} onClick={handleMobileLinkClick}>
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM19 20V4H5V20H19ZM7 6H11V10H7V6ZM7 12H17V14H7V12ZM7 16H17V18H7V16ZM13 7H17V9H13V7Z"></path>
            </svg>
            <span>Blog</span>
          </div>
        </Link>

        <Link href="/contact" className={getLinkMobile('/contact')} onClick={handleMobileLinkClick}>
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM5.76282 17H20V5H4V18.3851L5.76282 17ZM11 10H13V12H11V10ZM7 10H9V12H7V10ZM15 10H17V12H15V10Z"></path>
            </svg>
            <span>Contact Us</span>
          </div>
        </Link>

        {/* Sign Out Button for Logged In Users */}
        {user && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                // Add sign out logic here
                handleMobileLinkClick()
              }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M5 11H13V13H5V16L0 12L5 8V11ZM3.99927 18H6.70835C8.11862 19.2447 9.97111 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.97111 4 8.11862 4.75527 6.70835 6H3.99927C5.82368 3.57111 8.72836 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C8.72836 22 5.82368 20.4289 3.99927 18Z"></path>
              </svg>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </DrawerContent>
  )

  return (
    <header className={headerClasses}>
      {isDesktop && (
        <div className="container rounded-[40px] mx-auto px-4 py-1 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            {isScrolled ? (
              <Image
                src="/assets/cbgs-logo.png"
                alt="Chiks E-commerce"
                width={80}
                height={45}
                priority
              />
            ) : (
              <Image
                src="/assets/cbgs-logo.png"
                alt="Chiks E-commerce"
                width={80}
                height={45}
                priority
              />
            )}
          </Link>
          <div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                className="peer block w-[500px] rounded-xl border py-[9px] pl-10 text-lg"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-[24px] w-[24px] -translate-y-1/2" />
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className={getLinkClasses('/about')}>
              <div className="flex items-center gap-2">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-message-circle-question-mark-icon lucide-message-circle-question-mark"
                  >
                    <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="flex items-center gap-1">
                      Help{' '}
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="currentColor"
                        >
                          <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                        </svg>
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Support</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      {' '}
                      <Link href="/contact" className={getLinkClasses('/contact')}>
                        <span className="text-[16px] flex-grow text-right">Contact Us</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/contact" className={getLinkClasses('/contact')}>
                        <span className="text-[16px] flex-grow text-right">Track an order</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/contact" className={getLinkClasses('/contact')}>
                        <span className="text-[16px] flex-grow text-right">Cancel an order</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/contact" className={getLinkClasses('/contact')}>
                        <span className="text-[16px] flex-grow text-right">Return a product</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Link>

            <Link href="/cart" className={getLinkClasses('/cart')}>
              <div className="flex items-center gap-2 relative">
                <span className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {cartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#084710] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartItems > 99 ? '99+' : cartItems}
                    </span>
                  )}
                </span>
                <span>Cart</span>
              </div>
            </Link>
            {/* <Link href="/shop" className={getLinkClasses('/properties')}>
              <div className="flex items-center gap-2">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-bookmark-icon lucide-bookmark"
                  >
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                </span>
                <span>Wishlist</span>
              </div>
            </Link> */}

            {user ? (
              <div className="flex gap-2 items-center">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-user-icon lucide-circle-user"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                  </svg>
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="flex items-center text-lg gap-1">
                      Account{' '}
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="currentColor"
                        >
                          <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                        </svg>
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      {' '}
                      <span className="text-[16px] flex-grow text-right">Hi, Firstname</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                      {' '}
                      <Link href="/wishlist" className={getLinkClasses('/wishlist')}>
                        <div className="flex items-center gap-6 w-full relative">
                          <span className="relative">
                            <Heart className="w-6 h-6" />
                            {wishlistItems > 0 && (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                                {wishlistItems > 99 ? '99+' : wishlistItems}
                              </span>
                            )}
                          </span>
                          <span className="text-[16px] flex-grow text-right">Wishlist</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {' '}
                      <Link href="/wishlist" className={getLinkClasses('/wishlist')}>
                        <div className="flex items-center justify-between gap-6 relative">
                          <span className="relative">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="32"
                              height="32"
                              fill="currentColor"
                            >
                              <path d="M3 10H2V4.00293C2 3.44903 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.43788 22 4.00293V10H21V20.0015C21 20.553 20.5551 21 20.0066 21H3.9934C3.44476 21 3 20.5525 3 20.0015V10ZM19 10H5V19H19V10ZM4 5V8H20V5H4ZM9 12H15V14H9V12Z"></path>
                            </svg>
                          </span>
                          <span className="text-[16px] flex-grow text-right">Orders</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {' '}
                      <Link href="/wishlist" className={getLinkClasses('/profile')}>
                        <div className="flex items-center justify-between gap-6 relative">
                          <span className="relative">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="32"
                              height="32"
                              fill="currentColor"
                            >
                              <path d="M9.74462 21.7446C5.30798 20.7219 2 16.7473 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 16.7473 18.692 20.7219 14.2554 21.7446L12 24L9.74462 21.7446ZM7.01173 18.2567C7.92447 18.986 9.00433 19.5215 10.1939 19.7957L10.7531 19.9246L12 21.1716L13.2469 19.9246L13.8061 19.7957C15.0745 19.5033 16.2183 18.9139 17.1676 18.1091C15.8965 16.8078 14.1225 16 12.1597 16C10.1238 16 8.29083 16.8692 7.01173 18.2567ZM5.61562 16.8214C7.25644 15.0841 9.58146 14 12.1597 14C14.644 14 16.8931 15.0065 18.5216 16.634C19.4563 15.3185 20 13.7141 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 13.7964 4.59708 15.4722 5.61562 16.8214ZM12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13ZM12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"></path>
                            </svg>
                          </span>
                          <span className="text-[16px] flex-grow text-right">
                            Account Management
                          </span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {' '}
                      <button className="bg-red-500 text-red-500 flex gap-3 items-center hover:bg-black text-md py-2 w-full rounded-lg">
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="32"
                            height="32"
                            fill="rgba(242,9,9,1)"
                          >
                            <path d="M5 11H13V13H5V16L0 12L5 8V11ZM3.99927 18H6.70835C8.11862 19.2447 9.97111 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.97111 4 8.11862 4.75527 6.70835 6H3.99927C5.82368 3.57111 8.72836 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C8.72836 22 5.82368 20.4289 3.99927 18Z"></path>
                          </svg>
                        </span>
                        <span> Sign Out </span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-user-icon lucide-circle-user"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                  </svg>
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="flex items-center text-lg gap-1">
                      Account{' '}
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="currentColor"
                        >
                          <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                        </svg>
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/auth/login" className="w-full">
                        <button className="bg-[#084710] hover:bg-black text-white text-md py-2 w-full rounded-lg">
                          Sign In
                        </button>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                      {' '}
                      <Link href="/wishlist" className={getLinkClasses('/wishlist')}>
                        <div className="flex items-center gap-6 w-full relative">
                          <span className="relative">
                            <Heart className="w-6 h-6" />
                            {wishlistItems > 0 && (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                                {wishlistItems > 99 ? '99+' : wishlistItems}
                              </span>
                            )}
                          </span>
                          <span className="text-[16px] flex-grow text-right">Wishlist</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {' '}
                      <Link href="/wishlist" className={getLinkClasses('/wishlist')}>
                        <div className="flex items-center justify-between gap-6 relative">
                          <span className="relative">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="32"
                              height="32"
                              fill="currentColor"
                            >
                              <path d="M3 10H2V4.00293C2 3.44903 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.43788 22 4.00293V10H21V20.0015C21 20.553 20.5551 21 20.0066 21H3.9934C3.44476 21 3 20.5525 3 20.0015V10ZM19 10H5V19H19V10ZM4 5V8H20V5H4ZM9 12H15V14H9V12Z"></path>
                            </svg>
                          </span>
                          <span className="text-[16px] flex-grow text-right">Orders</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      )}

      {isTablet && (
        <div className="container rounded-[40px] mx-auto px-4 py-2 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            {isScrolled ? (
              <Image
                src="/assets/cbgs-logo.png"
                alt="Chiks E-commerce"
                width={80}
                height={45}
                priority
              />
            ) : (
              <Image
                src="/assets/cbgs-logo.png"
                alt="Chiks E-commerce"
                width={80}
                height={45}
                priority
              />
            )}
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full bg-white hover:bg-black text-black hover:text-white border border-[#0000004D] transition-colors duration-300">
              <Link href="/cart" className="">
                <span className="sr-only">Cart</span>
                <span className="relative">
                  <ShoppingCart className="w-8 h-8" />
                  {cartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#084710] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartItems > 99 ? '99+' : cartItems}
                    </span>
                  )}
                </span>
              </Link>
            </button>
            <Drawer direction="right" open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DrawerTrigger asChild>
                <button className="p-2 rounded-full bg-white hover:bg-black text-black hover:text-white border border-[#0000004D] transition-colors duration-300">
                  <AlignJustify size={32} color={isScrolled ? '#111111' : 'currentColor'} />
                </button>
              </DrawerTrigger>
              <MobileDrawerContent />
            </Drawer>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="container rounded-[40px] mx-auto px-4 py-2 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            {isScrolled ? (
              <Image
                src="/assets/cbgs-logo.png"
                alt="Chiks Global"
                width={60}
                height={35}
                priority
              />
            ) : (
              <Image
                src="/assets/cbgs-logo.png"
                alt="Chiks Global E-commerce"
                width={60}
                height={35}
                priority
              />
            )}
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full bg-white hover:bg-black text-black hover:text-white border border-[#0000004D] transition-colors duration-300">
              <Link href="/cart" className="">
                <span className="sr-only">Cart</span>
                <span className="relative">
                  <ShoppingCart className="w-8 h-8" />
                  {cartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#084710] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartItems > 99 ? '99+' : cartItems}
                    </span>
                  )}
                </span>
              </Link>
            </button>
            <Drawer direction="right" open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DrawerTrigger asChild>
                {isScrolled ? (
                  <button className="p-2 rounded-full bg-white hover:bg-black text-black hover:text-white border border-[#0000004D] transition-colors duration-300">
                    <AlignJustify size={32} color="#111111" />
                  </button>
                ) : (
                  <button className="p-2 rounded-full bg-white hover:bg-black text-black hover:text-white border border-[#0000004D] transition-colors duration-300">
                    <AlignJustify size={32} />
                  </button>
                )}
              </DrawerTrigger>
              <MobileDrawerContent />
            </Drawer>
          </div>
        </div>
      )}
    </header>
  )
}
