// collections/Orders.ts
import type { CollectionConfig, AccessArgs, CollectionBeforeChangeHook } from 'payload'
import { authenticated } from '../access/authenticated'
import type { CustomUser } from '../types/User'

// Define reusable utility types for clarity
type UserAccessArgs = AccessArgs<CustomUser>

const snapshotProductData: CollectionBeforeChangeHook = async ({ data, req }) => {
  // 1. Generate Order Number
  data.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`

  // 2. Iterate and Snapshot Product Details
  if (data.items && Array.isArray(data.items)) {
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i]
      const productId = item.product // Assumes item.product holds the ID

      if (productId && req.payload) {
        try {
          // Fetch the current product data snapshot
          const productDoc = await req.payload.findByID({
            collection: 'products',
            id: productId as string,
            depth: 1, // Ensure the image relationship is populated
          }) as any

           const currentItem = data.items[i] as any

           currentItem.productTitle = productDoc.title

          // 🟢 FIX: Accessing the ID from the populated Media relationship
                    // -----------------------------------------------------------
                    
                    // 1. Get the image field object from the array (productDoc.images[0])
                    const imageField = productDoc?.images?.[0]; 

                    if (imageField) {
                        // 2. The relationship target is imageField.image.
                        //    Check if it's a populated object (not a string ID).
                        if (typeof imageField.image === 'object' && imageField.image !== null) {
                            // If populated, save the ID of the Media document
                            currentItem.productImage = imageField.image.id;
                        } else {
                            // If it's a string ID (depth wasn't enough/correct), save the ID directly
                            currentItem.productImage = imageField.image; 
                        }
                    } else {
                        currentItem.productImage = null;
                    }
                    
                } catch (error) {
                    req.payload.logger.error({ 
                        msg: `Error snapshotting product ${productId} for new order.`, 
                        error,
                    });
          // Decide how to handle failure: throw error, or proceed with nulls
          // For production, you would typically throw an error to fail the order creation.
        }
      }
    }
  }

  return data
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: authenticated,
    read: ({ req: { user } }: UserAccessArgs) => {
      const customUser = user as CustomUser | undefined

      if (customUser?.role === 'admin') return true
      return {
        id: {
          equals: customUser?.id,
        },
      }
    },
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'orderNumber',
    // 🟢 UPDATE: Added delivery dates to the default view
    defaultColumns: ['orderNumber', 'customer', 'total', 'status', 'delivery.expectedDeliveryDate'],
  },
  fields: [
    { name: 'orderNumber', type: 'text', required: true, unique: true, admin: { readOnly: true } },
    { name: 'customer', type: 'relationship', relationTo: 'users', required: true, index: true },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'productTitle',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'productImage',
          type: 'upload',
          relationTo: 'media',
          admin: { readOnly: true },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'sku',
          type: 'text',
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'shipping',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'tax',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },

    // 🟢 NEW GROUP: Delivery Dates and Tracking
    {
      name: 'delivery',
      label: 'Delivery & Shipping',
      type: 'group',
      fields: [
        {
          name: 'trackingNumber',
          type: 'text',
          admin: { description: 'Carrier tracking number' },
        },
        {
          name: 'carrier',
          type: 'text',
          admin: { description: 'Shipping carrier (e.g., FedEx, USPS)' },
        },
        {
          name: 'expectedDeliveryDate',
          type: 'date',
          admin: { description: 'Estimated date the customer should receive the order.' },
        },
        {
          name: 'actualDeliveryDate',
          type: 'date',
          admin: { description: 'The confirmed date the order was delivered.' },
        },
      ],
    },

    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      required: true,
      access: {
        update: ({ req }) => {
          // 💡 FIX: Define the type of the user object in the function signature
          const user = req.user as CustomUser

          // TypeScript now recognizes 'user.role'
          return !!user && user.role === 'admin'
        },
      },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'street', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
      ],
    },
    {
      name: 'billingAddress',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'street', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
      ],
    },

    {
      name: 'paymentStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
      ],
      defaultValue: 'pending',
      required: true,
      access: {
        update: ({ req }) => {
          // 💡 FIX: Define the type of the user object in the function signature
          const user = req.user as CustomUser

          // TypeScript now recognizes 'user.role'
          return !!user && user.role === 'admin'
        },
      },
    },
    { name: 'transactionId', type: 'text' },
  ],
  hooks: {
    beforeChange: [snapshotProductData],
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          try {
            const customerId = typeof doc.customer === 'string' ? doc.customer : doc.customer.id

            // Note: This assumes you have an orderHistory field in your Users collection
            // If not, you may need to add it or handle this differently
            const user = await req.payload.findByID({
              collection: 'users',
              id: customerId,
            })

            // Only update if the user has an orderHistory field
            if ('orderHistory' in user) {
              const orderHistory = (user as any).orderHistory || []
              orderHistory.push(doc.id)

              await req.payload.update({
                collection: 'users',
                id: customerId,
                data: { orderHistory } as any,
              })
            }
          } catch (error) {
            req.payload.logger.error({
              msg: 'Error updating user order history',
              error,
            })
          }
        }
      },
    ],
    // ... (afterChange hook for syncing user order history)
  },
  timestamps: true,
}
