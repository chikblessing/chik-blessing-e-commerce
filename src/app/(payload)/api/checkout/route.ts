import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()
    const { items, address } = body || {}

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Calculate totals and verify product prices from DB
    let subtotal = 0
    const orderItems: any[] = []
    for (const item of items) {
      const product = await payload.findByID({ collection: 'products', id: item.id })
      const unitPrice = (product?.salePrice ?? product?.price) || 0
      const quantity = Math.max(1, Number(item.quantity || 1))
      const lineSubtotal = unitPrice * quantity
      subtotal += lineSubtotal
      orderItems.push({
        product: product.id,
        variantName: item.variantName,
        unitPrice,
        quantity,
        subtotal: lineSubtotal,
      })
    }

    // Simple shipping: try to find a matching zone
    let shipping = 0
    if (address?.country) {
      const zones = await payload.find({
        collection: 'shipping-zones',
        pagination: false,
        where: { country: { equals: address.country } },
      })
      const zone = zones.docs.find(
        (z: any) => (!z.state || z.state === address.state) && (!z.city || z.city === address.city),
      )
      if (zone) {
        shipping = zone.rate || 0
      }
    }

    const total = subtotal + shipping

    // Create order with pending status
    const reference = `ORD-${Date.now()}`
    const order = await payload.create({
      collection: 'orders',
      data: {
        reference,
        items: orderItems,
        subtotal,
        shipping,
        total,
        shippingAddress: address,
        customerEmail: address?.email,
        status: 'awaiting-payment',
      },
    })

    // Initialize Paystack
    const initRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || ''}/api/paystack/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: address?.email,
        amount: Math.round(total * 100),
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/cart`,
      }),
    })
    const initData = await initRes.json()
    if (!initRes.ok) {
      return NextResponse.json({ error: initData?.error || 'Payment init failed' }, { status: 400 })
    }

    // Save Paystack refs on order
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        paystack: {
          reference,
          authorizationUrl: initData?.data?.authorization_url || initData?.authorization_url,
          accessCode: initData?.data?.access_code || initData?.access_code,
        },
      },
    })

    return NextResponse.json(initData)
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}




