// collections/ShippingZones.ts
import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const ShippingZones: CollectionConfig = {
  slug: 'shipping-zones',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'baseRate', 'freeShippingThreshold', 'isActive'],
    group: 'Commerce',
  },
  access: {
    create: isAdmin,
    read: () => true, // Public read for checkout
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g., "Lagos Mainland", "Abuja", "Other States"',
      },
    },
    {
      name: 'states',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'state',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'States/regions covered by this shipping zone',
      },
    },
    {
      name: 'baseRate',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Base shipping cost in Naira',
      },
    },
    {
      name: 'freeShippingThreshold',
      type: 'number',
      min: 0,
      admin: {
        description: 'Order total for free shipping (0 = no free shipping)',
      },
    },
    {
      name: 'expressRate',
      type: 'number',
      min: 0,
      admin: {
        description: 'Additional cost for express delivery',
      },
    },
    {
      name: 'estimatedDays',
      type: 'group',
      fields: [
        {
          name: 'standard',
          type: 'number',
          min: 1,
          defaultValue: 3,
          admin: { description: 'Standard delivery days' },
        },
        {
          name: 'express',
          type: 'number',
          min: 1,
          defaultValue: 1,
          admin: { description: 'Express delivery days' },
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  timestamps: true,
}
