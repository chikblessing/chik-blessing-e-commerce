// app/api/search/categories/route.ts - Frontend category search

import { getPayload } from 'payload'
import config from '../../../../payload.config'

// Helper to safely parse an integer or return a default value
const safeParseInt = (value: string | null, defaultValue: number): number => {
  const parsed = parseInt(value || '', 10)
  return isNaN(parsed) ? defaultValue : parsed
}

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    // Build where clause
    const where: any = {}

    // Filter by active status
    const isActive = searchParams.get('where[isActive][equals]')
    if (isActive !== null) {
      where.isActive = { equals: isActive === 'true' }
    }

    // Filter by slug
    const slug = searchParams.get('where[slug][equals]')
    if (slug) {
      where.slug = { equals: slug }
    }

    // Filter by parent category
    const parent = searchParams.get('where[parent][equals]')
    if (parent) {
      where.parent = { equals: parent }
    }

    // Get categories
    const categories = await payload.find({
      collection: 'categories',
      where,
      limit: safeParseInt(searchParams.get('limit'), 50),
      page: safeParseInt(searchParams.get('page'), 1),
      sort: searchParams.get('sort') || 'sortOrder',
      depth: 1,
    })

    return Response.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return Response.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
