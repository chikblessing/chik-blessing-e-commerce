'use client'

import React from 'react'
import { AuthProvider } from './Auth'
import { CartProvider } from './Cart'
import { WishlistProvider } from './Wishlist'
import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
