'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '../Auth'
import { Product } from '@/payload-types'
import { apiClient } from '../Auth/apiClient' // 🟢 Assume the apiClient is available

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

// 🟢 CRITICAL: CartItem now tracks the specific variant via SKU
type CartItem = {
  product: Product
  quantity: number
  variantSku: string // Unique identifier for the chosen product option
}

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product, variantSku: string, quantity?: number) => Promise<void>
  removeItem: (productId: string, variantSku: string) => Promise<void>
  updateQuantity: (productId: string, variantSku: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: async () => {},
  removeItem: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  totalItems: 0,
  totalPrice: 0,
})

export const useCart = () => useContext(CartContext)

// ----------------------------------------------------------------------
// PROVIDER IMPLEMENTATION
// ----------------------------------------------------------------------

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const userAny = user as any // Type assertion for user properties
  // --- 1. INITIAL LOAD & SYNCHRONIZATION ---

  useEffect(() => {
    // If user logs in, load cart from server (Payload user collection)
    if (user && userAny.cart) {
      const cartItems = userAny.cart.map((item: any) => ({
        // Handle unpopulated relationship (string ID) from server
        product: typeof item.product === 'string' ? { id: item.product } : item.product,
        quantity: item.quantity,
        variantSku: item.sku, // Map server's 'sku' field to frontend's 'variantSku'
      })) as CartItem[]
      setItems(cartItems)
    } else {
      // If no user (guest), load cart from local storage
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        // ⚠️ NOTE: This assumes localStorage cart structure matches CartItem[]
        setItems(JSON.parse(savedCart))
      }
    }
  }, [user]) // --- 2. LOCAL STORAGE PERSISTENCE (For Guests Only) ---

  useEffect(() => {
    // Only save to local storage if the user is a guest
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, user]) // --- 3. SERVER SYNCHRONIZATION (Authenticated Users Only) ---

  const syncWithServer = async (newItems: CartItem[]) => {
    if (!user || !token) return

    try {
      // 🟢 API ABSTRACTION: Use the apiClient for cleaner, safer calls
      await apiClient('users/cart', {
        method: 'POST',
        token: token, // Pass token for Authorization header
        body: {
          cart: newItems.map((item) => ({
            // Map frontend's variantSku back to server's 'sku' field
            product: item.product.id,
            sku: item.variantSku,
            quantity: item.quantity,
          })),
        },
      })
    } catch (error) {
      console.error('Failed to sync cart:', error)
    }
  } // --- 4. CART ACTIONS ---

  const addItem = async (product: Product, variantSku: string, quantity = 1) => {
    const newItems = [...items] // Find existing item by BOTH product ID and variant SKU
    const existingIndex = newItems.findIndex(
      (item) => item.product.id === product.id && item.variantSku === variantSku,
    )

    if (existingIndex >= 0) {
      newItems[existingIndex].quantity += quantity
    } else {
      newItems.push({ product, quantity, variantSku })
    }

    setItems(newItems)
    await syncWithServer(newItems)
  } // 🟢 Requires both ID and SKU to ensure the right variant is removed

  const removeItem = async (productId: string, variantSku: string) => {
    const newItems = items.filter(
      (item) => !(item.product.id === productId && item.variantSku === variantSku),
    )
    setItems(newItems)
    await syncWithServer(newItems)
  } // 🟢 Requires both ID and SKU to ensure the right variant quantity is updated

  const updateQuantity = async (productId: string, variantSku: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId, variantSku)
      return
    }

    const newItems = items.map((item) =>
      item.product.id === productId && item.variantSku === variantSku
        ? { ...item, quantity }
        : item,
    )
    setItems(newItems)
    await syncWithServer(newItems)
  }

  const clearCart = async () => {
    setItems([])
    await syncWithServer([])
  } // --- 5. CALCULATIONS ---

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = items.reduce((sum, item) => {
    // 🟢 FIX: Access price fields directly from the item.product object.
    const product = item.product as any // Still assert as 'any' for safety

    // Prioritize salePrice, then fall back to price, then 0.
    const price = product.salePrice || product.price || 0

    return sum + price * item.quantity
  }, 0)

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
// 'use client'
// import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// type CartItem = {
//   id: string
//   title: string
//   price: number
//   quantity: number
//   imageUrl?: string
//   slug?: string
//   variantName?: string
// }

// type CartContextValue = {
//   items: CartItem[]
//   totalItems: number
//   totalPrice: number
//   addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
//   removeItem: (id: string, variantName?: string) => void
//   clear: () => void
// }

// const CartContext = createContext<{
//   items: CartItem[]
//   totalItems: number
//   totalPrice: number
//   addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
//   removeItem: (id: string, variantName?: string) => void
//   updateQuantity: (id: string, quantity: number) => void
//   clear: () => void
// }>({
//   items: [],
//   totalItems: 0,
//   totalPrice: 0,
//   addItem: () => {},
//   removeItem: () => {},
//   updateQuantity: () => {},
//   clear: () => {},
// })

// const STORAGE_KEY = 'chik_cart_v1'

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [items, setItems] = useState<CartItem[]>([])

//   useEffect(() => {
//     try {
//       const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
//       if (raw) setItems(JSON.parse(raw))
//     } catch {}
//   }, [])

//   useEffect(() => {
//     try {
//       if (typeof window !== 'undefined') {
//         window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
//       }
//     } catch {}
//   }, [items])

//   const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
//     setItems((prev) => {
//       const idx = prev.findIndex((p) => p.id === item.id && p.variantName === item.variantName)
//       if (idx >= 0) {
//         const next = [...prev]
//         next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity }
//         return next
//       }
//       return [...prev, { ...item, quantity }]
//     })
//   }, [])

//   const removeItem = useCallback((id: string, variantName?: string) => {
//     setItems((prev) => prev.filter((p) => !(p.id === id && p.variantName === variantName)))
//   }, [])

//   const clear = useCallback(() => setItems([]), [])

//   const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items])
//   const total = useMemo(() => items.reduce((s, i) => s + i.quantity * i.price, 0), [items])

//   const value = useMemo(
//     () => ({ items, totalItems, totalPrice, addItem, removeItem, clear }),
//     [items, totalPrice, totalItems, addItem, removeItem, clear],
//   )

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>
// }

// export const useCart = () => {
//   const ctx = useContext(CartContext)
//   if (!ctx) throw new Error('useCart must be used within CartProvider')
//   return ctx
// }
