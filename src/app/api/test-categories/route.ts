import { getPayload } from 'payload'
import config from '../../../payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Test: Get all categories
    const allCategories = await payload.find({
      collection: 'categories',
      limit: 10,
    })

    // Test: Get cocoa category specifically
    const cocoaCategory = await payload.find({
      collection: 'categories',
      where: {
        slug: { equals: 'cocoa' },
      },
      limit: 1,
    })

    return Response.json({
      success: true,
      allCategories: allCategories.docs,
      cocoaCategory: cocoaCategory.docs,
      totalCategories: allCategories.totalDocs,
    })
  } catch (error: any) {
    console.error('Test Categories API Error:', error)
    return Response.json(
      {
        error: 'Failed to test categories',
        details: error.message,
      },
      { status: 500 },
    )
  }
}
