import React from 'react'
import { Metadata } from 'next'
import OrderConfirmationClient from './page.client'

export const metadata: Metadata = {
  title: 'Order Confirmation',
  description: 'Your order has been confirmed',
}

export default function OrderConfirmationPage() {
  return <OrderConfirmationClient />
}
