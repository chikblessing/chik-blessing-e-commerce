import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'

export const ShippingZones: CollectionConfig = {
  slug: 'shipping-zones',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'state', 'city', 'rate'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'country',
      type: 'text',
      required: true,
    },
    {
      name: 'state',
      type: 'text',
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'postalCode',
      type: 'text',
    },
    {
      name: 'rate',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'minOrderSubtotal',
      type: 'number',
      min: 0,
    },
    {
      name: 'maxOrderSubtotal',
      type: 'number',
      min: 0,
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}

