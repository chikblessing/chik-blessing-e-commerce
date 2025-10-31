import type { CollectionConfig } from 'payload'
import { sendAdminNotification } from '../lib/email/sendAdminNotification'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Contact Submission',
    plural: 'Contact Submissions',
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'status', 'createdAt'],
    group: 'Customer Service',
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email Address',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Message',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        {
          label: 'New',
          value: 'new',
        },
        {
          label: 'In Progress',
          value: 'in-progress',
        },
        {
          label: 'Resolved',
          value: 'resolved',
        },
        {
          label: 'Closed',
          value: 'closed',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        description: 'Internal notes for staff only',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Send admin notification for new contact submissions
        if (operation === 'create') {
          try {
            await sendAdminNotification({
              type: 'contact',
              subject: `New Contact Form: ${doc.fullName}`,
              title: 'New Contact Form Submission',
              details: {
                Name: doc.fullName,
                Email: doc.email,
                Phone: doc.phone || 'Not provided',
                Message: doc.message.substring(0, 200) + (doc.message.length > 200 ? '...' : ''),
                Status: doc.status,
                Date: new Date(doc.createdAt).toLocaleString(),
              },
              actionUrl: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/collections/contact-submissions/${doc.id}`,
            })
          } catch (error) {
            req.payload.logger.error({
              msg: 'Failed to send admin notification for contact submission',
              submissionId: doc.id,
              error,
            })
          }
        }
      },
    ],
  },
  timestamps: true,
}
