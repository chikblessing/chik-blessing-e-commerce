import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { generateMeta } from '@/utilities/generateMeta'
import HeroSection from '@/components/pageComponents/HeroSection'
import BannerSlider from '@/components/pageComponents/BannerSlider'
import FeaturedProducts from '@/components/pageComponents/FeaturedProducts/FeaturedProducts'
import CounterSection from '@/components/pageComponents/Counter/CounterSection'
import TopSellingProducts from '@/components/pageComponents/TopSellingProduct/TopSellingProducts'
import { FaqSection } from '@/components/pageComponents/Faq/FaqSection'
import ProductSection from '@/components/pageComponents/ProductSection/ProductSection'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  return (
    <>
      <div className="pb-[50px] bg-[#F8F6F6]">
        <HeroSection />
        <BannerSlider />
        <FeaturedProducts />
        <CounterSection />
        <TopSellingProducts />

        {/* New Arrivals - Recently added products */}
        <ProductSection
          title="New Arrivals"
          apiEndpoint="/api/search/products?limit=4&sort=-createdAt"
          viewAllLink="/featured-products?sort=new"
        />

        {/* On Sale - Products with sale prices */}
        <ProductSection
          title="Special Deals"
          apiEndpoint="/api/products/on-sale?limit=4"
          viewAllLink="/featured-products?sort=sale"
        />

        {/* Best Rated - Highest rated products */}
        <ProductSection
          title="Customer Favorites"
          apiEndpoint="/api/search/products?limit=4&sort=-rating.average&minRating=4"
          viewAllLink="/featured-products?sort=rating"
        />

        {/* In Stock - Available products */}
        <ProductSection
          title="Ready to Ship"
          apiEndpoint="/api/search/products?limit=4&inStock=true&sort=-createdAt"
          viewAllLink="/featured-products?inStock=true"
        />

        <FaqSection />
      </div>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
