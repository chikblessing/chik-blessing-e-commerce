// collections/Reviews.ts
import type { CollectionConfig, AccessArgs } from 'payload'
import type { CustomUser } from '../types/User'

import { sendAdminNotification } from '../lib/email/sendAdminNotification'

type UserAccessArgs = AccessArgs<CustomUser>

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  access: {
    create: ({ req }) => {
      // Only authenticated users can create reviews
      // Additional validation in beforeChange hook checks if they purchased the product
      return !!req.user
    },
    read: () => true,
    update: ({ req: { user } }: UserAccessArgs) => {
      const customUser = user as CustomUser | undefined

      if (!customUser) return false
      // Only admins can update reviews (for moderation purposes)
      if (customUser.role === 'admin' || customUser.role === 'super_admin') return true
      // Regular users can update their own reviews
      return {
        customer: {
          equals: customUser.id,
        },
      }
    },
    delete: ({ req: { user } }: UserAccessArgs) => {
      const customUser = user as CustomUser | undefined
      // Only admins can delete reviews
      return customUser?.role === 'admin' || customUser?.role === 'super_admin'
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'product', 'customer', 'rating', 'isVerifiedPurchase', 'createdAt'],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
      maxLength: 1000,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },

    {
      name: 'isVerifiedPurchase',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        description: 'Automatically set if customer purchased this product',
      },
    },
    {
      name: 'helpfulVotes',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          // Check if user has purchased this product
          const orders = await req.payload.find({
            collection: 'orders',
            where: {
              and: [
                { customer: { equals: data.customer } },
                {
                  or: [
                    { status: { equals: 'delivered' } },
                    { status: { equals: 'shipped' } },
                    { paymentStatus: { equals: 'paid' } },
                  ],
                },
                { 'items.product': { equals: data.product } },
              ],
            },
          })

          // Prevent review creation if user hasn't purchased the product
          if (orders.totalDocs === 0) {
            throw new Error('You can only review products you have purchased')
          }

          // Check if user already reviewed this product
          const existingReview = await req.payload.find({
            collection: 'reviews',
            where: {
              and: [{ customer: { equals: data.customer } }, { product: { equals: data.product } }],
            },
          })

          if (existingReview.totalDocs > 0) {
            throw new Error('You have already reviewed this product')
          }

          data.isVerifiedPurchase = true
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // Send admin notification for new reviews
        if (operation === 'create') {
          try {
            const product =
              typeof doc.product === 'object'
                ? doc.product
                : await req.payload.findByID({
                    collection: 'products',
                    id: doc.product as string,
                  })

            const customer =
              typeof doc.customer === 'object'
                ? doc.customer
                : await req.payload.findByID({
                    collection: 'users',
                    id: doc.customer as string,
                  })

            await sendAdminNotification({
              type: 'review',
              subject: `New Review: ${doc.title}`,
              title: 'New Product Review',
              details: {
                Product: (product as any).title || 'Unknown',
                Customer: (customer as any).name || 'Unknown',
                Rating: `${doc.rating}/5 ⭐`,
                Title: doc.title,
                Review: doc.comment?.substring(0, 100) + (doc.comment?.length > 100 ? '...' : ''),
                'Verified Purchase': doc.isVerifiedPurchase ? 'Yes ✓' : 'No',
                Date: new Date(doc.createdAt).toLocaleString(),
              },
              actionUrl: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/collections/reviews/${doc.id}`,
            })
          } catch (error) {
            req.payload.logger.error({
              msg: 'Failed to send admin notification for new review',
              reviewId: doc.id,
              error,
            })
          }
        }
      },
      async ({ doc, operation, req }) => {
        if (operation === 'create' || operation === 'update') {
          const productId = typeof doc.product === 'string' ? doc.product : doc.product.id
          await updateProductRating(req.payload, productId)
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const productId = typeof doc.product === 'string' ? doc.product : doc.product.id
        await updateProductRating(req.payload, productId)
      },
    ],
  },
  timestamps: true,
}

async function updateProductRating(payload: any, productId: string): Promise<void> {
  try {
    const reviews = await payload.find({
      collection: 'reviews',
      where: {
        product: { equals: productId },
      },
      limit: 1000,
    })

    if (reviews.totalDocs === 0) {
      await payload.update({
        collection: 'products',
        id: productId,
        data: {
          rating: {
            average: 0,
            count: 0,
            breakdown: {
              fiveStars: 0,
              fourStars: 0,
              threeStars: 0,
              twoStars: 0,
              oneStar: 0,
            },
          },
        },
      })
      return
    }

    const ratings: number[] = reviews.docs.map((r: unknown) => r.rating)
    const average =
      ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length

    const breakdown = {
      fiveStars: ratings.filter((r: number) => r === 5).length,
      fourStars: ratings.filter((r: number) => r === 4).length,
      threeStars: ratings.filter((r: number) => r === 3).length,
      twoStars: ratings.filter((r: number) => r === 2).length,
      oneStar: ratings.filter((r: number) => r === 1).length,
    }

    await payload.update({
      collection: 'products',
      id: productId,
      data: {
        rating: {
          average: Math.round(average * 10) / 10,
          count: reviews.totalDocs,
          breakdown,
        },
      },
    })
  } catch (error) {
    console.error('Error updating product rating:', error)
  }
}
