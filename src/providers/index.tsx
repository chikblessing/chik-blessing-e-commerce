import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { AuthProvider } from './Auth'
import { CartProvider } from './Cart'
import { WishlistProvider } from './Wishlist'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <AuthProvider>
          {' '}
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>{' '}
          </CartProvider>{' '}
        </AuthProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
