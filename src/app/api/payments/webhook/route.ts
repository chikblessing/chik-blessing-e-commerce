// app/api/payments/webhook/route.ts
import { getPayload } from 'payload'
import crypto from 'crypto'
// Assume config import is correctly handled
import config from '../../../../payload.config'

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const signature = request.headers.get('x-paystack-signature')

  // 1. Get the raw body text for signature verification
  const bodyText = await request.text()

  if (!signature) {
    // Log potential security issue, but return 200 to prevent Paystack retries
    console.warn('Webhook received with missing X-Paystack-Signature header.')
    return new Response(null, { status: 200 })
  }

  // 2. CRITICAL: Verify the webhook signature
  // This confirms the request actually came from Paystack and wasn't tampered with.
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY as string)
    .update(bodyText)
    .digest('hex')

  if (hash !== signature) {
    console.error('Webhook signature verification failed. Possible tampering attempt.')
    return new Response(null, { status: 400 }) // Return 400 for bad request/tampering
  }

  // 3. Parse the verified body
  const event = JSON.parse(bodyText)

  // Check if the transaction was successful
  if (event.event === 'charge.success' && event.data.status === 'success') {
    const transaction = event.data
    const { orderId } = transaction.metadata
    const reference = transaction.reference
    const paidAt = transaction.paid_at

    try {
      // Check if the order is already paid (idempotency)
      const order = await payload.findByID({
        collection: 'orders',
        id: orderId,
        depth: 0,
      })

      if (order.paymentStatus === 'paid') {
        return new Response(null, { status: 200 }) // Already handled, return success
      }

      // 4. Update the order status
      await payload.update({
        collection: 'orders',
        id: orderId,
        data: {
          paymentStatus: 'paid',
          status: 'processing', // Move to the next fulfillment stage
          paymentMethod: 'paystack',
          paymentReference: reference,
          paidAt: paidAt ? new Date(paidAt).toISOString() : new Date().toISOString(),
        },
      })

      // 5. Success: Tell Paystack we received and processed the event
      return new Response(null, { status: 200 })
    } catch (error) {
      console.error(`Error processing order ${orderId} in webhook:`, error)
      // Return 500 to tell Paystack to retry the webhook
      return new Response(null, { status: 500 })
    }
  }

  // For events we don't care about (e.g., charge.failed, subscription.create)
  return new Response(null, { status: 200 })
}
