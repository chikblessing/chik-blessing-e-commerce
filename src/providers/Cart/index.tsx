'use client'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from '../Auth'
import { Product } from '@/payload-types'
import { apiClient } from '../Auth/apiClient' // 🟢 Assume the apiClient is available
import toast from 'react-hot-toast'

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
  const isInitialLoad = useRef(true)

  // --- 1. CORE SERVER SYNC HELPER (STILL EXISTS) ---
  // This is now used by mergeCart and for any subsequent changes after login.
  const syncWithServer = async (newItems: CartItem[]) => {
    if (!user || !token) return

    try {
      await apiClient('users/cart', {
        method: 'POST',
        token: token,
        body: {
          cart: newItems.map((item) => ({
            product: item.product.id,
            sku: item.variantSku,
            quantity: item.quantity,
          })),
        },
      })
    } catch (error) {
      console.error('Failed to sync cart:', error)
    }
  }

  // --- 2. NEW: MERGE CART FUNCTION ---
  // Merges local cart with server cart upon login.
  const mergeCart = async (guestCart: CartItem[]) => {
    if (!user || !token) return

    // 💡 OPTIONAL: You might want to merge guestCart with any existing server cart,
    // but for simplicity, we'll assume the guest cart overwrites the server's empty cart
    // (or is appended to the server's cart).

    // For production: Merge logic should handle duplicate items by summing quantities.

    await syncWithServer(guestCart)

    // After successful sync, clear the local storage cart
    localStorage.removeItem('cart')

    // Force a re-load of the server's version of the cart (via the main useEffect below)
  }

  // --- 3. INITIAL LOAD LOGIC (Reads from User or LocalStorage) ---
  useEffect(() => {
    if (user && userAny.cart) {
      // User is logged in, load cart from server and clear local storage
      const cartItems = userAny.cart.map((item: any) => ({
        product: typeof item.product === 'string' ? { id: item.product } : item.product,
        quantity: item.quantity,
        variantSku: item.sku,
      })) as CartItem[]
      setItems(cartItems)

      // 💡 If this is a fresh login, merge the old local cart
      const savedCart = localStorage.getItem('cart')
      if (isInitialLoad.current && savedCart) {
        const guestCart = JSON.parse(savedCart)

        // ⚠️ IMPORTANT: In a real app, you must implement logic to MERGE guestCart and cartItems.
        // For this example, we'll assume the simple merge (sync guest cart to server).
        mergeCart(guestCart)
      }
    } else if (!user) {
      // User is guest, load from local storage
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    }

    isInitialLoad.current = false
  }, [user]) // Only runs when user object changes (login/logout)

  // --- 4. LOCAL STORAGE PERSISTENCE (Guests Only) ---
  useEffect(() => {
    // Only save to local storage if the user is a guest
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
    // 💡 If the user is logged in, changes MUST trigger syncWithServer
    // (This is the change from the previous version)
    if (user) {
      syncWithServer(items)
    }
  }, [items, user])

  // --- 5. CART ACTIONS (Only update local state initially) ---

  const addItem = async (product: Product, variantSku: string, quantity = 1) => {
    const newItems = [...items]
    const existingIndex = newItems.findIndex(
      (item) => item.product.id === product.id && item.variantSku === variantSku,
    )

    if (existingIndex >= 0) {
      newItems[existingIndex].quantity += quantity
      toast.success('Cart updated')
    } else {
      newItems.push({ product, quantity, variantSku })
      toast.success('Added to cart')
    }
    setItems(newItems)
    // ❌ NO syncWithServer call here. It's handled by the useEffect above.
  }

  const removeItem = async (productId: string, variantSku: string) => {
    const newItems = items.filter(
      (item) => !(item.product.id === productId && item.variantSku === variantSku),
    )
    setItems(newItems)
    toast.success('Removed from cart')
    // ❌ NO syncWithServer call here.
  }

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
    // ❌ NO syncWithServer call here.
  }

  const clearCart = async () => {
    setItems([])
    toast.success('Cart cleared')
    // ❌ NO syncWithServer call here.
  }

  // ... (totalItems and totalPrice calculations remain the same) ...

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => {
    const product = item.product as any
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
