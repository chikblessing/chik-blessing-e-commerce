// providers/Wishlist/index.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '../Auth'
import { apiClient } from '../Auth/apiClient' // 🟢 Assuming apiClient is available

// ----------------------------------------------------------------------
// TYPES & CONTEXT
// ----------------------------------------------------------------------

type WishlistContextType = {
  items: string[] // Array of Product IDs
  addItem: (productId: string) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  toggleItem: (productId: string) => Promise<void>
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  addItem: async () => {},
  removeItem: async () => {},
  isInWishlist: () => false,
  toggleItem: async () => {},
})

export const useWishlist = () => useContext(WishlistContext)

// ----------------------------------------------------------------------
// PROVIDER IMPLEMENTATION
// ----------------------------------------------------------------------

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuth()
  const [items, setItems] = useState<string[]>([])
  const userAny = user as any // Type assertion for user properties
  // --- 1. INITIAL LOAD & SYNCHRONIZATION ---

  useEffect(() => {
    // If user is logged in, load from server's wishlist field
    if (user && userAny.wishlist) {
      const wishlistIds = userAny.wishlist.map(
        (
          item: any, // Handles both populated object (item.id) and string ID (item)
        ) => (typeof item === 'string' ? item : item.id),
      )
      setItems(wishlistIds)
    } else {
      // If user is a guest, load from local storage
      const savedWishlist = localStorage.getItem('wishlist')
      if (savedWishlist) {
        setItems(JSON.parse(savedWishlist))
      }
    }
  }, [user]) // --- 2. LOCAL STORAGE PERSISTENCE (Guests Only) ---

  useEffect(() => {
    if (!user) {
      localStorage.setItem('wishlist', JSON.stringify(items))
    }
  }, [items, user]) // --- 3. SERVER SYNCHRONIZATION HELPER ---

  const syncWithServer = async (action: 'add' | 'remove', productId: string) => {
    if (!user || !token) return

    try {
      // 🟢 API ABSTRACTION: Use apiClient for clean and secure fetch
      await apiClient('users/wishlist', {
        method: 'POST',
        token: token,
        body: { productId, action },
      })
    } catch (error) {
      // 🟢 OPTION A IMPLEMENTATION: Log error but do NOT revert local state.
      // This ensures a smooth UX, assuming the server will eventually be correct.
      console.error('Wishlist sync failed (UX maintained):', error)
    }
  } // --- 4. CART ACTIONS ---

  const addItem = async (productId: string) => {
    if (!items.includes(productId)) {
      const newItems = [...items, productId]
      setItems(newItems)
      await syncWithServer('add', productId)
    }
  }

  const removeItem = async (productId: string) => {
    const newItems = items.filter((id) => id !== productId)
    setItems(newItems)
    await syncWithServer('remove', productId)
  }

  const isInWishlist = (productId: string) => items.includes(productId)

  const toggleItem = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeItem(productId)
    } else {
      await addItem(productId)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        toggleItem,
      }}
    >
      
       {children}
       {' '}
    </WishlistContext.Provider>
  )
}
