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

import { useAuth } from  '@/providers/Auth'

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
  const { user } = useAuth();
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
      <div className="flex flex-col h-full space-y-8 mx-auto my-8">
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
        <Link href="/blog" className={getLinkMobile('/blog')} onClick={handleMobileLinkClick}>
          Blog
        </Link>
        <Link href="/contact" className={getLinkMobile('/contact')} onClick={handleMobileLinkClick}>
          Contact
        </Link>

        <button className="py-2 px-4 rounded-3xl bg-[#194754] hover:bg-black text-white text-lg hover:text-gray-200 transition-colors duration-300">
          <Link
            href="/book-visit"
            className="flex items-center gap-2"
            onClick={handleMobileLinkClick}
          >
            <span>Book a Visit</span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="rgba(255,255,255,1)"
              >
                <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path>
              </svg>
            </span>
          </Link>
        </button>
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
                    <DropdownMenuItem>Contact Us</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Link>
            <Link href="/wishlist" className={getLinkClasses('/wishlist')}>
              <div className="flex items-center gap-2 relative">
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
                    <div className="flex items-center gap-1">
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
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Orders</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              
            ):(
              <button className="bg-[#084710] hover:bg-black text-white text-md py-3 px-6 rounded-xl">Sign In/ Sign Up</button>
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
            <button className="p-2 rounded-full bg-[#194754] hover:bg-black text-white hover:text-gray-200 transition-colors duration-300">
              <Link href="/search" className="">
                <span className="sr-only">Search</span>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </Link>
            </button>
            <Drawer direction="right" open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DrawerTrigger asChild>
                {isScrolled ? (
                  <button className="bg-[#E7C873] p-2 rounded-xl">
                    <AlignJustify size={32} color="#194754" />
                  </button>
                ) : (
                  <button>
                    <AlignJustify size={32} color="#ffffff" />
                  </button>
                )}
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
                width={80}
                height={45}
                priority
              />
            ) : (
              <Image
                src="/assets/cbgs-logo.png"
                alt="Chiks Global E-commerce"
                width={80}
                height={45}
                priority
              />
            )}
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full bg-[#194754] hover:bg-black text-white hover:text-gray-200 transition-colors duration-300">
              <Link href="/search" className="">
                <span className="sr-only">Search</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </Link>
            </button>
            <Drawer direction="right" open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DrawerTrigger asChild>
                {isScrolled ? (
                  <button className="bg-[#E7C873] p-2 rounded-xl">
                    <AlignJustify size={32} color="#194754" />
                  </button>
                ) : (
                  <button>
                    <AlignJustify size={32} color="#ffffff" />
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
