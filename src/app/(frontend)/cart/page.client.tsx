'use client'

import React from 'react'
import { useCart } from '@/providers/Cart'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ProductImage from '../../../../public/assets/image1.png'

export default function CartClient() {
  const { items, totalItems, totalPrice, updateQuantity, clearCart, removeItem } = useCart()
  const router = useRouter()

  const handleQuantityChange = (productId: string, variantSku: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(productId, variantSku, newQuantity)
  }

  const handleRemoveItem = (productId: string, variantSku: string) => {
    removeItem(productId, variantSku)
  }

  const deliveryFee = 15
  const subtotal = totalPrice
  const total = subtotal + deliveryFee

  return (
    <>
      <div className="container mx-auto px-4 mt-[100px]">
        <div className="flex items-center justify-between my-6">
          <h2 className="text-2xl font-semibold">Your Cart ({totalItems} items)</h2>
          {totalItems > 0 && (
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>
        {totalItems === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#084710] text-white rounded-xl hover:bg-black transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {items.map((item) => {
                  const product = item.product as any
                  const featuredImage =
                    product.images?.find((img: unknown) => img.isFeature) || product.images?.[0]
                  const displayPrice = product.salePrice || product.price

                  return (
                    <div key={`${item.product.id}-${item.variantSku}`} className="p-4">
                      <div className="flex justify-between items-start">
                        {/* Product Info */}
                        <div className="flex gap-4 flex-1">
                          <div className="w-20 h-20 flex-shrink-0">
                            <Image
                              src={featuredImage?.image?.url || ProductImage}
                              alt={featuredImage?.alt || product.title}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex flex-col justify-between flex-1">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {product.title}
                              </h3>
                              <p className="text-sm text-gray-600">{product.brand}</p>
                              <p className="text-sm text-gray-600">
                                {product.shortDescription || 'Premium quality product'}
                              </p>
                            </div>
                            <div className="text-lg font-semibold text-gray-900 mt-2">
                              ₦{displayPrice.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-end gap-4 ml-4">
                          {/* Delete Button */}
                          <button
                            onClick={() => handleRemoveItem(item.product.id, item.variantSku)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="22"
                              height="22"
                              fill="currentColor"
                            >
                              <path d="M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM6 10V20H18V10H6ZM9 12H11V18H9V12ZM13 12H15V18H13V12ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9Z"></path>
                            </svg>
                          </button>

                          {/* Quantity Controls */}
                          <div className="flex items-center bg-gray-100 rounded-full">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.variantSku,
                                  item.quantity - 1,
                                )
                              }
                              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 rounded-l-full"
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path
                                  d="M3 8h10"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                            <span className="px-4 py-2 text-lg font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.variantSku,
                                  item.quantity + 1,
                                )
                              }
                              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 rounded-r-full"
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path
                                  d="M8 3v10M3 8h10"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">₦{deliveryFee}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold">₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-6 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add promo code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button className="px-4 py-2 bg-[#084710] text-white rounded-md hover:bg-black transition-colors">
                    Apply
                  </button>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full mt-6 bg-[#084710] text-white py-3 px-4 rounded-md hover:bg-black transition-colors font-medium flex items-center justify-center gap-2"
                >
                  Go to Checkout
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path
                      d="M6 12l4-4-4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
