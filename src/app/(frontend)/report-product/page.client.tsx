'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
]

const REPORT_REASONS = [
  {
    label: 'Product description appears to be wrong or misleading information',
    value: 'misleading',
  },
  {
    label: 'Product description contains inappropriate content',
    value: 'inappropriate',
  },
  {
    label: 'Product appears to be counterfeit',
    value: 'counterfeit',
  },
  {
    label: 'Product may be prohibited or banned by law',
    value: 'prohibited',
  },
]

export default function ReportProductClient() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    state: '',
    requesterType: '',
    reason: '',
    additionalDetails: '',
    email: '',
    phone: '',
    companyName: '',
    productLink: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    // Validation
    if (
      !formData.name ||
      !formData.state ||
      !formData.requesterType ||
      !formData.reason ||
      !formData.email ||
      !formData.phone ||
      !formData.productLink
    ) {
      const errorMsg = 'Please fill in all required fields'
      setError(errorMsg)
      toast.error(errorMsg)
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      const errorMsg = 'Please enter a valid email address'
      setError(errorMsg)
      toast.error(errorMsg)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/report-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report')
      }

      setSuccess(true)
      toast.success('Report submitted successfully! Thank you for your feedback.')
      setFormData({
        name: '',
        state: '',
        requesterType: '',
        reason: '',
        additionalDetails: '',
        email: '',
        phone: '',
        companyName: '',
        productLink: '',
      })

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to submit report'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 pt-[150px] pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Report Submitted Successfully
            </h2>
            <p className="text-green-700 mb-4">
              Thank you for reporting this product. We will review your report and take appropriate
              action.
            </p>
            <p className="text-sm text-green-600">Redirecting to homepage...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-[150px] pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report a Product</h1>
          <p className="text-gray-600">
            Help us maintain quality by reporting products that violate our policies or contain
            incorrect information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="First & Last name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
              />
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
              >
                <option value="">Select a state</option>
                {NIGERIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Requester Type */}
            <div>
              <label
                htmlFor="requesterType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Requester Type <span className="text-red-500">*</span>
              </label>
              <select
                id="requesterType"
                name="requesterType"
                value={formData.requesterType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
              >
                <option value="">Select requester type</option>
                <option value="individual">Individual</option>
                <option value="organization">Organization</option>
              </select>
            </div>

            {/* Reason for Reporting */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Reporting <span className="text-red-500">*</span>
              </label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
              >
                <option value="">Select a reason</option>
                {REPORT_REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Details */}
            <div>
              <label
                htmlFor="additionalDetails"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Additional Details
              </label>
              <textarea
                id="additionalDetails"
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleChange}
                rows={4}
                placeholder="Please provide any additional information that would help us understand your report..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent resize-none"
              />
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+234 800 000 0000"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
              />
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name{' '}
                {formData.requesterType === 'organization' && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Your company name"
                required={formData.requesterType === 'organization'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
              />
            </div>

            {/* Product Link */}
            <div>
              <label htmlFor="productLink" className="block text-sm font-medium text-gray-700 mb-2">
                Product Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="productLink"
                name="productLink"
                value={formData.productLink}
                onChange={handleChange}
                placeholder="https://example.com/product/..."
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084710] focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                Paste the full URL of the product you want to report
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#084710] hover:bg-black'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
