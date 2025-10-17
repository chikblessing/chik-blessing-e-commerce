import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
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

    // Map reason text to value
    const reasonMap: Record<string, string> = {
      'Product description appears to be wrong or misleading information': 'misleading',
      'Product description contains inappropriate content': 'inappropriate',
      'Product appears to be counterfeit': 'counterfeit',
      'Product may be prohibited or banned by law': 'prohibited',
    }

    const reasonValue = reasonMap[reason] || reason

    // Create product report
    const report = await payload.create({
      collection: 'product-reports',
      data: {
        name,
        state,
        requesterType,
        reason: reasonValue,
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
