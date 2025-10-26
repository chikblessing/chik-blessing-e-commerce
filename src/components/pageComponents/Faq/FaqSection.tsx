'use client'
import React, { useState } from 'react'


const questions = [
  {
    title: 'Can I return a product if I change my mind after purchase ?',
    content:
      'No, due to the nature of FMCG products, returns are not allowed unless the item is damaged or defective on arrival.',
  },
  {
    title: ' What should I do if my order arrives damaged ?',
    content: `Please contact our customer service within one hour of delivery with a photo/video of the damaged item. We'll review and issue a refund or replacement.`,
  },
  {
    title: 'Do you offer refunds instead of exchanges?',
    content: `No refunds, we only issue replacements for damaged/defective products.`,
  },
  {
    title: ' I received the wrong item. What should I do?',
    content: `Contact customer service with your order number and a photo of the wrong item. We'll arrange a replacement.`,
  },
  {
    title: `My order was cancelled, but I was charged. Will I get my money back?`,
    content: `Yes, cancelled orders are automatically refunded within 3 days.`,
  },
  {
    title: ` Can I modify or cancel my order after placing it?`,
    content: `Orders can only be modified or cancelled within an hour after placement, as we process quickly to ensure fast delivery.`,
  },
  {
    title: `How long will it take to receive my order?`,
    content: `Delivery timelines depend on your location. Standard delivery takes 2-5 working days.`,
  },
  {
    title: ' Do you offer same-day or next-day delivery?',
    content: `Yes, in select locations. Availability will show at checkout.`,
  },
  {
    title: `What if my order is delayed?`,
    content: `You will be notified by SMS/email. If the delay exceeds 5 days, you may contact support for assistance.`,
  },
  {
    title: 'Can I track my order?',
    content: `Yes, a fully paid-up subscriber is permitted to resell with Page Mansion's management approval. The buyer's details must be submitted for proper documentation.
`,
  },
  {
    title: 'Are all products listed on the website available in stock?',
    content: `Yes, only in-stock items are displayed. If a product is out of stock, it will be marked accordingly.`,
  },
  {
    title: `How do I know if a product is fresh and safe?`,
    content: `We work directly with trusted suppliers and ensure all products meet quality and safety standards. Expiry dates are always checked before dispatch.
`,
  },
  {
    title: `Can I pre-order or request an item that is out of stock?`,
    content: `Currently, pre-orders are not supported. You may click “Notify Me” to get an alert when the product is restocked.`,
  },
  {
    title: `Do you sell in bulk/wholesale quantities?`,
    content: `Yes, selected products are available for bulk orders. Please contact customer support for details.`,
  },
  {
    title: `What should I do if I notice an issue with a product (e.g., wrong details, expired date, incorrect description)?`,
    content: `If you spot any issue with a product, please use the “Report a Product” form available on the product page. This helps us quickly review and correct the information, or remove the product if necessary. Our team will investigate and update you once it is resolved.`,
  },
]

export const FaqSection = () => {
  const [showItems, setShowItems] = useState<boolean[]>(() => Array(questions.length).fill(false))

  const toggleShowItem = (index: number) => {
    setShowItems((prev) => prev.map((item, i) => (i === index ? !item : item)))
  }

  return (
    <>
      <div className="mb-20">


  <div className="py-11 max-w-4xl mx-auto bg-[#F4F4F4] rounded-xl px-6">
          <h2 className="text-3xl text-center font-bold py-8">Frequently Asked Questions</h2>

          {questions.map((question, index) => (
            <div
              key={index}
              className="w-full  bg-white border border-[#084710] rounded-3xl shadow-2xl  my-4"
            >
              <div className="w-full py-1 px-4">
                <div className="flex gap-2 items-center justify-between">
                  <p className="text-lg font-semibold">{question.title}</p>
                  <div className="my-4 pr-6">
                    <button onClick={() => toggleShowItem(index)}>
                      {showItems[index] ?  (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="32"
                          height="32"
                          fill="currentColor"
                        >
                          <path d="M5 11V13H19V11H5Z"></path>
                        </svg>
                      ):(
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="32"
                          height="32"
                          fill="currentColor"
                        >
                          <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                        </svg>
                      ) }
                    </button>
                  </div>
                </div>
                {showItems[index] && (
                  <>
                    <div className="bg-[#F4F4F4] p-3 rounded-xl">
                      <p className="text-black">{question.content}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
