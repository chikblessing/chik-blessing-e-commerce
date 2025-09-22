'use client'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type CartItem = {
  id: string
  title: string
  price: number
  quantity: number
  imageUrl?: string
  slug?: string
  variantName?: string
}

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string, variantName?: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'chik_cart_v1'

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      }
    } catch {}
  }, [items])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id && p.variantName === item.variantName)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity }
        return next
      }
      return [...prev, { ...item, quantity }]
    })
  }, [])

  const removeItem = useCallback((id: string, variantName?: string) => {
    setItems((prev) => prev.filter((p) => !(p.id === id && p.variantName === variantName)))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items])
  const total = useMemo(() => items.reduce((s, i) => s + i.quantity * i.price, 0), [items])

  const value = useMemo(
    () => ({ items, count, total, addItem, removeItem, clear }),
    [items, count, total, addItem, removeItem, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

