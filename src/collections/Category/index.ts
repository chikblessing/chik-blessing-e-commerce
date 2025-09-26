// collections/Categories.ts
import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

// Assuming you have a Category type, if not, use 'any' or define it.
// For this context, we use 'any' for the getter to compile cleanly.

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    read: () => true, // Public read access
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'productsCount'],
    group: 'E-commerce',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly version of the name',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Leave empty for top-level category',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: "Inactive categories won't appear in filters",
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Categories with lower numbers appear first',
      },
    },
    {
      name: 'productsCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Number of products in this category (automatically updated)',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Automation for slug generation
        if (!data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
  timestamps: true,
}
