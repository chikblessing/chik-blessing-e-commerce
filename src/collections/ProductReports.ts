import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { sendAdminNotification } from '../lib/email/sendAdminNotification'

export const ProductReports: CollectionConfig = {
  slug: 'product-reports',
  access: {
    create: () => true, // Anyone can submit a report
    read: authenticated, // Only authenticated users (admins) can read
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'reason', 'status', 'createdAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Reporter Name',
    },
    {
      name: 'state',
      type: 'select',
      required: true,
      options: [
        { label: 'Abia', value: 'Abia' },
        { label: 'Adamawa', value: 'Adamawa' },
        { label: 'Akwa Ibom', value: 'Akwa Ibom' },
        { label: 'Anambra', value: 'Anambra' },
        { label: 'Bauchi', value: 'Bauchi' },
        { label: 'Bayelsa', value: 'Bayelsa' },
        { label: 'Benue', value: 'Benue' },
        { label: 'Borno', value: 'Borno' },
        { label: 'Cross River', value: 'Cross River' },
        { label: 'Delta', value: 'Delta' },
        { label: 'Ebonyi', value: 'Ebonyi' },
        { label: 'Edo', value: 'Edo' },
        { label: 'Ekiti', value: 'Ekiti' },
        { label: 'Enugu', value: 'Enugu' },
        { label: 'FCT', value: 'FCT' },
        { label: 'Gombe', value: 'Gombe' },
        { label: 'Imo', value: 'Imo' },
        { label: 'Jigawa', value: 'Jigawa' },
        { label: 'Kaduna', value: 'Kaduna' },
        { label: 'Kano', value: 'Kano' },
        { label: 'Katsina', value: 'Katsina' },
        { label: 'Kebbi', value: 'Kebbi' },
        { label: 'Kogi', value: 'Kogi' },
        { label: 'Kwara', value: 'Kwara' },
        { label: 'Lagos', value: 'Lagos' },
        { label: 'Nasarawa', value: 'Nasarawa' },
        { label: 'Niger', value: 'Niger' },
        { label: 'Ogun', value: 'Ogun' },
        { label: 'Ondo', value: 'Ondo' },
        { label: 'Osun', value: 'Osun' },
        { label: 'Oyo', value: 'Oyo' },
        { label: 'Plateau', value: 'Plateau' },
        { label: 'Rivers', value: 'Rivers' },
        { label: 'Sokoto', value: 'Sokoto' },
        { label: 'Taraba', value: 'Taraba' },
        { label: 'Yobe', value: 'Yobe' },
        { label: 'Zamfara', value: 'Zamfara' },
      ],
    },
    {
      name: 'requesterType',
      type: 'select',
      required: true,
      options: [
        { label: 'Individual', value: 'individual' },
        { label: 'Organization', value: 'organization' },
      ],
    },
    {
      name: 'reason',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Product description appears to be wrong or misleading information',
          value: 'misleading',
        },
        {
          label: 'Product description contains inappropriate content',
          value: 'inappropriate',
        },
        {
          label: 'Product appears to be counterfeit',
          value: 'counterfeit',
        },
        {
          label: 'Product may be prohibited or banned by law',
          value: 'prohibited',
        },
      ],
    },
    {
      name: 'additionalDetails',
      type: 'textarea',
      label: 'Additional Details',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'companyName',
      type: 'text',
      label: 'Company Name',
      admin: {
        condition: (data) => data.requesterType === 'organization',
      },
    },
    {
      name: 'productLink',
      type: 'text',
      required: true,
      label: 'Product Link',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Under Investigation', value: 'investigating' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Dismissed', value: 'dismissed' },
      ],
      access: {
        update: ({ req }) => !!req.user,
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        description: 'Internal notes for admin use only',
      },
      access: {
        read: ({ req }) => !!req.user,
        update: ({ req }) => !!req.user,
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Send admin notification for new product reports
        if (operation === 'create') {
          try {
            const reasonLabels: Record<string, string> = {
              misleading: 'Wrong or misleading information',
              inappropriate: 'Inappropriate content',
              counterfeit: 'Counterfeit product',
              prohibited: 'Prohibited or banned',
            }

            await sendAdminNotification({
              type: 'product_report',
              subject: `Product Report: ${doc.reason}`,
              title: 'New Product Report',
              details: {
                Reporter: doc.name,
                Email: doc.email,
                Phone: doc.phone,
                State: doc.state,
                Type:
                  doc.requesterType === 'organization'
                    ? `Organization (${doc.companyName})`
                    : 'Individual',
                Reason: reasonLabels[doc.reason] || doc.reason,
                'Product Link': doc.productLink,
                'Additional Details':
                  doc.additionalDetails?.substring(0, 150) +
                    (doc.additionalDetails?.length > 150 ? '...' : '') || 'None',
                Status: doc.status,
                Date: new Date(doc.createdAt).toLocaleString(),
              },
              actionUrl: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/collections/product-reports/${doc.id}`,
            })
          } catch (error) {
            req.payload.logger.error({
              msg: 'Failed to send admin notification for product report',
              reportId: doc.id,
              error,
            })
          }
        }
      },
    ],
  },
  timestamps: true,
}
