import React from 'react'



export default async function Page() {


  return (
    <><div>product</div></>
  )}
// import React, { cache } from 'react'
// import type { Metadata } from 'next'
// import { draftMode } from 'next/headers'
// import { getPayload } from 'payload'
// import configPromise from '@payload-config'
// import Image from 'next/image'
// import { useCart } from '@/providers/Cart'

// type Args = { params: Promise<{ slug: string }> }

// const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
//   const { isEnabled: draft } = await draftMode()
//   const payload = await getPayload({ config: configPromise })

//   const result = await payload.find({
//     collection: 'products',
//     draft,
//     limit: 1,
//     pagination: false,
//     overrideAccess: draft,
//     where: { slug: { equals: slug } },
//   })

//   return result.docs?.[0] || null
// })

// export default async function Page({ params: paramsPromise }: Args) {
//   const params = await paramsPromise
//   const product = await queryProductBySlug({ slug: params.slug })

//   if (!product) return null

//   const price = (product as any).salePrice ?? (product as any).price ?? 0
//   const images = (product as any).images as any[] | undefined

//   return (
//     <div className="pt-24 pb-24">
//       <div className="container grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="grid grid-cols-3 gap-2 order-2 md:order-1">
//           {images?.map((img: any) => (
//             <div key={img?.id} className="relative aspect-square bg-muted rounded">
//               {img?.url ? (
//                 <Image
//                   src={img.url}
//                   alt={img.alt || ''}
//                   fill
//                   sizes="(max-width: 768px) 100vw, 50vw"
//                 />
//               ) : null}
//             </div>
//           ))}
//         </div>
//         <AddToCartClient product={product as any} />
//       </div>
//     </div>
//   )
// }

// const AddToCartClient: React.FC<{ product: any }> = ({ product }) => {
//   'use client'
//   const { addItem } = useCart()
//   const price = product.salePrice ?? product.price ?? 0
//   return (
//     <div className="order-1 md:order-2">
//       <h1 className="text-2xl font-semibold">{(product as any).title}</h1>
//       <div className="mt-2 text-primary text-xl font-bold">₦{price.toLocaleString()}</div>
//       <p className="mt-4 text-muted-foreground">{(product as any).description}</p>

//       <div className="mt-6 flex gap-3">
//         <button
//           onClick={() =>
//             addItem(
//               {
//                 id: product.id,
//                 title: product.title || '',
//                 price,
//                 slug: product.slug || undefined,
//               },
//               1,
//             )
//           }
//           className="inline-flex items-center justify-center rounded-md border bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50"
//         >
//           Add to cart
//         </button>
//         <button className="rounded-md border px-4 py-2 text-sm">❤ Bookmark</button>
//       </div>
//     </div>
//   )
// }

// export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
//   const params = await paramsPromise
//   const product = await queryProductBySlug({ slug: params.slug })
//   return { title: (product as any)?.title || 'Product' }
// }
