
'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function AdminToolsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const seedSampleData = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/seed-sample-data', {
        method: 'POST',
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Failed to seed data', details: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testCategoryAPI = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/search/categories?where[isActive][equals]=true')
      const data = await response.json()
      setResult({ categories: data })
    } catch (error) {
      setResult({ error: 'Failed to fetch categories', details: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testProductsAPI = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/search/products?limit=10')
      const data = await response.json()
      setResult({ products: data })
    } catch (error) {
      setResult({ error: 'Failed to fetch products', details: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Tools</h1>

      <div className="space-y-4 mb-8">
        <button
          onClick={seedSampleData}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Seeding...' : 'Seed Sample Data'}
        </button>

        <button
          onClick={testCategoryAPI}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 ml-4"
        >
          {loading ? 'Testing...' : 'Test Categories API'}
        </button>

        <button
          onClick={testProductsAPI}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 ml-4"
        >
          {loading ? 'Testing...' : 'Test Products API'}
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Result:</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Links:</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/category/cocoa" className="text-blue-600 hover:underline">
              Test Cocoa Category Page
            </Link>
          </li>
          <li>
            <Link href="/category/coffee" className="text-blue-600 hover:underline">
              Test Coffee Category Page
            </Link>
          </li>
          <li>
            <Link href="/admin" className="text-blue-600 hover:underline">
              Payload Admin Panel
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
