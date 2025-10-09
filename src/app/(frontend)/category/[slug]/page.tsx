import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CategoryClient from './page.client'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getCategory(slug: string) {
  try {
    // Use Payload directly on the server side instead of HTTP fetch
    const { getPayload } = await import('payload')
    const config = await import('../../../../payload.config')

    const payload = await getPayload({ config: config.default })

    const result = await payload.find({
      collection: 'categories',
      where: {
        slug: { equals: slug },
        isActive: { equals: true },
      },
      limit: 1,
      depth: 2,
    })

    return result.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.title} - Shop Now`,
    description: category.description || `Browse our ${category.title} collection`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  return <CategoryClient category={category} />
}
