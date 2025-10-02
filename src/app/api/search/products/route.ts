// app/api/search/products/route.ts - Frontend product search and filtering

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

    // Start with base condition: published status
    const baseWhere: any = { status: { equals: 'published' } }
    const combinedFilters: any[] = [] // Array to hold all AND conditions

    // --- 1. CATEGORIES (Performance Fix) ---
    const categories = searchParams.get('categories')
    const categoryFilter = searchParams.get('where[categories][in]')

    if (categories || categoryFilter) {
      let categoryIds: string[] = []

      if (categories) {
        categoryIds = categories
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id.length > 0)
      }

      if (categoryFilter) {
        categoryIds = [...categoryIds, categoryFilter]
      }

      if (categoryIds.length > 0) {
        // 🟢 PERFORMANCE FIX: Find all categories (parents and subs) in ONE query
        const categoriesData = await payload.find({
          collection: 'categories',
          where: {
            or: [
              { id: { in: categoryIds } }, // Selected categories
              { parent: { in: categoryIds } }, // Subcategories of selected parents
            ],
          },
          depth: 0,
        })

        const allCategoryIds = categoriesData.docs.map((cat) => cat.id)

        // Add the categories filter to the main AND array
        combinedFilters.push({ categories: { in: allCategoryIds } })
      }
    }

    // --- 2. BRANDS (Sanitized) ---
    const brands = searchParams.get('brands')
    if (brands) {
      // 🟢 SANITIZATION: Split and trim
      const brandList = brands
        .split(',')
        .map((b) => b.trim())
        .filter((b) => b.length > 0)
      if (brandList.length > 0) {
        combinedFilters.push({ brand: { in: brandList } })
      }
    }

    // --- 3. PRICE RANGE (Sanitized) ---
    const minPrice = safeParseInt(searchParams.get('minPrice'), 0)
    const maxPrice = safeParseInt(searchParams.get('maxPrice'), Infinity)
    if (minPrice > 0 || maxPrice !== Infinity) {
      const priceConditions: any[] = []
      if (minPrice > 0 && maxPrice !== Infinity) {
        // Condition 1: Both price and salePrice are within range
        priceConditions.push({
          or: [
            { price: { greater_than_equal: minPrice, less_than_equal: maxPrice } },
            { salePrice: { greater_than_equal: minPrice, less_than_equal: maxPrice } },
          ],
        })
      } else if (minPrice > 0) {
        // Condition 2: Only minPrice (greater than)
        priceConditions.push({
          or: [
            { price: { greater_than_equal: minPrice } },
            { salePrice: { greater_than_equal: minPrice } },
          ],
        })
      } else if (maxPrice !== Infinity) {
        // Condition 3: Only maxPrice (less than)
        priceConditions.push({
          or: [
            { price: { less_than_equal: maxPrice } },
            { salePrice: { less_than_equal: maxPrice } },
          ],
        })
      }

      // Add price filter to the main AND array
      combinedFilters.push({ and: priceConditions })
    }

    // --- 4. MIN RATING (Sanitized) ---
    const minRating = safeParseInt(searchParams.get('minRating'), 0)
    if (minRating > 0) {
      combinedFilters.push({ 'rating.average': { greater_than_equal: minRating } })
    }

    // --- 5. IN STOCK ---
    const inStock = searchParams.get('inStock')
    if (inStock === 'true') {
      combinedFilters.push({ 'inventory.stock': { greater_than: 0 } })
    }

    // --- 6. SEARCH TERM (Handling Logic Conflict) ---
    const search = searchParams.get('search')
    if (search) {
      // 🟢 FIX: Wrap search conditions in their own OR logic
      const searchConditions = {
        or: [
          { title: { like: search } },
          { description: { like: search } },
          { brand: { like: search } },
        ],
      }
      // Add search filter to the main AND array
      combinedFilters.push(searchConditions)
    }

    // --- 7. FINAL WHERE CLAUSE ASSEMBLY ---
    let finalWhere = baseWhere
    if (combinedFilters.length > 0) {
      // All individual filters are combined with AND, then combined with baseWhere
      finalWhere = { and: [baseWhere, ...combinedFilters] }
    }

    // --- 8. PAYLOAD QUERY EXECUTION ---
    const products = await payload.find({
      collection: 'products',
      where: finalWhere,
      limit: safeParseInt(searchParams.get('limit'), 12), // Sanitized
      page: safeParseInt(searchParams.get('page'), 1), // Sanitized
      sort: searchParams.get('sort') || '-createdAt',
      depth: 2,
    })

    return Response.json(products)
  } catch (error) {
    console.error('Error searching products:', error)
    return Response.json({ error: 'Failed to search products' }, { status: 500 })
  }
}
