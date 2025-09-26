import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Promotions: CollectionConfig = {
  slug: 'promotions',
  access: {
    // Only authenticated users (Admins/Editors) can manage promotions
    create: authenticated,
    update: authenticated,
    delete: authenticated,
    // Public read access is required for the frontend to check active promotions
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'type', 'value', 'isActive'],
    group: 'E-commerce',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Internal name for the promotion (e.g., Summer Sale 2025)',
      },
    },
    {
      name: 'code',
      type: 'text',
      required: false,
      unique: true,
      index: true,
      admin: {
        description:
          'The coupon code customers must enter (e.g., SAVE20). Leave empty for automatic/site-wide sales.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Controls if the promotion is currently active and available for use.',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Percentage Discount', value: 'percentage' },
        { label: 'Fixed Amount Discount', value: 'fixed' },
        { label: 'Free Shipping', value: 'shipping' },
      ],
      defaultValue: 'percentage',
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'The discount value (e.g., 20 for 20% off or 10 for $10 off).',
        // Only show value if it's not a Free Shipping promotion
        condition: (data) => data.type !== 'shipping',
      },
    },
    {
      name: 'dates',
      type: 'group',
      label: 'Validity Period',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            description: 'Promotion will automatically expire after this date.',
          },
        },
      ],
    },
    {
      name: 'usageLimit',
      type: 'group',
      label: 'Usage Restrictions',
      fields: [
        {
          name: 'totalUses',
          type: 'number',
          min: 1,
          admin: {
            description: 'Maximum number of times this promotion can be used across all customers.',
          },
        },
        {
          name: 'usesCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description:
              'Automatically tracked count of how many times the promotion has been used.',
          },
        },
        {
          name: 'perCustomer',
          type: 'number',
          min: 1,
          admin: {
            description: 'Maximum number of times a single customer can use this promotion.',
          },
        },
      ],
    },
    {
      name: 'minimumOrder',
      type: 'number',
      min: 0,
      admin: {
        description: 'Minimum required purchase amount before the discount can be applied.',
      },
    },
    {
      name: 'appliesTo',
      type: 'select',
      options: [
        { label: 'Entire Order', value: 'all' },
        { label: 'Specific Products', value: 'products' },
      ],
      defaultValue: 'all',
    },
    {
      name: 'eligibleProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        condition: (data) => data.appliesTo === 'products',
        description: 'Only products selected here will be discounted.',
      },
    },
  ],
  timestamps: true,
}
