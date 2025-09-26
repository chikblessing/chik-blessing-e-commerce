const DummyComponent: React.FC = () => {
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h2 className="text-xl font-bold mb-2">Dummy Component</h2>
      <p className="text-gray-700">This is a placeholder component for demonstration purposes.</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Click me
      </button>
    </div>
  )
}

export default DummyComponent
// 'use client'
// import { cn } from '@/utilities/ui'
// import useClickableCard from '@/utilities/useClickableCard'
// import Link from 'next/link'
// import React, { Fragment } from 'react'

// import type { Post } from '@/payload-types'

// import { Media } from '@/components/Media'

// export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

// export const Card: React.FC<{
//   alignItems?: 'center'
//   className?: string
//   doc?: CardPostData
//   relationTo?: 'posts'
//   showCategories?: boolean
//   title?: string
// }> = (props) => {
//   const { card, link } = useClickableCard({})
//   const { className, doc, relationTo, showCategories, title: titleFromProps } = props

//   const { slug, categories, meta, title } = doc || {}
//   const { description, image: metaImage } = meta || {}

//   const hasCategories = categories && Array.isArray(categories) && categories.length > 0
//   const titleToUse = titleFromProps || title
//   const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
//   const href = `/${relationTo}/${slug}`

//   return (
//     <article
//       className={cn(
//         'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
//         className,
//       )}
//       ref={card.ref}
//     >
//       <div className="relative w-full ">
//         {!metaImage && <div className="">No image</div>}
//         {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />}
//       </div>
//       <div className="p-4">
//         {showCategories && hasCategories && (
//           <div className="uppercase text-sm mb-4">
//             {showCategories && hasCategories && (
//               <div>
//                 {categories?.map((category, index) => {
//                   if (typeof category === 'object') {
//                     const { title: titleFromCategory } = category

//                     const categoryTitle = titleFromCategory || 'Untitled category'

//                     const isLast = index === categories.length - 1

//                     return (
//                       <Fragment key={index}>
//                         {categoryTitle}
//                         {!isLast && <Fragment>, &nbsp;</Fragment>}
//                       </Fragment>
//                     )
//                   }

//                   return null
//                 })}
//               </div>
//             )}
//           </div>
//         )}
//         {titleToUse && (
//           <div className="prose">
//             <h3>
//               <Link className="not-prose" href={href} ref={link.ref}>
//                 {titleToUse}
//               </Link>
//             </h3>
//           </div>
//         )}
//         {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
//       </div>
//     </article>
//   )
// }
