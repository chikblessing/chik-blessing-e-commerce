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
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const response = await fetch(
      `${baseUrl}/api/search/categories?where[slug][equals]=${slug}&where[isActive][equals]=true`,
      {
        next: { revalidate: 60 },
      },
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.docs?.[0] || null
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
