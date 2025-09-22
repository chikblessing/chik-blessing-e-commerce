import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sku', 'status', 'price', 'inventory'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'salePrice',
          type: 'number',
          min: 0,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'inventory',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'in-stock',
          options: [
            {
              label: 'In Stock',
              value: 'in-stock',
            },
            {
              label: 'Out Of Stock',
              value: 'out-of-stock',
            },
            {
              label: 'Preorder',
              value: 'preorder',
            },
          ],
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      labels: {
        singular: 'Variant',
        plural: 'Variants',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'sku',
          type: 'text',
        },
        {
          name: 'priceDelta',
          type: 'number',
          admin: { description: 'Delta added to base price (can be negative)' },
        },
        {
          name: 'inventory',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
      ],
    },
    ...slugField(),
  ],
  timestamps: true,
}

