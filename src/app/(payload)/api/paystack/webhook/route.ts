import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const secret = process.env.PAYSTACK_SECRET_KEY || ''
  const hash = crypto.createHmac('sha512', secret).update(body).digest('hex')
  const signature = req.headers.get('x-paystack-signature') || ''

  if (hash !== signature) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const event = JSON.parse(body)

  // TODO: update Orders by reference, set status paid and paidAt
  // This is a stub. The full implementation will fetch order and update.

  return NextResponse.json({ received: true })
}

