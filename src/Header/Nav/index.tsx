'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
// import { useCart } from '@/providers/Cart'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  // const { count } = useCart()

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
      <Link href="/cart" className="relative inline-flex items-center">
        <span className="sr-only">Cart</span>
        <span className="i-lucide-shopping-cart w-5 h-5 text-primary" />
        {/* {count > 0 && (
          <span className="absolute -top-2 -right-2 text-[10px] bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center">
            {count}
          </span>
        )} */}
      </Link>
    </nav>
  )
}
