'use client'

import React from 'react'

export default function TermsClient() {
  const sections = [
    {
      number: 1,
      title: 'Introduction',
      content: (
        <>
          <p className="mb-3">
            Welcome to Chik Blessing Global Limited ("we", "our", "us"). These Terms & Conditions
            govern your use of our website and the purchase of fast-moving consumer goods (FMCG)
            from us. By using our Platform or placing an order, you agree to comply with these
            Terms and all applicable Nigerian laws.
          </p>
        </>
      ),
    },
    {
      number: 2,
      title: 'Regulatory Compliance',
      content: (
        <>
          <p className="mb-3">
            We are duly registered with the Corporate Affairs Commission (CAC) under Nigerian law.
            All consumable goods are sourced, packaged, and sold in compliance with the Standards
            Organisation of Nigeria (SON) and the National Agency for Food and Drug Administration
            and Control (NAFDAC).
          </p>
          <p>
            We comply with the Federal Competition and Consumer Protection Act (FCCPA), which
            guarantees your consumer rights.
          </p>
        </>
      ),
    },
    {
      number: 3,
      title: 'Eligibility & Account',
      content: (
        <>
          <p className="mb-3">
            You must be at least 18 years old to use our Platform or place an order.
          </p>
          <p className="mb-3">
            You may be required to create an account with accurate and up-to-date details.
          </p>
          <p>
            You are responsible for safeguarding your login credentials and for all activities under
            your account.
          </p>
        </>
      ),
    },
    {
      number: 4,
      title: 'Products & Orders',
      content: (
        <>
          <p className="mb-3">
            We supply FMCG products such as groceries & food, beverages, toiletries, cleaning
            supplies, beauty and personal care items.
          </p>
          <p className="mb-3">
            By placing an order, you make an offer to purchase. A contract is formed when your order
            is confirmed and payment is processed.
          </p>
          <p className="mb-3">
            All prices are displayed in Nigerian Naira (₦) and are subject to applicable taxes.
          </p>
          <p>
            Prices and availability may change, but confirmed orders will not be affected.
          </p>
        </>
      ),
    },
    {
      number: 5,
      title: 'Payment',
      content: (
        <>
          <p className="mb-3">
            We accept payment via PayStack or bank transfers (where available).
          </p>
          <p className="mb-3">
            Payments are processed through secure payment gateways in compliance with the Central
            Bank of Nigeria (CBN) guidelines.
          </p>
          <p>
            For fraud prevention, transactions may be subject to verification before confirmation.
          </p>
        </>
      ),
    },
    {
      number: 6,
      title: 'Delivery & Risk',
      content: (
        <>
          <p className="mb-3">
            Delivery is available within Nigeria to the address you provide at checkout.
          </p>
          <p className="mb-3">
            Estimated delivery times are displayed but may vary due to logistics or external
            factors.
          </p>
          <p className="mb-3">
            Risk of loss passes to you once the order has been delivered and signed for.
          </p>
          <p>
            You are encouraged to inspect goods immediately upon delivery and report any issues to
            us.
          </p>
        </>
      ),
    },
    {
      number: 7,
      title: 'Returns, Refunds & Cancellations',
      content: (
        <>
          <p className="mb-3">
            For hygiene, health, and safety reasons, all FMCG consumables are non-returnable,
            except in cases of defects, expiration, or incorrect supply.
          </p>
          <p className="mb-3">If eligible, returns must be requested within 7 days of delivery.</p>
          <p className="mb-3">
            Refunds of payment for products for any other reason shall be subject to Chik Blessings
            Global Limited's terms and conditions of sale.
          </p>
          <p className="mb-3">
            Refunds will be processed within 7–14 business days via your original payment method or
            another agreed-upon option.
          </p>
          <p>
            Orders may be cancelled before dispatch; after dispatch, cancellation may attract a
            delivery or restocking fee.
          </p>
        </>
      ),
    },
    {
      number: 8,
      title: 'Product Information',
      content: (
        <>
          <p className="mb-3">
            We take care to ensure all descriptions, expiry dates, weights, ingredients, and images
            are accurate and compliant with NAFDAC labeling requirements.
          </p>
          <p>
            Minor variations (e.g. packaging updates) may occur without affecting product quality.
          </p>
        </>
      ),
    },
    {
      number: 9,
      title: 'Intellectual Property',
      content: (
        <>
          <p className="mb-3">
            All trademarks, logos, images, software, and content on our Platform are our property
            and protected under Nigerian intellectual property law.
          </p>
          <p>You may not copy, reuse, or distribute our content without written consent.</p>
        </>
      ),
    },
    {
      number: 10,
      title: 'Liability & Consumer Protection',
      content: (
        <>
          <p className="mb-3">
            Our maximum liability in respect of any product shall not exceed the price paid for that
            product.
          </p>
          <p className="mb-3">
            We are not liable for indirect or consequential damages (loss of income, missed
            opportunities, etc.).
          </p>
          <p>
            Nothing in these Terms affects your statutory rights under the Federal Competition and
            Consumer Protection Act (FCCPA).
          </p>
        </>
      ),
    },
    {
      number: 11,
      title: 'Privacy & Data Protection',
      content: (
        <>
          <p className="mb-3">
            We collect and process your personal information in line with the Nigeria Data
            Protection Act 2023 (NDPA).
          </p>
          <p className="mb-3">
            Your information will only be used for order fulfillment, customer service, and
            marketing (where you consent).
          </p>
          <p>
            We take reasonable steps to protect your data but cannot guarantee absolute security.
          </p>
        </>
      ),
    },
    {
      number: 12,
      title: 'Amendments',
      content: (
        <>
          <p className="mb-3">
            We may amend these Terms from time to time to comply with Nigerian laws and business
            practices.
          </p>
          <p>
            Updated Terms will be posted on our Platform, and continued use implies acceptance.
          </p>
        </>
      ),
    },
    {
      number: 13,
      title: 'Governing Law & Dispute Resolution',
      content: (
        <>
          <p className="mb-3">
            These Terms shall be governed by the laws of the Federal Republic of Nigeria.
          </p>
          <p className="mb-3">
            Disputes shall first be addressed through our customer service team.
          </p>
          <p>
            If unresolved, disputes may be referred to mediation/arbitration or the courts of
            Nigeria.
          </p>
        </>
      ),
    },
  ]

  return (
    <div className="bg-[#F8F6F6] min-h-screen">
      <div className="container mx-auto px-4 pt-[120px] pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            General Terms and Conditions of Use for E-commerce for Buyers and Chik Blessing Global
            Limited
          </p>
        </div>

        {/* Terms Sections */}
        <div className="max-w-4xl mx-auto space-y-6">
          {sections.map((section) => (
            <div
              key={section.number}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8"
            >
              <div className="flex gap-4 items-start">
                {/* Number Badge */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#084710] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg md:text-xl">
                      {section.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <div className="text-gray-700 leading-relaxed">{section.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Last updated: {new Date().toLocaleDateString('en-NG', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-sm text-gray-600 text-center mt-2">
            If you have any questions about these Terms and Conditions, please contact our customer
            service team.
          </p>
        </div>
      </div>
    </div>
  )
}
