import type { Metadata } from 'next'
import Link from 'next/link'
import { FaqSection } from '@/components/pageComponents/Faq/FaqSection'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Chik Blessing Global Store',
  description:
    'Find answers to common questions about orders, returns, delivery, and product information.',
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto mt-[100px] px-4">
        {/* Page Header */}
        <div className="text-center mb-8">
          {/* <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1> */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We&apos;ve got answers. Browse through our most commonly asked questions
            below.
          </p>
        </div>

        {/* FAQ Section Component */}
        <FaqSection />

        {/* Additional Help Section */}
        <div className="mt-12 text-center bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Can&apos;t find the answer you&apos;re looking for? Our customer support team is here to
            help.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-[#084710] text-white rounded-lg hover:bg-black transition-colors font-medium"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
