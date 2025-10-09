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

    // Check if user already reviewed this product
    const existingReview = await payload.find({
      collection: 'reviews',
      where: {
        and: [{ product: { equals: product } }, { customer: { equals: customer } }],
      },
    })

    if (existingReview.totalDocs > 0) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 })
    }

    const review = await payload.create({
      collection: 'reviews',
      data: {
        product,
        customer,
        title,
        comment,
        rating,
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
