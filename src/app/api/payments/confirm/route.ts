// app/api/payments/confirm/route.ts
import { getPayload } from 'payload'
import config from '../../../../payload.config'

export async function POST(request: Request) {
  const payload = await getPayload({ config })

  try {
    const { orderId, paymentMethod, paymentReference, paymentNotes } = await request.json()

    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Order ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Verify the order exists
    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
      depth: 0,
    })

    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (order.paymentStatus === 'paid') {
      return new Response(JSON.stringify({ error: 'Order is already paid' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Update the order with manual payment confirmation
    await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        paymentStatus: 'paid',
        status: 'processing',
        paymentMethod: paymentMethod || 'cash',
        paymentReference: paymentReference || `MANUAL-${Date.now()}`,
        paymentNotes: paymentNotes || '',
        paidAt: new Date().toISOString(),
      },
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment confirmed successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error confirming manual payment:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
