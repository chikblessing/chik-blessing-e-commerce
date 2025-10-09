import { getPayload } from 'payload'
import config from '../../../../payload.config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const payload = await getPayload({ config })

    // Build where clause from search params
    const where: any = {}

    // Handle where[slug][equals] parameter
    const slugEquals = searchParams.get('where[slug][equals]')
    if (slugEquals) {
      where.slug = { equals: slugEquals }
    }

    // Handle where[isActive][equals] parameter
    const isActiveEquals = searchParams.get('where[isActive][equals]')
    if (isActiveEquals) {
      where.isActive = { equals: isActiveEquals === 'true' }
    }

    // Handle where[parent][equals] parameter
    const parentEquals = searchParams.get('where[parent][equals]')
    if (parentEquals) {
      where.parent = { equals: parentEquals }
    }

    // Get limit parameter
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    // Fetch categories
    const result = await payload.find({
      collection: 'categories',
      where,
      limit,
      page,
      sort: 'sortOrder',
      depth: 2,
    })

    return Response.json(result)
  } catch (error) {
    console.error('Categories API Error:', error)
    return Response.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
