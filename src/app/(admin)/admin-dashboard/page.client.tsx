'use client'

import React from 'react'
import Link from 'next/link'

interface DashboardData {
  overview: {
    totalOrders: number
    ordersThisMonth: number
    ordersThisWeek: number
    totalRevenue: number
    revenueThisMonth: number
    revenueThisWeek: number
    totalProducts: number
    lowStockProducts: number
    outOfStockProducts: number
    totalUsers: number
    newUsersThisMonth: number
    totalReviews: number
    pendingReports: number
  }
  ordersByStatus: {
    pending: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
  }
  ordersByPayment: {
    pending: number
    paid: number
    failed: number
    refunded: number
  }
  recentOrders: any[]
  lowStockProducts: any[]
  pendingReportsList: any[]
}

export default function DashboardClient({ data }: { data: DashboardData }) {
  const {
    overview,
    ordersByStatus,
    ordersByPayment,
    recentOrders,
    lowStockProducts,
    pendingReportsList,
  } = data

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Overview of your store performance</p>
          <Link
            href="/admin"
            className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-800"
          >
            ← Back to Admin Panel
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue (30d)</h3>
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(overview.revenueThisMonth)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              This week: {formatCurrency(overview.revenueThisWeek)}
            </p>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Orders (30d)</h3>
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{overview.ordersThisMonth}</p>
            <p className="text-sm text-gray-500 mt-1">This week: {overview.ordersThisWeek}</p>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Products</h3>
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{overview.totalProducts}</p>
            <p className="text-sm text-red-500 mt-1">{overview.outOfStockProducts} out of stock</p>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Customers</h3>
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{overview.totalUsers}</p>
            <p className="text-sm text-gray-500 mt-1">+{overview.newUsersThisMonth} this month</p>
          </div>
        </div>

        {/* Alerts */}
        {(overview.lowStockProducts > 0 || overview.pendingReports > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {overview.lowStockProducts > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-orange-900">Low Stock Alert</h3>
                </div>
                <p className="text-orange-800 mb-3">
                  {overview.lowStockProducts} products are running low on stock
                </p>
                <Link
                  href="/admin/collections/products"
                  className="text-orange-600 hover:text-orange-800 font-medium text-sm"
                >
                  View Products →
                </Link>
              </div>
            )}

            {overview.pendingReports > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-red-900">Pending Reports</h3>
                </div>
                <p className="text-red-800 mb-3">
                  {overview.pendingReports} product reports need review
                </p>
                <Link
                  href="/admin/collections/product-reports"
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Review Reports →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Orders by Status (30 days)</h3>
            <div className="space-y-3">
              {Object.entries(ordersByStatus).map(([status, count]) => {
                const total = Object.values(ordersByStatus).reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? (count / total) * 100 : 0
                const colors: Record<string, string> = {
                  pending: 'bg-yellow-500',
                  processing: 'bg-blue-500',
                  shipped: 'bg-purple-500',
                  delivered: 'bg-green-500',
                  cancelled: 'bg-red-500',
                }
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{status}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${colors[status]} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Status (30 days)</h3>
            <div className="space-y-3">
              {Object.entries(ordersByPayment).map(([status, count]) => {
                const total = Object.values(ordersByPayment).reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? (count / total) * 100 : 0
                const colors: Record<string, string> = {
                  pending: 'bg-yellow-500',
                  paid: 'bg-green-500',
                  failed: 'bg-red-500',
                  refunded: 'bg-gray-500',
                }
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{status}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${colors[status]} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <Link
                href="/admin/collections/orders"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.shippingAddress?.name || order.guestEmail || 'Guest'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Products */}
        {lowStockProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Low Stock Products</h3>
                <Link
                  href="/admin/collections/products"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lowStockProducts.map((product: any) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {product.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.inventory?.sku || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.inventory?.stock === 0
                              ? 'bg-red-100 text-red-800'
                              : product.inventory?.stock <= 5
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {product.inventory?.stock || 0} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                        {product.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
