import React, { cache } from 'react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import ProductClient from './page.client'

type Args = { params: Promise<{ slug: string }> }

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
    depth: 2,
  })

  return result.docs?.[0] || null
})

const queryRelatedProducts = cache(async (categoryIds: string[], currentProductId: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 4,
    pagination: false,
    overrideAccess: draft,
    where: {
      and: [
        { categories: { in: categoryIds } },
        { id: { not_equals: currentProductId } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 1,
  })

  return result.docs || []
})

const queryProductReviews = cache(async (productId: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'reviews',
    where: {
      and: [{ product: { equals: productId } }, { status: { equals: 'approved' } }],
    },
    depth: 1,
    sort: '-createdAt',
    limit: 50,
  })

  return result.docs || []
})

export default async function ProductPage({ params: paramsPromise }: Args) {
  const params = await paramsPromise
  const product = await queryProductBySlug({ slug: params.slug })

  if (!product) {
    return (
      <div className="container mx-auto px-4 pb-24 pt-[150px] text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    )
  }

  // Get related products
  const categoryIds =
    (product as any).categories?.map((cat: any) => (typeof cat === 'string' ? cat : cat.id)) || []

  const relatedProducts = await queryRelatedProducts(categoryIds, product.id)

  // Get product reviews
  const reviews = await queryProductReviews(product.id)

  return (
    <ProductClient
      product={product as any}
      relatedProducts={relatedProducts}
      reviews={reviews as any}
    />
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const params = await paramsPromise
  const product = await queryProductBySlug({ slug: params.slug })

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: `${(product as any)?.title} - Shop Now`,
    description:
      (product as any)?.shortDescription ||
      (product as any)?.description ||
      'Premium quality product',
  }
}
