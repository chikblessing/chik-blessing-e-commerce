'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from '../Auth'
import { Product } from '@/payload-types'
import { apiClient } from '../Auth/apiClient'

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type WishlistItem = {
  product: Product
  addedAt: Date
}

type WishlistContextType = {
  items: WishlistItem[]
  addItem: (product: Product) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => Promise<void>
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  addItem: async () => {},
  removeItem: async () => {},
  isInWishlist: () => false,
  clearWishlist: async () => {},
  totalItems: 0,
})

export const useWishlist = () => useContext(WishlistContext)

// ----------------------------------------------------------------------
// PROVIDER IMPLEMENTATION
// ----------------------------------------------------------------------

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const userAny = user as any
  const isInitialLoad = useRef(true)

  // Sync with server
  const syncWithServer = async (newItems: WishlistItem[]) => {
    if (!user || !token) return

    try {
      await apiClient('users/wishlist', {
        method: 'POST',
        token: token,
        body: {
          wishlist: newItems.map((item) => ({
            product: item.product.id,
            addedAt: item.addedAt,
          })),
        },
      })
    } catch (error) {
      console.error('Failed to sync wishlist:', error)
    }
  }

  // Merge guest wishlist with server wishlist
  const mergeWishlist = async (guestWishlist: WishlistItem[]) => {
    if (!user || !token) return

    await syncWithServer(guestWishlist)
    localStorage.removeItem('wishlist')
  }

  // Initial load
  useEffect(() => {
    if (user && userAny.wishlist) {
      // User is logged in, load wishlist from server
      const wishlistItems = userAny.wishlist.map((item: any) => ({
        product: typeof item.product === 'string' ? { id: item.product } : item.product,
        addedAt: new Date(item.addedAt),
      })) as WishlistItem[]
      setItems(wishlistItems)

      // Merge guest wishlist if exists
      const savedWishlist = localStorage.getItem('wishlist')
      if (isInitialLoad.current && savedWishlist) {
        const guestWishlist = JSON.parse(savedWishlist)
        mergeWishlist(guestWishlist)
      }
    } else if (!user) {
      // User is guest, load from local storage
      const savedWishlist = localStorage.getItem('wishlist')
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist)
        const wishlistItems = parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }))
        setItems(wishlistItems)
      }
    }

    isInitialLoad.current = false
  }, [user])

  // Local storage persistence
  useEffect(() => {
    if (!user) {
      localStorage.setItem('wishlist', JSON.stringify(items))
    }
    if (user) {
      syncWithServer(items)
    }
  }, [items, user])

  // Wishlist actions
  const addItem = async (product: Product) => {
    const existingIndex = items.findIndex((item) => item.product.id === product.id)

    if (existingIndex >= 0) {
      // Item already in wishlist, don't add again
      return
    }

    const newItem: WishlistItem = {
      product,
      addedAt: new Date(),
    }

    setItems([...items, newItem])
  }

  const removeItem = async (productId: string) => {
    const newItems = items.filter((item) => item.product.id !== productId)
    setItems(newItems)
  }

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.product.id === productId)
  }

  const clearWishlist = async () => {
    setItems([])
  }

  const totalItems = items.length

  const value = {
    items,
    addItem,
    removeItem,
    isInWishlist,
    clearWishlist,
    totalItems,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
