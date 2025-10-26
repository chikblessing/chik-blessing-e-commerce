import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')

    const payload = await getPayload({ config })

    // Fetch all active shipping zones
    const result = await payload.find({
      collection: 'shipping-zones',
      where: {
        isActive: {
          equals: true,
        },
      },
    })

    // If a state is provided, find the matching zone
    if (state) {
      const matchingZone = result.docs.find((zone: any) =>
        zone.states?.some((s: any) => s.state.toLowerCase() === state.toLowerCase()),
      )

      if (matchingZone) {
        return NextResponse.json({
          success: true,
          zone: matchingZone,
        })
      }

      // Return default zone if no match found
      const defaultZone = result.docs.find((zone: any) => zone.name.toLowerCase().includes('other'))

      return NextResponse.json({
        success: true,
        zone: defaultZone || result.docs[0] || null,
      })
    }

    // Return all zones if no state specified
    return NextResponse.json({
      success: true,
      zones: result.docs,
    })
  } catch (error) {
    console.error('Shipping zones error:', error)
    return NextResponse.json({ error: 'Failed to fetch shipping zones' }, { status: 500 })
  }
}
