import React from 'react'
import Link from 'next/link'

import { Media as MediaType } from '@/payload-types'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { useCart } from '@/providers/Cart'

type Product = {
  id: string
  slug?: string | null
  title?: string | null
  price?: number | null
  salePrice?: number | null
  images?: MediaType[] | string[]
  status?: string | null
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addItem } = useCart()
  const href = product.slug ? `/product/${product.slug}` : '#'
  const price = product.salePrice ?? product.price ?? 0

  return (
    <div className="group rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
      <Link href={href} className="block">
        <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-muted">
          {Array.isArray(product.images) && product.images?.[0] ? (
            <ImageMedia resource={product.images[0]} fill size="(max-width: 768px) 100vw, 25vw" />
          ) : null}
        </div>
        <div className="p-4">
          <div className="text-sm text-muted-foreground">
            {product.status === 'out-of-stock' ? 'Out of stock' : 'Available'}
          </div>
          <div className="mt-1 font-medium line-clamp-2">{product.title}</div>
          <div className="mt-2 text-primary font-semibold">₦{price.toLocaleString()}</div>
        </div>
      </Link>
      <div className="p-4 pt-0 flex gap-2">
        <button
          onClick={() =>
            addItem(
              {
                id: product.id,
                title: product.title || '',
                price: price,
                slug: product.slug || undefined,
              },
              1,
            )
          }
          className="w-full inline-flex items-center justify-center rounded-md border bg-primary text-primary-foreground px-3 py-2 text-sm hover:opacity-90 disabled:opacity-50"
        >
          Add to cart
        </button>
        <button className="rounded-md border px-3 py-2 text-sm">❤</button>
      </div>
    </div>
  )
}

export default ProductCard
