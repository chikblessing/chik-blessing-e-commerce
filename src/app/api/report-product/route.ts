import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()

    const {
      name,
      state,
      requesterType,
      reason,
      additionalDetails,
      email,
      phone,
      companyName,
      productLink,
    } = body

    // Validation
    if (!name || !state || !requesterType || !reason || !email || !phone || !productLink) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create product report
    const report = await payload.create({
      collection: 'product-reports',
      data: {
        name,
        state,
        requesterType,
        reason,
        additionalDetails: additionalDetails || '',
        email,
        phone,
        companyName: companyName || '',
        productLink,
        status: 'pending',
      },
    })

    return NextResponse.json(
      {
        success: true,
        reportId: report.id,
        message: 'Report submitted successfully',
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Error creating product report:', error)
    return NextResponse.json({ error: error.message || 'Failed to submit report' }, { status: 500 })
  }
}
