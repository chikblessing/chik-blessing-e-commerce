// app/api/payments/initialize/route.ts (Refined for Production)

import { getPayload } from 'payload'
// Assume config import is correctly handled
import config from '../../../../payload.config'

export async function POST(request: Request) {
  const payload = await getPayload({ config }) // We extract client-provided data, but trust only orderId for lookup.
  const { email: clientEmail, orderId, callback_url } = await request.json()
  try {
    const authResult = await payload.auth({ headers: request.headers })
    if (!authResult.user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 })
    }

    // 🟢 CRITICAL 1: VERIFY ORDER AND CALCULATE FINAL AMOUNT ON SERVER
    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
      depth: 0, // No need for deep depth here
    })

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 })
    }

    // 🟢 CRITICAL 2: VERIFY OWNERSHIP
    // Orders collection uses 'customer' field, not 'user'
    const customerId = typeof order.customer === 'string' ? order.customer : order.customer?.id
    if (customerId !== authResult.user.id) {
      return Response.json({ error: 'Order not owned by user' }, { status: 403 })
    }

    // 🟢 CRITICAL 3: USE SERVER-SIDE AMOUNT
    const serverAmount = order.total || 0 // Assuming 'total' is a field on your order
    const amountInKobo = Math.round(serverAmount * 100)

    if (amountInKobo <= 0) {
      return Response.json({ error: 'Invalid order total.' }, { status: 400 })
    }

    // Use the email associated with the user/order for better tracking
    const finalEmail = clientEmail || authResult.user.email

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInKobo, // ⬅️ USED SERVER AMOUNT
        email: finalEmail,
        currency: 'NGN',
        reference: `order_${orderId}_${Date.now()}`,
        callback_url: callback_url || `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/payment/callback`,
        metadata: {
          orderId,
          userId: authResult.user.id,
        },
      }),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      console.error('Paystack Initialization Error:', paystackData)
      return Response.json(
        { error: paystackData.message || 'Payment initialization failed' },
        { status: 400 },
      )
    } // Update order with payment reference

    await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        paymentReference: paystackData.data.reference,
        paymentStatus: 'pending',
      },
    })

    return Response.json({
      success: true,
      data: paystackData.data,
    })
  } catch (error: any) {
    // 🟢 SECURITY FIX: Log detailed error and return generic public error
    console.error(`Payment initialization failed for order ${orderId}:`, error)
    return Response.json(
      { error: 'A server error occurred during payment initialization.' },
      { status: 500 },
    )
  }
}
