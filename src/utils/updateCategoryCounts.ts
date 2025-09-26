import type { Payload } from 'payload'

/**
 * Utility function to update product counts for all categories
 * This can be run manually to populate counts for existing data
 */
export const updateAllCategoryCounts = async (payload: Payload) => {
  try {
    // Get all categories
    const categories = await payload.find({
      collection: 'categories',
      depth: 0,
      limit: 1000, // Adjust as needed
    })

    console.log(`Updating product counts for ${categories.docs.length} categories...`)

    // Update each category's product count
    for (const category of categories.docs) {
      const products = await payload.find({
        collection: 'products',
        depth: 0,
        where: {
          categories: {
            equals: category.id,
          },
        },
        limit: 1, // Only need totalDocs
      })

      await payload.update({
        collection: 'categories',
        id: category.id,
        data: {
          productsCount: products.totalDocs,
        },
      })

      console.log(`Updated category "${category.name}" with ${products.totalDocs} products`)
    }

    console.log('✅ All category product counts updated successfully!')
  } catch (error) {
    console.error('❌ Error updating category counts:', error)
    throw error
  }
}
