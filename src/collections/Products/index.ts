// collections/Products.ts
import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    read: () => true,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'status', 'inventory.stock'],
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
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 200,
      admin: {
        description: 'Brief description for product cards and listings',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Full product description with formatting',
      },
    },
    {
      name: 'features',
      type: 'array',
      admin: {
        description: 'Key product features/highlights',
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
    },
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
      admin: {
        description: 'If set, this will override the regular price',
      },
    },
    {
      name: 'images',
      type: 'array',
      maxRows: 10,
      required: false, // Made optional to allow seeding without images
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
        {
          name: 'isFeature',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Use as main product image',
          },
        },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      admin: {
        description: 'Additional product images for gallery',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      index: true,
      required: true,
    },
    {
      name: 'brand',
      type: 'text',
      index: true,
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Out of Stock', value: 'out-of-stock' },
      ],
      defaultValue: 'draft',
      required: true,
      index: true,
    },
    {
      name: 'inventory',
      type: 'group',
      fields: [
        {
          name: 'stock',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'lowStockThreshold',
          type: 'number',
          defaultValue: 10,
          min: 0,
        },
        {
          name: 'sku',
          type: 'text',
          unique: true,
          index: true,
          required: true,
        },
        {
          name: 'trackInventory',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'weight',
          type: 'number',
          admin: {
            description: 'Weight in kg for shipping calculations',
          },
        },
        {
          name: 'dimensions',
          type: 'group',
          fields: [
            { name: 'length', type: 'number' },
            { name: 'width', type: 'number' },
            { name: 'height', type: 'number' },
          ],
        },
      ],
    },

    {
      name: 'specifications',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'group',
          type: 'text',
          admin: {
            description: 'Group specifications together (e.g., "Dimensions", "Technical")',
          },
        },
      ],
    },
    {
      name: 'rating',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Calculated from reviews',
      },
      fields: [
        {
          name: 'average',
          type: 'number',
          min: 0,
          max: 5,
          defaultValue: 0,
        },
        {
          name: 'count',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'breakdown',
          type: 'group',
          fields: [
            { name: 'fiveStars', type: 'number', defaultValue: 0 },
            { name: 'fourStars', type: 'number', defaultValue: 0 },
            { name: 'threeStars', type: 'number', defaultValue: 0 },
            { name: 'twoStars', type: 'number', defaultValue: 0 },
            { name: 'oneStar', type: 'number', defaultValue: 0 },
          ],
        },
      ],
    },
    {
      name: 'promotions',
      type: 'relationship',
      relationTo: 'promotions',
      hasMany: true,
      admin: {
        description: 'Active promotions that apply to this product',
      },
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        description: 'Products to suggest on the product page',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          maxLength: 160,
        },
        {
          name: 'keywords',
          type: 'text',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }

        if (data.inventory?.stock === 0) {
          data.status = 'out-of-stock'
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // Update category product counts after product changes
        const updateCategoryCount = async (categoryId: string) => {
          if (!categoryId) return

          try {
            const products = await req.payload.find({
              collection: 'products',
              depth: 0,
              where: {
                categories: {
                  equals: categoryId,
                },
              },
              limit: 1, // Only need totalDocs
            })

            await req.payload.update({
              collection: 'categories',
              id: categoryId,
              data: {
                productsCount: products.totalDocs,
              } as any,
            })
          } catch (error) {
            req.payload.logger.error({
              msg: `Error updating product count for category ${categoryId}`,
              error,
            })
          }
        }

        // Get current and previous category IDs
        const currentCategories = Array.isArray(doc.categories)
          ? doc.categories.map((cat: string | { id: string }) =>
              typeof cat === 'string' ? cat : cat.id,
            )
          : []

        const previousCategories = previousDoc?.categories
          ? Array.isArray(previousDoc.categories)
            ? previousDoc.categories.map((cat: string | { id: string }) =>
                typeof cat === 'string' ? cat : cat.id,
              )
            : []
          : []

        // Update counts for all affected categories
        const allCategories = [...new Set([...currentCategories, ...previousCategories])]

        for (const categoryId of allCategories) {
          await updateCategoryCount(categoryId)
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        // Update category product counts after product deletion
        const updateCategoryCount = async (categoryId: string) => {
          if (!categoryId) return

          try {
            const products = await req.payload.find({
              collection: 'products',
              depth: 0,
              where: {
                categories: {
                  equals: categoryId,
                },
              },
              limit: 1, // Only need totalDocs
            })

            await req.payload.update({
              collection: 'categories',
              id: categoryId,
              data: {
                productsCount: products.totalDocs,
              } as unknown,
            })
          } catch (error) {
            req.payload.logger.error({
              msg: `Error updating product count for category ${categoryId}`,
              error,
            })
          }
        }

        // Get categories from deleted product
        const deletedCategories = Array.isArray(doc.categories)
          ? doc.categories.map((cat: string | { id: string }) =>
              typeof cat === 'string' ? cat : cat.id,
            )
          : []

        // Update counts for all categories that were associated with the deleted product
        for (const categoryId of deletedCategories) {
          await updateCategoryCount(categoryId)
        }
      },
    ],
  },
  timestamps: true,
}
