import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import ProductsClient from './page.client'

export const revalidate = 0

export default async function Page() {
  const payload = await getPayload({ config })

  // Fetch all published products
  const productsData = await payload.find({
    collection: 'products',
    where: {
      status: {
        equals: 'published',
      },
    },
    depth: 2,
    limit: 50,
  })

  // Fetch all categories for filtering
  const categoriesData = await payload.find({
    collection: 'categories',
    where: {
      isActive: {
        equals: true,
      },
    },
    limit: 100,
  })

  return (
    <div className="py-40 bg-[#F0F0F0]">
      <ProductsClient initialProducts={productsData.docs} categories={categoriesData.docs} />
    </div>
  )
}
