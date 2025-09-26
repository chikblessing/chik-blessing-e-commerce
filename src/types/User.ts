import type { TypedUser } from 'payload'

export interface Address {
  type: 'billing' | 'shipping'
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  isDefault: boolean
}

export interface CartItem {
  product: string // The ID of the related 'products' document
  quantity: number
  addedAt: string
}

export interface CustomUser extends TypedUser {
  // Standard Payload fields
  email: string
  password?: string

  // Custom Fields
  name: string
  firstName?: string
  lastName?: string
  phone?: string
  gender?: 'male' | 'female' | 'nonbinary' | 'undisclosed'
  dateOfBirth?: string

  // Role field
  role: 'admin' | 'customer'

  // Array and Relationship Fields
  addresses?: Address[]
  cart?: CartItem[]

  // 🟢 FIX: Use proper relationship structure matching Payload collection definitions
  wishlist?: string[] // Array of product IDs (assuming IDs are strings)
  orderHistory?: { order: string; id?: string | null }[] // Array of order relationship objects
}
