import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()

    const { product, customer, title, comment, rating } = body

    if (!product || !customer || !title || !comment || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Create review - validation for purchase and duplicate check happens in collection hooks
    const review = await payload.create({
      collection: 'reviews',
      data: {
        product,
        customer,
        title,
        comment,
        rating,
      } as any, // Type assertion needed until Payload types are regenerated
    })

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating review:', error)

    // Return specific error message from collection hooks
    const errorMessage = error?.message || 'Failed to create review'
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}
