'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface OrderItem {
  product: any
  productTitle: string
  productImage: any
  quantity: number
  price: number
  sku?: string
}

interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: string
  paymentStatus: string
  createdAt: string
}

export default function OrdersClient() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Failed to fetch orders')
        const data = await res.json()
        setOrders(data.docs || [])
      } catch (err: any) {
        toast.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, token, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-[150px] pb-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#084710] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-[150px] pb-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Order History</h1>
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <Link
              href="/featured-products"
              className="inline-block bg-[#084710] text-white px-6 py-3 rounded-lg hover:bg-black transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (selectedOrder) {
    return (
      <div className="container mx-auto px-4 pt-[150px] pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-[#084710] mb-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Orders
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{selectedOrder.orderNumber}
              </h1>
              <p className="text-gray-600">
                {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-[#084710] text-white px-6 py-3 rounded-lg hover:bg-black transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Invoice
            </button>
          </div>

          {/* Order Tracking */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Order Tracking</h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                <div
                  className="h-full bg-[#084710] transition-all duration-500"
                  style={{
                    width:
                      selectedOrder.status === 'pending'
                        ? '0%'
                        : selectedOrder.status === 'processing'
                          ? '25%'
                          : selectedOrder.status === 'shipped'
                            ? '66%'
                            : selectedOrder.status === 'delivered'
                              ? '100%'
                              : '0%',
                  }}
                ></div>
              </div>

              {/* Steps */}
              <div className="relative grid grid-cols-4 gap-4">
                {[
                  { label: 'Order Placed', status: 'pending', date: selectedOrder.createdAt },
                  { label: 'Processing', status: 'processing', date: null },
                  { label: 'Shipped', status: 'shipped', date: null },
                  { label: 'Delivered', status: 'delivered', date: null },
                ].map((step, index) => {
                  const isCompleted =
                    selectedOrder.status === 'delivered' ||
                    (selectedOrder.status === 'shipped' && index <= 2) ||
                    (selectedOrder.status === 'processing' && index <= 1) ||
                    (selectedOrder.status === 'pending' && index === 0)

                  return (
                    <div key={index} className="flex flex-col items-center text-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 relative z-10 transition-colors ${
                          isCompleted
                            ? 'bg-[#084710] text-white'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        )}
                      </div>
                      <p
                        className={`text-sm font-medium mb-1 ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}
                      >
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-xs text-gray-500">
                          {new Date(step.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Order Items</h2>
            <div className="space-y-6">
              {selectedOrder.items.map((item, index) => {
                const imageUrl = item.productImage?.url
                return (
                  <div key={index} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={item.productTitle}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.productTitle}</h3>
                      {item.sku && <p className="text-sm text-gray-600">SKU: {item.sku}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 mb-1">
                        ₦{item.price.toLocaleString()} × {item.quantity}
                      </p>
                      <p className="font-bold text-gray-900">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2 max-w-xs ml-auto">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Charge</span>
                  <span>₦{selectedOrder.shipping.toLocaleString()}</span>
                </div>
                {selectedOrder.tax > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax Fee</span>
                    <span>₦{selectedOrder.tax.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₦{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Note */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900 mb-1">Order Note:</p>
            <p className="text-sm text-gray-600">
              Thank you for your order! We&apos;ll send you tracking information once your order
              ships.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-[150px] pb-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-[#084710] hover:text-black font-medium text-sm transition-colors"
                  >
                    View Details →
                  </button>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {order.items.slice(0, 4).map((item, index) => {
                  const imageUrl = item.productImage?.url
                  return (
                    <div key={index} className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={item.productTitle}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
                {order.items.length > 4 && (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-600 font-medium">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </p>
                <p className="text-lg font-bold text-gray-900">₦{order.total.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
