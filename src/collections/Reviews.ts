// collections/Reviews.ts
import type { CollectionConfig, AccessArgs } from 'payload'
import type { CustomUser } from '../types/User'

import { authenticated } from '../access/authenticated'

type UserAccessArgs = AccessArgs<CustomUser>


export const Reviews: CollectionConfig = {
  slug: 'reviews',
  access: {
    create: ({ req }) => {
      return !!req.user
    },
    read: () => true,
    update: ({ req: { user } }: UserAccessArgs) => {
      const customUser = user as CustomUser | undefined

      if (customUser?.role === 'admin') return true
      return {
        id: {
          equals: customUser?.id,
        },
      }
    },
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'product', 'customer', 'rating', 'status'],
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
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
      required: true,
      access: {
        update: authenticated,
      },
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
          const orders = await req.payload.find({
            collection: 'orders',
            where: {
              and: [
                { customer: { equals: data.customer } },
                { status: { equals: 'delivered' } },
                { 'items.product': { equals: data.product } },
              ],
            },
          })

          data.isVerifiedPurchase = orders.totalDocs > 0
        }
        return data
      },
    ],
    afterChange: [
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
        and: [{ product: { equals: productId } }, { status: { equals: 'approved' } }],
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

    const ratings: number[] = reviews.docs.map((r: any) => r.rating)
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
