'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
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
              <WishlistProvider>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#fff',
                      color: '#333',
                      padding: '16px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                    success: {
                      iconTheme: {
                        primary: '#084710',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
                {children}
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </HeaderThemeProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
