'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
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
    <SessionProvider>
      <ThemeProvider>
        <HeaderThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>{children}</WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </HeaderThemeProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
