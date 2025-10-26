'use client'

import React, { useState, useMemo } from 'react'
import { useCart } from '@/providers/Cart'
import { useAuth } from '@/providers/Auth'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import type { Product } from '@/payload-types'

interface ShippingZone {
  id: string
  name: string
  baseRate: number
  freeShippingThreshold?: number
}

export default function CheckoutClient() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [submitting, setSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'pickup'>('online')
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [shippingZone, setShippingZone] = useState<ShippingZone | null>(null)

  const [shippingForm, setShippingForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria',
  })

  const [billingForm, setBillingForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria',
  })

  // Load shipping zone from localStorage
  React.useEffect(() => {
    const savedZone = localStorage.getItem('shippingZone')
    if (savedZone) {
      try {
        setShippingZone(JSON.parse(savedZone))
      } catch (error) {
        console.error('Failed to parse shipping zone:', error)
      }
    }
  }, [])

  const shipping = useMemo(() => {
    if (paymentMethod === 'pickup') return 0

    // Use shipping zone data if available
    if (shippingZone) {
      // Check if order qualifies for free shipping
      if (shippingZone.freeShippingThreshold && totalPrice >= shippingZone.freeShippingThreshold) {
        return 0
      }
      return shippingZone.baseRate
    }

    // Fallback to old logic
    return totalPrice >= 5000 ? 0 : 1500
  }, [totalPrice, paymentMethod, shippingZone])

  const grandTotal = totalPrice + shipping

  const validateForm = () => {
    if (!shippingForm.name || !shippingForm.phone || !shippingForm.email) {
      toast.error('Please fill in all contact information')
      return false
    }

    if (paymentMethod === 'online') {
      if (!shippingForm.street || !shippingForm.city || !shippingForm.state) {
        toast.error('Please fill in complete shipping address')
        return false
      }
    }

    if (!sameAsShipping && paymentMethod === 'online') {
      if (!billingForm.street || !billingForm.city || !billingForm.state) {
        toast.error('Please fill in complete billing address')
        return false
      }
    }

    return true
  }

  const onSubmit = async () => {
    if (!validateForm()) return

    try {
      setSubmitting(true)

      const orderData = {
        items,
        shippingAddress: shippingForm,
        billingAddress: sameAsShipping ? shippingForm : billingForm,
        paymentMethod: paymentMethod === 'pickup' ? 'cash' : 'paystack',
        shippingMethod: paymentMethod === 'pickup' ? 'pickup' : 'standard',
        total: grandTotal,
        subtotal: totalPrice,
        shipping,
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Checkout failed')

      if (paymentMethod === 'pickup') {
        clearCart()
        toast.success('Order placed successfully!')
        router.push(`/order-confirmation?orderId=${data.orderId}`)
      } else {
        const url = data?.data?.authorization_url || data?.authorization_url
        if (url) {
          clearCart()
          toast.success('Redirecting to payment...')
          window.location.href = url
        } else {
          throw new Error('Missing Paystack URL')
        }
      }
    } catch (e) {
      const error = e as Error
      toast.error(error.message || 'Error processing checkout')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-[150px] pb-16 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <button
            onClick={() => router.push('/featured-products')}
            className="bg-[#084710] text-white px-6 py-3 rounded-lg hover:bg-black transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-[150px] pb-16">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('online')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'online'
                    ? 'border-[#084710] bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'online' ? 'border-[#084710]' : 'border-gray-300'
                    }`}
                  >
                    {paymentMethod === 'online' && (
                      <div className="w-3 h-3 rounded-full bg-[#084710]"></div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Pay Online</div>
                    <div className="text-sm text-gray-600">Card, Bank Transfer, USSD</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('pickup')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'pickup'
                    ? 'border-[#084710] bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'pickup' ? 'border-[#084710]' : 'border-gray-300'
                    }`}
                  >
                    {paymentMethod === 'pickup' && (
                      <div className="w-3 h-3 rounded-full bg-[#084710]"></div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Pay on Pickup</div>
                    <div className="text-sm text-gray-600">Pay when you collect</div>
                  </div>
                </div>
              </button>
            </div>

            {paymentMethod === 'pickup' && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Pickup Information</p>
                    <p>
                      Visit our store to pay and collect your order. We&apos;ll send you the pickup
                      address and available times after you place your order.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={shippingForm.name}
                  onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={shippingForm.phone}
                  onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
                  placeholder="+234 800 000 0000"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={shippingForm.email}
                  onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Address - Only show for online payment */}
          {paymentMethod === 'online' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={shippingForm.street}
                    onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
                      placeholder="Lagos"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
                      placeholder="Lagos"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={shippingForm.postalCode}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, postalCode: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
                      placeholder="100001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={shippingForm.country}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, country: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address Checkbox */}
              <div className="mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="w-4 h-4 text-[#084710] border-gray-300 rounded focus:ring-[#084710]"
                  />
                  <span className="text-sm text-gray-700">
                    Billing address is same as shipping address
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Billing Address - Only show if different from shipping */}
          {paymentMethod === 'online' && !sameAsShipping && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={billingForm.name}
                    onChange={(e) => setBillingForm({ ...billingForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={billingForm.street}
                    onChange={(e) => setBillingForm({ ...billingForm, street: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={billingForm.city}
                      onChange={(e) => setBillingForm({ ...billingForm, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
                      placeholder="Lagos"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      value={billingForm.state}
                      onChange={(e) => setBillingForm({ ...billingForm, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
                      placeholder="Lagos"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => {
                const product = item.product as Product
                const price = product.salePrice || product.price || 0
                const featuredImage = product.images?.find((img) => img.isFeature)
                const imageUrl =
                  (typeof featuredImage?.image === 'object' ? featuredImage.image.url : null) ||
                  (typeof product.images?.[0]?.image === 'object'
                    ? product.images[0].image.url
                    : null)

                return (
                  <div key={`${product.id}-${item.variantSku || ''}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={product.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-[#084710]">
                        ₦{(price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₦{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₦${shipping.toLocaleString()}`
                  )}
                </span>
              </div>
              {paymentMethod === 'online' && totalPrice < 5000 && (
                <p className="text-xs text-gray-500">
                  Add ₦{(5000 - totalPrice).toLocaleString()} more for free shipping
                </p>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-[#084710]">
                  ₦{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={onSubmit}
              disabled={submitting}
              className={`w-full mt-6 py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#084710] hover:bg-black'
              }`}
            >
              {submitting
                ? 'Processing...'
                : paymentMethod === 'pickup'
                  ? 'Place Order'
                  : 'Proceed to Payment'}
            </button>

            {/* Security Badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
