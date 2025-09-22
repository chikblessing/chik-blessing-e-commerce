import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    // Customers can create orders (public at checkout step before auth)
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'status', 'total', 'customerEmail'],
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      unique: true,
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
          name: 'variantName',
          type: 'text',
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'subtotal',
          type: 'number',
          required: true,
          min: 0,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'subtotal', type: 'number', min: 0, defaultValue: 0 },
        { name: 'shipping', type: 'number', min: 0, defaultValue: 0 },
        { name: 'tax', type: 'number', min: 0, defaultValue: 0 },
        { name: 'total', type: 'number', min: 0, defaultValue: 0 },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'fullName', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'addressLine1', type: 'text', required: true },
        { name: 'addressLine2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
        { name: 'postalCode', type: 'text' },
      ],
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Awaiting Payment', value: 'awaiting-payment' },
        { label: 'Paid', value: 'paid' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'paystack',
      type: 'group',
      fields: [
        { name: 'reference', type: 'text' },
        { name: 'authorizationUrl', type: 'text' },
        { name: 'accessCode', type: 'text' },
        { name: 'paidAt', type: 'date' },
        { name: 'channel', type: 'text' },
      ],
    },
    {
      name: 'tracking',
      type: 'group',
      fields: [
        { name: 'trackingNumber', type: 'text' },
        { name: 'carrier', type: 'text' },
        { name: 'estimatedDelivery', type: 'date' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
  timestamps: true,
}

