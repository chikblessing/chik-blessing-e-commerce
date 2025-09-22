import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, amount, reference, callback_url } = body || {}

    if (!email || !amount || !reference) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, amount, reference, callback_url }),
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: data?.message || 'Paystack error' }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

