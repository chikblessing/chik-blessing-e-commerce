import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CategoryClient from './page.client'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

async function getCategory(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/search/categories?where[slug][equals]=${slug}&where[isActive][equals]=true`,
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
  const category = await getCategory(params.slug)

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
  const category = await getCategory(params.slug)

  if (!category) {
    notFound()
  }

  return <CategoryClient category={category} />
}
