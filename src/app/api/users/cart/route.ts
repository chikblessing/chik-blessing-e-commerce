import { getPayload } from 'payload'
import config from '../../../../payload.config'

// CRITICAL: Type for incoming cart item structure
interface IncomingCartItem {
  product: string // Product ID
  quantity: number
}

// ----------------------------------------------------------------------
// POST: Sync/Update the authenticated user's cart
// ----------------------------------------------------------------------

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const { cart: incomingCart } = (await request.json()) as { cart: IncomingCartItem[] }
  try {
    const authResult = await payload.auth({ headers: request.headers })
    if (!authResult.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 🟢 MANDATORY PRODUCTION VALIDATION AND SANITIZATION
    const validCartItems: any[] = []

    for (const item of incomingCart) {
      // 1. Basic Structure and Type Check
      if (
        typeof item.product !== 'string' ||
        typeof item.quantity !== 'number' ||
        item.quantity < 1
      ) {
        // Optional: Log suspicious payload. Continuing ensures a bad item doesn't crash the whole sync.
        continue
      }

      // 2. Quantity Sanitization
      const sanitizedQuantity = Math.floor(item.quantity)

      // 3. Optional: Add Payload findByID check here to verify item.product actually exists.

      // 4. Push clean data to the final array (matches Users collection structure)
      validCartItems.push({
        product: item.product,
        quantity: sanitizedQuantity,
        addedAt: new Date().toISOString(),
      })
    }

    await payload.update({
      collection: 'users',
      id: authResult.user.id,
      data: { cart: validCartItems }, // ⬅️ Only validated data is saved
    })

    return Response.json({ success: true })
  } catch (error: any) {
    return Response.json({ error: error.message || 'Cart sync failed' }, { status: 400 })
  }
}

// ----------------------------------------------------------------------
// GET: Retrieve the authenticated user's cart
// ----------------------------------------------------------------------

export async function GET(request: Request) {
  const payload = await getPayload({ config })
  try {
    const authResult = await payload.auth({ headers: request.headers })
    if (!authResult.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await payload.findByID({
      collection: 'users',
      id: authResult.user.id, // Setting depth to 2 ensures product fields (like price) are populated
      depth: 2,
    })

    return Response.json({ cart: user.cart || [] })
  } catch (error: any) {
    return Response.json({ error: error.message || 'Failed to retrieve cart' }, { status: 400 })
  }
}
