'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

// Placeholder for your rice product image
import RiceProduct from '../../../../public/assets/grain.png'

export default function CartClient() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Lorem ipsum dolor sit',
      status: 'Lorem ipsum',
      description: 'Lorem ipsum',
      price: 145,
      quantity: 1,
      image: RiceProduct,
    },
    {
      id: 2,
      name: 'Lorem ipsum dolor sit',
      status: 'Lorem ipsum',
      description: 'Lorem ipsum',
      price: 145,
      quantity: 1,
      image: RiceProduct,
    },
    {
      id: 3,
      name: 'Lorem ipsum dolor sit',
      status: 'Lorem ipsum',
      description: 'Lorem ipsum',
      price: 145,
      quantity: 1,
      image: RiceProduct,
    },
  ])

  const updateQuantity = (id:number, newQuantity:number) => {
    if (newQuantity < 1) return
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)),
    )
  }

  const removeItem = (id:number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 15
  const total = subtotal + deliveryFee

  return (
    <>
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-semibold my-6">Your Cart</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex justify-between items-start">
                    {/* Product Info */}
                    <div className="flex gap-4 flex-1">
                      <div className="w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.status}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <div className="text-lg font-semibold text-gray-900 mt-2">
                          ${item.price}
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-end gap-4 ml-4">
                      {/* Delete Button */}
                      <button
                        onClick={() => removeItem(item.id)}
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
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">${deliveryFee}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">${total}</span>
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
              <button className="w-full mt-6 bg-[#084710] text-white py-3 px-4 rounded-md hover:bg-black transition-colors font-medium flex items-center justify-center gap-2">
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
      </div>
    </>
  )
}
