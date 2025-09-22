import React from 'react'
import CartClient from './page.client'
import ProductsClient from './page.client'

export const revalidate = 0

export default async function Page() {
  return (
    <div className="py-40 bg-[#F0F0F0]">
      <ProductsClient />
    </div>
  )
}