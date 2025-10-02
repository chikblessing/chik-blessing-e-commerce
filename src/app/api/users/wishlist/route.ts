// app/api/users/wishlist/route.ts

import { getPayload } from 'payload'
import config from '../../../../payload.config'

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const { productId, action } = await request.json()
  try {
    const authResult = await payload.auth({ headers: request.headers })
    if (!authResult.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 🟢 MANDATORY VALIDATION
    if (typeof productId !== 'string' || productId.length === 0) {
      return Response.json({ error: 'Invalid productId provided.' }, { status: 400 })
    }
    const validActions = ['add', 'remove']
    if (!validActions.includes(action)) {
      return Response.json({ error: 'Invalid action. Must be "add" or "remove".' }, { status: 400 })
    }
    // 💡 Optional: Add a check here to ensure the Product ID actually exists in the 'products' collection.

    const user = await payload.findByID({
      collection: 'users',
      id: authResult.user.id,
    })

    // Handle wishlist as array of objects with product relationships
    let wishlist: any[] = user.wishlist || []

    // Extract product IDs for comparison
    const productIds = wishlist.map((item: any) =>
      typeof item.product === 'string' ? item.product : item.product?.id,
    )

    if (action === 'add' && !productIds.includes(productId)) {
      wishlist.push({ product: productId })
    } else if (action === 'remove') {
      wishlist = wishlist.filter((item: any) => {
        const itemProductId = typeof item.product === 'string' ? item.product : item.product?.id
        return itemProductId !== productId
      })
    }

    await payload.update({
      collection: 'users',
      id: authResult.user.id,
      data: { wishlist },
    })

    return Response.json({ wishlist })
  } catch (error: any) {
    // 🟢 IMPROVEMENT: Log detailed error and return a generic public error
    console.error('Wishlist API Error:', error)
    return Response.json(
      { error: 'Failed to update wishlist due to a server error.' },
      { status: 500 },
    ) // Use 500 for server issues
  }
}
