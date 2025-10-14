import React from 'react'
import { Metadata } from 'next'
import OrdersClient from './page.client'

export const metadata: Metadata = {
  title: 'Order History',
  description: 'View your order history and track your orders',
}

export default function OrdersPage() {
  return <OrdersClient />
}
