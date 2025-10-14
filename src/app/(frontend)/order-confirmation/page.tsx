import React, { Suspense } from 'react'
import { Metadata } from 'next'
import OrderConfirmationClient from './page.client'

export const metadata: Metadata = {
  title: 'Order Confirmation',
  description: 'Your order has been confirmed',
}

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 pt-[150px] pb-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#084710] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderConfirmationClient />
    </Suspense>
  )
}
