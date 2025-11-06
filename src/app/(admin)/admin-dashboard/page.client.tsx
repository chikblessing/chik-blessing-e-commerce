'use client'

import React from 'react'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  status: string
  inventory?: {
    sku?: string
    stock?: number
  }
}

interface Order {
  id: string
  orderNumber: string
  shippingAddress?: {
    name?: string
  }
  guestEmail?: string | null
  createdAt: string
  status: string
  total: number
}

interface DashboardData {
  overview: {
    totalRevenue: number
    revenue: number
    revenueThisMonth: number
    revenueThisWeek: number
    totalOrders: number
    orders: number
    ordersThisMonth: number
    ordersThisWeek: number
    totalProducts: number
    lowStockProducts: number
    outOfStockProducts: number
    totalUsers: number
    newUsersThisMonth: number
    pendingReports?: number
  }
  ordersByStatus: Record<string, number>
  ordersByPayment: Record<string, number>
  recentOrders: Order[]
  lowStockProducts: Product[]
  pendingReportsLists?: unknown[]
}

export default function DashboardClient({ data }: { data: DashboardData }) {
  const { overview, ordersByStatus, recentOrders, lowStockProducts } = data

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Chik Store</h2>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin-dashboard"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </Link>

          <Link
            href="/admin/collections/products"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Products
          </Link>

          <Link
            href="/admin/collections/orders"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Orders
          </Link>

          <Link
            href="/admin/collections/users"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Customers
          </Link>

          <Link
            href="/admin/collections/reviews"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            Reviews
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Admin Panel
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Period: August 2023</p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(overview.revenueThisMonth)}
            change="+8.2%"
            positive={true}
          />
          <MetricCard
            title="Total Customer"
            value={overview.totalUsers.toString()}
            change="+1.3%"
            positive={false}
          />
          <MetricCard
            title="Total Profit"
            value={formatCurrency(overview.revenueThisMonth * 0.3)}
            change="+4.5%"
            positive={true}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="col-span-2 space-y-6">
            {/* Spending Statistics */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Spending Statistic</h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(overview.revenueThisWeek)}
                    </span>
                    <span className="text-sm text-green-600 font-medium">+8.2%</span>
                    <span className="text-xs text-gray-500">Total income in week</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded">
                    Day
                  </button>
                  <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded">
                    Week
                  </button>
                  <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded">
                    Year
                  </button>
                </div>
              </div>
              <BarChart data={ordersByStatus} />
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer Transaction</h3>
                <Link
                  href="/admin/collections/orders"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All →
                </Link>
              </div>
              <TransactionTable orders={recentOrders.slice(0, 5)} formatDate={formatDate} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer by Country */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer by Country</h3>
              <p className="text-xs text-gray-500 mb-4">Period: August 2023</p>
              <div className="space-y-4">
                <CountryItem country="Nigeria" value={overview.totalUsers} percentage={85} />
                <CountryItem
                  country="Ghana"
                  value={Math.floor(overview.totalUsers * 0.1)}
                  percentage={10}
                />
                <CountryItem
                  country="Others"
                  value={Math.floor(overview.totalUsers * 0.05)}
                  percentage={5}
                />
              </div>
            </div>

            {/* Social Source */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Social Source</h3>
                  <p className="text-xs text-gray-500">Total traffic in a week</p>
                </div>
              </div>
              <div className="space-y-4">
                <SocialItem platform="Website" visitors={2305} customers={3304} sales={443} />
                <SocialItem platform="Instagram" visitors={1205} customers={1504} sales={243} />
                <SocialItem platform="Facebook" visitors={905} customers={804} sales={143} />
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                See more statistic
              </button>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Low Stock Products</h3>
              <Link
                href="/admin/collections/products"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Manage Stock →
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {lowStockProducts.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/collections/products/${product.id}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <p className="font-medium text-gray-900 text-sm mb-2 truncate">{product.title}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    SKU: {product.inventory?.sku || 'N/A'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${
                        product.inventory?.stock === 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {product.inventory?.stock || 0} left
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  positive,
}: {
  title: string
  value: string
  change: string
  positive: boolean
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <span className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
    </div>
  )
}

function BarChart({ data }: { data: Record<string, number> }) {
  const maxValue = Math.max(...Object.values(data))
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="flex items-end justify-between gap-4 h-48">
      {days.map((day, index) => {
        const value = Object.values(data)[index] || 0
        const height = (value / maxValue) * 100
        return (
          <div key={day} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-end justify-center h-40">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg relative group"
                style={{ height: `${height}%`, minHeight: '20px' }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded">
                  {value}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600">{day}</span>
          </div>
        )
      })}
    </div>
  )
}

function TransactionTable({
  orders,
  formatDate,
}: {
  orders: Order[]
  formatDate: (date: string) => string
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-xs font-medium text-gray-500 pb-3">Customer</th>
            <th className="text-left text-xs font-medium text-gray-500 pb-3">Date</th>
            <th className="text-left text-xs font-medium text-gray-500 pb-3">Status</th>
            <th className="text-left text-xs font-medium text-gray-500 pb-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-100">
              <td className="py-3">
                <p className="text-sm font-medium text-gray-900">
                  {order.shippingAddress?.name || 'Guest'}
                </p>
                <p className="text-xs text-gray-500">{order.guestEmail || 'N/A'}</p>
              </td>
              <td className="py-3 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
              <td className="py-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="py-3">
                <Link
                  href={`/admin/collections/orders/${order.id}`}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CountryItem({
  country,
  value,
  percentage,
}: {
  country: string
  value: number
  percentage: number
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{country}</span>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function SocialItem({
  platform,
  visitors,
  customers,
  sales,
}: {
  platform: string
  visitors: number
  customers: number
  sales: number
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-gray-900">{platform}</p>
        <p className="text-xs text-gray-500">{visitors.toLocaleString()} visitors</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">{customers.toLocaleString()}</p>
        <p className="text-xs text-gray-500">{sales} sales</p>
      </div>
    </div>
  )
}
