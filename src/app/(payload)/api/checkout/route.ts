import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingMethod,
      total,
      subtotal,
      shipping,
    } = body

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!shippingAddress?.name || !shippingAddress?.email || !shippingAddress?.phone) {
      return NextResponse.json({ error: 'Contact information is required' }, { status: 400 })
    }

    // Get user from session/token if available
    const authHeader = req.headers.get('authorization')
    let userId = null

    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const user = await payload.findByID({
          collection: 'users',
          id: token, // This is simplified - you'd normally verify the JWT
        })
        userId = user.id
      } catch (error) {
        console.log('No authenticated user')
      }
    }

    // Prepare order items with proper structure
    const orderItems = items.map((item: any) => ({
      product: item.product?.id || item.product,
      quantity: item.quantity,
      price: item.product?.salePrice || item.product?.price || 0,
      sku: item.variantSku || '',
    }))

    // Create order
    const order = await payload.create({
      collection: 'orders',
      data: {
        customer: userId || shippingAddress.email, // Use email as fallback
        items: orderItems,
        subtotal,
        shipping,
        total,
        shippingMethod,
        shippingAddress: {
          name: shippingAddress.name,
          street: shippingAddress.street || 'N/A - Pickup Order',
          city: shippingAddress.city || 'N/A',
          state: shippingAddress.state || 'N/A',
          postalCode: shippingAddress.postalCode || 'N/A',
          country: shippingAddress.country || 'Nigeria',
          phone: shippingAddress.phone,
          email: shippingAddress.email,
        },
        billingAddress: {
          name: billingAddress?.name || shippingAddress.name,
          street: billingAddress?.street || shippingAddress.street || 'N/A',
          city: billingAddress?.city || shippingAddress.city || 'N/A',
          state: billingAddress?.state || shippingAddress.state || 'N/A',
          postalCode: billingAddress?.postalCode || shippingAddress.postalCode || 'N/A',
          country: billingAddress?.country || shippingAddress.country || 'Nigeria',
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending',
        status: 'pending',
      },
    })

    // Handle Pay on Pickup
    if (paymentMethod === 'cash' && shippingMethod === 'pickup') {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: (order as any).orderNumber,
        message: 'Order placed successfully. We will contact you with pickup details.',
      })
    }

    // Handle Online Payment with Paystack
    if (paymentMethod === 'paystack') {
      const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: shippingAddress.email,
          amount: Math.round(total * 100), // Convert to kobo
          reference: (order as any).orderNumber,
          callback_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order-confirmation?orderId=${order.id}`,
          metadata: {
            orderId: order.id,
            orderNumber: (order as any).orderNumber,
            custom_fields: [
              {
                display_name: 'Order Number',
                variable_name: 'order_number',
                value: (order as any).orderNumber,
              },
            ],
          },
        }),
      })

      const paystackData = await paystackResponse.json()

      if (!paystackResponse.ok) {
        return NextResponse.json(
          { error: paystackData.message || 'Payment initialization failed' },
          { status: 400 },
        )
      }

      // Update order with payment reference
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          paymentReference: paystackData.data.reference,
          transactionId: paystackData.data.access_code,
        },
      })

      return NextResponse.json({
        success: true,
        orderId: order.id,
        authorization_url: paystackData.data.authorization_url,
        data: paystackData.data,
      })
    }

    return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 })
  }
}
// import { NextRequest, NextResponse } from 'next/server'
// import { getPayload } from 'payload'
// import configPromise from '@payload-config'

// export async function POST(req: NextRequest) {
//   try {
//     const payload = await getPayload({ config: configPromise })
//     const body = await req.json()
//     const { items, address } = body || {}

//     if (!Array.isArray(items) || items.length === 0) {
//       return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
//     }

//     // Calculate totals and verify product prices from DB
//     let subtotal = 0
//     const orderItems: any[] = []
//     for (const item of items) {
//       const product = await payload.findByID({ collection: 'products', id: item.id })
//       const unitPrice = (product?.salePrice ?? product?.price) || 0
//       const quantity = Math.max(1, Number(item.quantity || 1))
//       const lineSubtotal = unitPrice * quantity
//       subtotal += lineSubtotal
//       orderItems.push({
//         product: product.id,
//         variantName: item.variantName,
//         unitPrice,
//         quantity,
//         subtotal: lineSubtotal,
//       })
//     }

//     // Simple shipping: try to find a matching zone
//     let shipping = 0
//     if (address?.country) {
//       const zones = await payload.find({
//         collection: 'shipping-zones',
//         pagination: false,
//         where: { country: { equals: address.country } },
//       })
//       const zone = zones.docs.find(
//         (z: any) => (!z.state || z.state === address.state) && (!z.city || z.city === address.city),
//       )
//       if (zone) {
//         shipping = zone.rate || 0
//       }
//     }

//     const total = subtotal + shipping

//     // Create order with pending status
//     const reference = `ORD-${Date.now()}`
//     const order = await payload.create({
//       collection: 'orders',
//       data: {
//         reference,
//         items: orderItems,
//         subtotal,
//         shipping,
//         total,
//         shippingAddress: address,
//         customerEmail: address?.email,
//         status: 'awaiting-payment',
//       },
//     })

//     // Initialize Paystack
//     const initRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || ''}/api/paystack/init`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         email: address?.email,
//         amount: Math.round(total * 100),
//         reference,
//         callback_url: `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/cart`,
//       }),
//     })
//     const initData = await initRes.json()
//     if (!initRes.ok) {
//       return NextResponse.json({ error: initData?.error || 'Payment init failed' }, { status: 400 })
//     }

//     // Save Paystack refs on order
//     await payload.update({
//       collection: 'orders',
//       id: order.id,
//       data: {
//         paystack: {
//           reference,
//           authorizationUrl: initData?.data?.authorization_url || initData?.authorization_url,
//           accessCode: initData?.data?.access_code || initData?.access_code,
//         },
//       },
//     })

//     return NextResponse.json(initData)
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
//   }
// }
