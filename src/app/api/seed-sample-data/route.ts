import { getPayload } from 'payload'
import config from '../../../payload.config'

export async function POST() {
  try {
    const payload = await getPayload({ config })

    // Create sample categories
    const categories = [
      {
        title: 'Cocoa',
        slug: 'cocoa',
        description: 'Premium cocoa products and chocolate ingredients',
        isActive: true,
        sortOrder: 1,
      },
      {
        title: 'Coffee',
        slug: 'coffee',
        description: 'Fresh coffee beans and brewing supplies',
        isActive: true,
        sortOrder: 2,
      },
      {
        title: 'Spices',
        slug: 'spices',
        description: 'Aromatic spices and seasonings',
        isActive: true,
        sortOrder: 3,
      },
    ]

    const createdCategories = []
    for (const categoryData of categories) {
      try {
        const existingCategory = await payload.find({
          collection: 'categories',
          where: { slug: { equals: categoryData.slug } },
          limit: 1,
        })

        if (existingCategory.docs.length === 0) {
          const category = await payload.create({
            collection: 'categories',
            data: categoryData,
          })
          createdCategories.push(category)
        }
      } catch (error) {
        console.error(`Error creating category ${categoryData.title}:`, error)
      }
    }

    // Create sample products
    const products = [
      {
        title: 'Premium Dark Cocoa Powder',
        slug: 'premium-dark-cocoa-powder',
        description: 'Rich, dark cocoa powder perfect for baking and beverages',
        shortDescription: 'Premium quality dark cocoa powder',
        price: 2500,
        salePrice: 2200,
        brand: 'CBCS Premium',
        status: 'published',
        categories: createdCategories.filter((cat) => cat.slug === 'cocoa').map((cat) => cat.id),
        images: [], // Empty array for now - images can be added later via admin
        rating: {
          average: 4.5,
          count: 23,
        },
        inventory: {
          stock: 50,
          sku: 'COCOA-001',
        },
      },
      {
        title: 'Organic Coffee Beans',
        slug: 'organic-coffee-beans',
        description: 'Freshly roasted organic coffee beans from local farms',
        shortDescription: 'Premium organic coffee beans',
        price: 3500,
        brand: 'CBCS Coffee',
        status: 'published',
        categories: createdCategories.filter((cat) => cat.slug === 'coffee').map((cat) => cat.id),
        images: [], // Empty array for now - images can be added later via admin
        rating: {
          average: 4.8,
          count: 45,
        },
        inventory: {
          stock: 30,
          sku: 'COFFEE-001',
        },
      },
    ]

    const createdProducts = []
    for (const productData of products) {
      try {
        const existingProduct = await payload.find({
          collection: 'products',
          where: { slug: { equals: productData.slug } },
          limit: 1,
        })

        if (existingProduct.docs.length === 0) {
          const product = await payload.create({
            collection: 'products',
            data: productData,
          })
          createdProducts.push(product)
        }
      } catch (error) {
        console.error(`Error creating product ${productData.title}:`, error)
      }
    }

    return Response.json({
      success: true,
      message: 'Sample data created successfully',
      data: {
        categories: createdCategories.length,
        products: createdProducts.length,
      },
    })
  } catch (error) {
    console.error('Error seeding sample data:', error)
    return Response.json(
      { error: 'Failed to seed sample data', details: error.message },
      { status: 500 },
    )
  }
}
