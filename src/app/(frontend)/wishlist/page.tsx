import { Metadata } from 'next'
import WishlistClient from './page.client'

export const metadata: Metadata = {
  title: 'My Wishlist',
  description: 'Save your favorite products for later',
}

export default function WishlistPage() {
  return <WishlistClient />
}
