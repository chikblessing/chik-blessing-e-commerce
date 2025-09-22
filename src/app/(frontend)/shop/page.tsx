import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export const revalidate = 300

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const [products, categories] = await Promise.all([
    payload.find({
      collection: 'products',
      depth: 1,
      limit: 24,
      pagination: true,
      select: {
        title: true,
        slug: true,
        price: true,
        salePrice: true,
        images: true,
        status: true,
      },
    }),
    payload.find({
      collection: 'categories',
      limit: 200,
      pagination: false,
      select: { title: true, slug: true },
    }),
  ])

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-8">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Shop</h1>
        </div>
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <div className="rounded-lg border p-4">
            <div className="font-medium mb-2">Filter</div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {(categories.docs as any[]).map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop?category=${c.slug}`}
                      className="text-sm underline"
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Availability</div>
                <div className="flex gap-3 text-sm">
                  <Link href="/shop?status=in-stock" className="underline">
                    In stock
                  </Link>
                  <Link href="/shop?status=out-of-stock" className="underline">
                    Out of stock
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {products.docs.map((p) => (
            <ProductCard key={p.id as string} product={p as any} />
          ))}
        </div>
      </div>
    </div>
  )
}
