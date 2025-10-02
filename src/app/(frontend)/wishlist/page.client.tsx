'use client'

import React from 'react'
import { useWishlist } from '@/providers/Wishlist'
import { useCart } from '@/providers/Cart'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export default function WishlistClient() {
  const { items: wishlistItems, totalItems, clearWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()

  const handleAddAllToCart = async () => {
    try {
      for (const item of wishlistItems) {
        const variantSku = (item.product as any).inventory?.sku || item.product.id
        await addToCart(item.product as any, variantSku, 1)
      }
      console.log('Added all wishlist items to cart')
    } catch (error) {
      console.error('Error adding all items to cart:', error)
    }
  }
  return (
    <>
      <section
        className="relative w-full h-[450px] flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage: "url('/assets/wishlist-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 text-center bg-black opacity-30 z-10" />
        <div className="max-w-3xl mx-auto">
          <h1 className="relative z-20 text-white text-5xl font-bold mt-20">Your Wishlist</h1>
          <p className="relative z-20 text-white text-lg mt-5">
            Save your favorite organic products and never miss out on the items you love most.
          </p>
        </div>
      </section>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <h3 className="text-2xl font-semibold my-6">My Wishlist ({totalItems} items)</h3>
        <div className="flex gap-4">
          {totalItems > 0 && (
            <>
              <button
                onClick={clearWishlist}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Clear Wishlist
              </button>
              <button
                onClick={handleAddAllToCart}
                className="px-4 py-2 bg-[#084710] text-white rounded-xl hover:bg-black transition-colors"
              >
                Add All to Cart
              </button>
            </>
          )}
        </div>
      </div>
      <div className="container mx-auto px-4">
        {totalItems === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Start adding products you love to your wishlist!</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#084710] text-white rounded-xl hover:bg-black transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((item) => (
              <ProductCard
                key={item.product.id}
                product={item.product as any}
                onWishlistToggle={(productId, isInWishlist) => {
                  console.log(`Product ${productId} wishlist status: ${isInWishlist}`)
                }}
                onAddToCart={(productId) => {
                  console.log(`Added product ${productId} to cart`)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
