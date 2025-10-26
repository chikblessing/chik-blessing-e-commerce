// collections/Orders.ts
import type { CollectionConfig, AccessArgs, CollectionBeforeChangeHook } from 'payload'
import { authenticated } from '../access/authenticated'
import type { CustomUser } from '../types/User'

// Define reusable utility types for clarity
type UserAccessArgs = AccessArgs<CustomUser>

const snapshotProductData: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  // 1. Generate Order Number (only on create, if not already provided)
  if (operation === 'create' && !data.orderNumber) {
    data.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`
  }

  // 2. Auto-set dates based on status changes
  if (originalDoc) {
    // Set shippedAt when status changes to 'shipped'
    if (data.status === 'shipped' && originalDoc.status !== 'shipped') {
      if (!data.delivery) data.delivery = {}
      if (!data.delivery.shippedAt) {
        data.delivery.shippedAt = new Date().toISOString()
      }
    }

    // Set actualDeliveryDate when status changes to 'delivered'
    if (data.status === 'delivered' && originalDoc.status !== 'delivered') {
      if (!data.delivery) data.delivery = {}
      if (!data.delivery.actualDeliveryDate) {
        data.delivery.actualDeliveryDate = new Date().toISOString()
      }
    }

    // Set cancelledAt when status changes to 'cancelled'
    if (data.status === 'cancelled' && originalDoc.status !== 'cancelled') {
      if (!data.cancelledAt) {
        data.cancelledAt = new Date().toISOString()
      }
    }

    // Set paidAt when payment status changes to 'paid'
    if (data.paymentStatus === 'paid' && originalDoc.paymentStatus !== 'paid') {
      if (!data.paidAt) {
        data.paidAt = new Date().toISOString()
      }
    }
  }

  // 3. Iterate and Snapshot Product Details (only on create)
  if (operation === 'create' && data.items && Array.isArray(data.items)) {
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i]
      const productId = item.product // Assumes item.product holds the ID

      if (productId && req.payload) {
        try {
          // Fetch the current product data snapshot
          const productDoc = (await req.payload.findByID({
            collection: 'products',
            id: productId as string,
            depth: 1, // Ensure the image relationship is populated
          })) as any

          const currentItem = data.items[i] as any

          currentItem.productTitle = productDoc.title

          // 🟢 FIX: Accessing the ID from the populated Media relationship
          // -----------------------------------------------------------

          // 1. Get the image field object from the array (productDoc.images[0])
          const imageField = productDoc?.images?.[0]

          if (imageField) {
            // 2. The relationship target is imageField.image.
            //    Check if it's a populated object (not a string ID).
            if (typeof imageField.image === 'object' && imageField.image !== null) {
              // If populated, save the ID of the Media document
              currentItem.productImage = imageField.image.id
            } else {
              // If it's a string ID (depth wasn't enough/correct), save the ID directly
              currentItem.productImage = imageField.image
            }
          } else {
            currentItem.productImage = null
          }
        } catch (error) {
          req.payload.logger.error({
            msg: `Error snapshotting product ${productId} for new order.`,
            error,
          })
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
    update: ({ req: { user } }: UserAccessArgs) => {
      const customUser = user as CustomUser | undefined
      // Only admins can update orders
      return customUser?.role === 'admin'
    },
    delete: ({ req: { user } }: UserAccessArgs) => {
      const customUser = user as CustomUser | undefined
      // Only admins can delete orders
      return customUser?.role === 'admin'
    },
  },
  admin: {
    useAsTitle: 'orderNumber',
    // 🟢 UPDATE: Added delivery dates to the default view
    defaultColumns: [
      'orderNumber',
      'customer',
      'guestEmail',
      'total',
      'status',
      'createdAt',
      'delivery.expectedDeliveryDate',
    ],
    listSearchableFields: [
      'orderNumber',
      'guestEmail',
      'transactionId',
      'paymentReference',
      'shippingAddress.name',
      'shippingAddress.email',
      'shippingAddress.phone',
    ],
    // 🟢 Enable grouping and better organization
    group: 'Commerce',
  },
  fields: [
    { name: 'orderNumber', type: 'text', required: true, unique: true, admin: { readOnly: true } },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      index: true,
      admin: {
        description: 'Customer who placed this order',
        // 🟢 Enable filtering by customer in admin UI
      },
      // 🟢 Enable filtering by nested user fields
      filterOptions: ({ relationTo, data }) => {
        // This allows filtering by user properties
        return {}
      },
    },
    {
      name: 'guestEmail',
      type: 'email',
      admin: {
        description: 'Email for guest orders (when customer is not logged in)',
      },
      index: true, // Enable searching by guest email
    },
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
      name: 'shippingMethod',
      type: 'select',
      options: [
        { label: 'Standard Delivery', value: 'standard' },
        { label: 'Express Delivery', value: 'express' },
        { label: 'Store Pickup', value: 'pickup' },
      ],
      defaultValue: 'standard',
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
      admin: {
        description: 'Shipping and delivery tracking information',
      },
      fields: [
        {
          name: 'trackingNumber',
          type: 'text',
          admin: { description: 'Carrier tracking number' },
          index: true, // Enable searching by tracking number
        },
        {
          name: 'carrier',
          type: 'text',
          admin: { description: 'Shipping carrier (e.g., FedEx, USPS, DHL)' },
        },
        {
          name: 'shippedAt',
          type: 'date',
          admin: {
            description: 'Date when the order was shipped',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
          index: true, // Enable filtering by ship date
        },
        {
          name: 'expectedDeliveryDate',
          type: 'date',
          admin: {
            description: 'Estimated date the customer should receive the order.',
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
          index: true, // Enable filtering by expected delivery
        },
        {
          name: 'actualDeliveryDate',
          type: 'date',
          admin: {
            description: 'The confirmed date the order was delivered.',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
          index: true, // Enable filtering by actual delivery
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
        {
          name: 'name',
          type: 'text',
          required: true,
          index: true, // Enable searching by customer name
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          index: true, // Enable searching by phone
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          index: true, // Enable searching by email
        },
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
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: 'Paystack (Online)', value: 'paystack' },
        { label: 'Card (In-Person)', value: 'card_manual' },
        { label: 'Bank Transfer', value: 'bank_transfer' },
        { label: 'Cash', value: 'cash' },
        { label: 'Mobile Money', value: 'mobile_money' },
      ],
      defaultValue: 'paystack',
      required: true,
    },
    {
      name: 'paymentStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
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
    {
      name: 'paymentReference',
      type: 'text',
      admin: { description: 'Payment gateway reference or receipt number' },
    },
    { name: 'transactionId', type: 'text' },
    {
      name: 'paymentNotes',
      type: 'textarea',
      admin: {
        description: 'Additional payment details (e.g., bank transfer proof, cash receipt number)',
      },
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Date when payment was confirmed',
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'MMM d, yyyy h:mm a',
        },
      },
      index: true, // Enable filtering by payment date
    },
    // 🟢 NEW: Add a cancelled date field for tracking
    {
      name: 'cancelledAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Date when order was cancelled',
        position: 'sidebar',
        condition: (data) => data.status === 'cancelled',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'MMM d, yyyy h:mm a',
        },
      },
      index: true,
    },
  ],
  hooks: {
    beforeChange: [snapshotProductData],
    afterChange: [
      async ({ doc, req, operation, previousDoc }) => {
        // Update user order history on create
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

        // Reduce product stock when payment status changes to 'paid'
        if (operation === 'update' && previousDoc) {
          const paymentJustPaid =
            doc.paymentStatus === 'paid' && previousDoc.paymentStatus !== 'paid'

          if (paymentJustPaid && doc.items && Array.isArray(doc.items)) {
            for (const item of doc.items) {
              const productId = typeof item.product === 'string' ? item.product : item.product.id

              try {
                // Fetch current product
                const product = await req.payload.findByID({
                  collection: 'products',
                  id: productId,
                  depth: 0,
                })

                // Reduce stock if inventory tracking is enabled
                if (product.inventory?.trackInventory) {
                  const currentStock = product.inventory.stock || 0
                  const newStock = Math.max(0, currentStock - item.quantity)

                  await req.payload.update({
                    collection: 'products',
                    id: productId,
                    data: {
                      inventory: {
                        ...product.inventory,
                        stock: newStock,
                      },
                    },
                  })

                  req.payload.logger.info({
                    msg: `Stock reduced for product ${productId}: ${currentStock} -> ${newStock}`,
                    orderId: doc.id,
                    orderNumber: doc.orderNumber,
                  })
                }
              } catch (error) {
                req.payload.logger.error({
                  msg: `Error reducing stock for product ${productId}`,
                  orderId: doc.id,
                  error,
                })
              }
            }
          }
        }
      },
    ],
  },
  timestamps: true,
}
