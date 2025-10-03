import type {
  CollectionConfig,
  AccessArgs,
  FieldAccess,
  // Add other necessary types if needed (e.g., Validate)
} from 'payload'

import { authenticated } from '../../access/authenticated'

import type { CustomUser } from '../../types/User'

// Define reusable utility types for clarity
type UserAccessArgs = AccessArgs<CustomUser>
type UserFieldAccessArgs = FieldAccess<CustomUser>

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => {
      return !!user && (user as CustomUser).role === 'admin'
    },
    create: () => true,
    delete: authenticated,
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

      if (customUser?.role === 'admin') return true
      return {
        id: {
          equals: customUser?.id,
        },
      }
    },
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: {
    verify: {
      generateEmailHTML: ({ token, user }: { token: string; user: CustomUser }) => {
        if (user?.role === 'admin') return ''

        return `
                    <h1>Welcome to our store!</h1>
                    <p>Please verify your email to complete your registration:</p>
                    <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/verify-email?token=${token}">
                        Verify Email
                    </a>
                `
      },
    },
    forgotPassword: {
      generateEmailHTML: (args?: { token?: string; user?: CustomUser }): string => {
        const { token, user } = args || {}

        if (!token) return 'Error: Password reset token missing.'

        const isAdmin = user?.role === 'admin'

        return `
                    <h1>Reset your password</h1>
                    <p>Click the link below to reset your ${isAdmin ? 'admin' : ''} password:</p>
                    <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/reset-password?token=${token}">
                        Reset Password
                    </a>
                `
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: false,
      validate: (value: string | null | undefined, { data }: { data: Partial<CustomUser> }) => {
        if (data?.role === 'customer' && !value) {
          return 'First Name is required for customers.'
        }
        return true
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: false,
      validate: (value: string | null | undefined, { data }: { data: Partial<CustomUser> }) => {
        if (data?.role === 'customer' && !value) {
          return 'Last Name is required for customers.'
        }
        return true
      },
    },
    {
      name: 'avatar',
      type: 'upload', // Using type 'upload' directly creates a relationship to the Media collection
      relationTo: 'media',
      admin: {
        description: 'User profile picture or avatar.',
      },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
      ],
      defaultValue: 'customer',
      required: true,
      access: {
        update: ({ req }) => {
          // This is only checking if req.user exists, so no specific typing needed here
          return Boolean(req.user)
        },
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        condition: (data) => (data as CustomUser).role === 'customer',
      },
    },

    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Non-binary', value: 'nonbinary' },
        { label: 'Prefer not to say', value: 'undisclosed' },
      ],
      required: false,
    },

    {
      name: 'dateOfBirth',
      type: 'date',
      required: false,
      validate: (value) => {
        if (value && new Date(value) > new Date()) {
          return 'Date of Birth cannot be in the future.'
        }
        return true
      },
    },
    {
      name: 'addresses',
      type: 'array',
      // 8. 🟢 Assert CustomUser type in condition functions
      admin: {
        condition: (data) => (data as CustomUser).role === 'customer',
      },
      fields: [
        {
          name: 'type',

          type: 'select',

          options: ['billing', 'shipping'],

          required: true,
        },

        {
          name: 'street',

          type: 'text',

          required: true,
        },

        {
          name: 'city',

          type: 'text',

          required: true,
        },

        {
          name: 'state',

          type: 'text',

          required: true,
        },

        {
          name: 'country',

          type: 'text',

          required: true,
        },

        {
          name: 'postalCode',

          type: 'text',

          required: true,
        },

        {
          name: 'isDefault',

          type: 'checkbox',

          defaultValue: false,
        },
      ],
    },
    {
      name: 'cart',
      type: 'array',
      admin: {
        condition: (data) => (data as CustomUser).role === 'customer',
      },
      access: {
        read: ({ req: { user }, doc }) => {
          const currentUser = user as CustomUser | undefined

          // Use the asserted user object for both checks
          return currentUser?.id === doc?.id || currentUser?.role === 'admin'
        },
      },
      fields: [
        {
          name: 'product',

          type: 'relationship',

          relationTo: 'products',

          required: true,
        },

        {
          name: 'quantity',

          type: 'number',

          required: true,

          min: 1,
        },

        {
          name: 'addedAt',

          type: 'date',

          defaultValue: () => new Date(),
        },
      ],
    },
    {
      name: 'wishlist',
      type: 'array',
      admin: {
        condition: (data) => (data as CustomUser).role === 'customer',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
      ],
    },
    {
      name: 'orderHistory',
      type: 'array',
      admin: {
        condition: (data) => (data as CustomUser).role === 'customer',
        readOnly: true,
        description: 'Order history is automatically managed by the system',
      },
      fields: [
        {
          name: 'order',
          type: 'relationship',
          relationTo: 'orders',
          required: true,
        },
      ],
    },
  ],
  timestamps: true,
}
