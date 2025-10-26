import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import type { Product, Media } from '@/payload-types'
import ProductCard from './ProductCard'

interface TopSellingProduct extends Product {
  totalSold: number
}

async function getTopSellingProducts(): Promise<TopSellingProduct[]> {
  const payload = await getPayload({ config: configPromise })

  try {
    // Get all orders to calculate sales data
    const orders = await payload.find({
      collection: 'orders',
      limit: 1000,
      where: {
        status: {
          in: ['delivered', 'shipped'],
        },
      },
    })

    // Calculate sales per product
    const salesMap = new Map<string, number>()

    orders.docs.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        const productId = typeof item.product === 'string' ? item.product : item.product?.id
        if (productId) {
          salesMap.set(productId, (salesMap.get(productId) || 0) + item.quantity)
        }
      })
    })

    // Get top selling product IDs
    const topProductIds = Array.from(salesMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([id]) => id)

    if (topProductIds.length === 0) {
      // Fallback to recent products if no sales data
      const fallbackProducts = await payload.find({
        collection: 'products',
        limit: 8,
        where: {
          status: { equals: 'published' },
        },
        sort: '-createdAt',
      })

      return fallbackProducts.docs.map((product) => ({
        ...product,
        totalSold: 0,
      })) as TopSellingProduct[]
    }

    // Fetch the actual product data
    const products = await payload.find({
      collection: 'products',
      where: {
        id: { in: topProductIds },
        status: { equals: 'published' },
      },
      limit: 8,
    })

    // Combine with sales data and sort by sales
    const topSellingProducts = products.docs
      .map((product) => ({
        ...product,
        totalSold: salesMap.get(product.id) || 0,
      }))
      .sort((a, b) => b.totalSold - a.totalSold) as TopSellingProduct[]

    return topSellingProducts
  } catch (error) {
    console.error('Error fetching top selling products:', error)

    // Fallback to recent products
    const fallbackProducts = await payload.find({
      collection: 'products',
      limit: 8,
      where: {
        status: { equals: 'published' },
      },
      sort: '-createdAt',
    })

    return fallbackProducts.docs.map((product) => ({
      ...product,
      totalSold: 0,
    })) as TopSellingProduct[]
  }
}

export default async function TopSellingProducts() {
  const products = await getTopSellingProducts()

  if (!products || products.length === 0) {
    return (
      <div className="bg-[#F8F6F6] py-5 my-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-semibold text-center my-8">Top Selling Products</h3>
          <p className="text-center text-gray-600">No products available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F8F6F6] py-5 my-5">
      <div className="container mx-auto">
        <h3 className="text-3xl font-semibold text-center my-8">Top Selling Products</h3>
        <div className="mx-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          {products.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard key={product.id} product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
