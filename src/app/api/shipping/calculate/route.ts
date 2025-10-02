// app/api/shipping/calculate/route.ts
import { getPayload } from 'payload'
import config from '../../../../payload.config'

export async function POST(request: Request) {
  const payload = await getPayload({ config })

  try {
    const { state, orderTotal, isExpress = false } = await request.json()

    if (!state || orderTotal === undefined) {
      return new Response(
        JSON.stringify({
          error: 'State and order total are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Find shipping zone for the state
    const shippingZones = await payload.find({
      collection: 'shipping-zones',
      where: {
        and: [{ isActive: { equals: true } }, { 'states.state': { equals: state } }],
      },
      limit: 1,
    })

    if (shippingZones.docs.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Shipping not available to this location',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const zone = shippingZones.docs[0]
    let shippingCost = zone.baseRate

    // Check for free shipping threshold
    if (zone.freeShippingThreshold && orderTotal >= zone.freeShippingThreshold) {
      shippingCost = 0
    }

    // Add express shipping cost
    if (isExpress && zone.expressRate) {
      shippingCost += zone.expressRate
    }

    // Calculate estimated delivery date
    const deliveryDays = isExpress
      ? zone.estimatedDays?.express || 1
      : zone.estimatedDays?.standard || 3
    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays)

    return new Response(
      JSON.stringify({
        shippingCost,
        zoneName: zone.name,
        estimatedDelivery: estimatedDelivery.toISOString().split('T')[0], // YYYY-MM-DD format
        deliveryDays,
        freeShippingEligible:
          zone.freeShippingThreshold && orderTotal >= zone.freeShippingThreshold,
        freeShippingThreshold: zone.freeShippingThreshold,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error calculating shipping:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
