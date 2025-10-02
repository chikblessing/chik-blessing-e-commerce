import { Metadata } from 'next'
import CartClient from './page.client'

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review and manage items in your shopping cart',
}

export default function CartPage() {
  return <CartClient />
}
