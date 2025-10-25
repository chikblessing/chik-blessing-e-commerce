import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const page = parseInt(searchParams.get('page') || '1', 10)

    const payload = await getPayload({ config })

    // Find products that have a salePrice set and are published
    const products = await payload.find({
      collection: 'products',
      where: {
        and: [
          { status: { equals: 'published' } },
          { salePrice: { exists: true } },
          { salePrice: { greater_than: 0 } },
        ],
      },
      limit,
      page,
      sort: '-createdAt',
      depth: 2,
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching on-sale products:', error)
    return NextResponse.json({ error: 'Failed to fetch on-sale products' }, { status: 500 })
  }
}
