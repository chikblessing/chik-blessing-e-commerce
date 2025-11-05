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
      const customUser = user as CustomUser | undefined
      return !!customUser && (customUser.role === 'admin' || customUser.role === 'super_admin')
    },
    create: () => true,
    delete: authenticated,
    read: ({ req: { user } }: UserAccessArgs) => {
      const customUser = user as CustomUser | undefined

      // Allow both admin and super_admin to read all users
      if (customUser?.role === 'admin' || customUser?.role === 'super_admin') return true
      return {
        id: {
          equals: customUser?.id,
        },
      }
    },
    update: ({ req: { user } }: UserAccessArgs) => {
      const customUser = user as CustomUser | undefined

      // Allow both admin and super_admin to update all users
      if (customUser?.role === 'admin' || customUser?.role === 'super_admin') return true
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
    },
    {
      name: 'lastName',
      type: 'text',
      required: false,
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
        { label: 'Super Admin', value: 'super_admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
      ],
      defaultValue: 'customer',
      required: true,
      admin: {
        description:
          'Super Admin: Full access including order deletion. Admin: Standard admin access. Customer: Regular user.',
      },
      access: {
        update: ({ req: { user } }) => {
          const customUser = user as CustomUser | undefined
          // Only super admins can change roles to prevent privilege escalation
          return customUser?.role === 'super_admin'
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

          // Allow user to read their own cart, or admins/super_admins to read any cart
          return (
            currentUser?.id === doc?.id ||
            currentUser?.role === 'admin' ||
            currentUser?.role === 'super_admin'
          )
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
        description:
          'Order history is automatically managed by the system. Deleted orders will show as unavailable.',
      },
      fields: [
        {
          name: 'order',
          type: 'relationship',
          relationTo: 'orders',
          required: false, // Allow null if order is deleted
          hasMany: false,
        },
      ],
    },
    {
      name: 'suspended',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Suspend this user account to prevent login',
        position: 'sidebar',
      },
      access: {
        update: ({ req: { user } }) => {
          // Only admins and super_admins can suspend/unsuspend users
          const customUser = user as CustomUser | undefined
          return Boolean(
            customUser && (customUser.role === 'admin' || customUser.role === 'super_admin'),
          )
        },
      },
    },
    {
      name: 'verificationOTP',
      type: 'text',
      admin: {
        hidden: true, // Hide from admin UI
      },
    },
    {
      name: 'otpExpiry',
      type: 'date',
      admin: {
        hidden: true, // Hide from admin UI
      },
    },
  ],
  timestamps: true,
}
