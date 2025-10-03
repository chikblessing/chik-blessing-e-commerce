// app/api/search/products/[slug]/route.ts - Individual product search

import { getPayload } from 'payload'
import config from '../../../../../payload.config'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const payload = await getPayload({ config })

    // Fetch main product
    const productResults = await payload.find({
      collection: 'products',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      limit: 1,
      depth: 3,
    })

    if (productResults.docs.length === 0) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    const product = productResults.docs[0]

    // Fetch reviews
    const reviewsData = await payload.find({
      collection: 'reviews',
      where: {
        and: [{ product: { equals: product.id } }, { status: { equals: 'approved' } }],
      },
      sort: '-createdAt',
      depth: 2,
    })

    // Fetch related products
    const categoryIds =
      (product as any).categories?.map((c: any) => (typeof c === 'string' ? c : c.id)) || []

    const relatedData = await payload.find({
      collection: 'products',
      where: {
        and: [
          { categories: { in: categoryIds } },
          { id: { not_equals: product.id } },
          { status: { equals: 'published' } },
        ],
      },
      limit: 4,
      sort: '-createdAt',
    })

    return Response.json({
      product,
      reviews: reviewsData.docs,
      relatedProducts: relatedData.docs || [],
    })
  } catch (error) {
    const { slug } = await params
    console.error(`Product API Error for slug ${slug}:`, error)
    return Response.json({ error: 'Failed to retrieve product details.' }, { status: 500 })
  }
}
