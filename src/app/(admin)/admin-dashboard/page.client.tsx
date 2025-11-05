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
  const { overview, ordersByStatus, ordersByPayment, recentOrders, lowStockProducts } = data

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="font-medium">Admin Panel</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xlmx-auto px-6 py-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time insights</p>
        </div>

        <div className="mt-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Revenue (30d)"
              value={formatCurrency(overview.revenueThisMonth)}
              subtitle={`Week: ${formatCurrency(overview.revenueThisWeek)}`}
              icon="💰"
              gradient="from-green-500 to-emerald-600"
            />
            <MetricCard
              title="Orders (30d)"
              value={overview.ordersThisMonth.toString()}
              subtitle={`Week: ${overview.ordersThisWeek}`}
              icon="🛍️"
              gradient="from-blue-500 to-indigo-600"
            />
            <MetricCard
              title="Products"
              value={overview.totalProducts.toString()}
              subtitle={`${overview.outOfStockProducts} out of stock`}
              icon="📦"
              gradient="from-purple-500 to-pink-600"
            />
            <MetricCard
              title="Customers"
              value={overview.totalUsers.toString()}
              subtitle={`+${overview.newUsersThisMonth} this month`}
              icon="👥"
              gradient="from-orange-500 to-red-600"
            />
          </div>

          {/* Alerts */}
          {(overview.lowStockProducts > 0 ||
            (overview.pendingReports && overview.pendingReports > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {overview.lowStockProducts > 0 && (
                <AlertCard
                  title="Low Stock Alert"
                  message={`${overview.lowStockProducts} products need restocking`}
                  link="/admin/collections/products"
                  linkText="View Products"
                  color="orange"
                />
              )}
              {overview.pendingReports && overview.pendingReports > 0 && (
                <AlertCard
                  title="Pending Reports"
                  message={`${overview.pendingReports} product reviews need review`}
                  link="/admin/collections/product-reviews"
                  linkText="Review Reports"
                  color="red"
                />
              )}
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Orders by Status" data={ordersByStatus} />
            <ChartCard title="Payment Status" data={ordersByPayment} />
          </div>

          {/* Recent Orders Table */}
          <OrdersTable
            orders={recentOrders}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />

          {/* Low StockProducts Table */}
          {lowStockProducts.length > 0 && <LowStockProductsTable products={lowStockProducts} />}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
}: {
  title: string
  value: string
  subtitle: string
  icon: string
  gradient: string
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-lg p-6 text-white hover:shadow-2xl transition-all transform hover:-translate-y-1`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">{title}</h3>
      <p className="text-4xl font-bold mb-2">{value}</p>
      <p className="text-sm opacity-80">{subtitle}</p>
    </div>
  )
}

function AlertCard({
  title,
  message,
  link,
  linkText,
  color,
}: {
  title: string
  message: string
  link: string
  linkText: string
  color: 'red' | 'orange'
}) {
  const colors: Record<'red' | 'orange', string> = {
    red: 'from-red-50 to-red-50 border-red-500 bg-red-900 text-red-600 hover:text-red-800',
    orange:
      'from-orange-50 to-red-50 border-orange-550 bg-orange-900 text-orange-600 hover:text-orange-800',
  }

  const colorClasses = colors[color].split(' ')

  return (
    <div
      className={`bg-gradient-to-r ${colorClasses[0]} ${colorClasses[1]} ${colorClasses[2]} rounded-2xl p-6 shadow-md`}
    >
      <h3 className={`text-lg font-bold ${colorClasses[3]} mb-2`}>{title}</h3>
      <p className={`${colorClasses[6]} ${colorClasses[7]} mb-3`}>{message}</p>
      <Link
        href={link}
        className={`inline-flex items-center gap-2 ${colorClasses[3]} font-semibold text-sm`}
      >
        {linkText}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}

function ChartCard({ title, data }: { title: string; data: Record<string, number> }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
    failed: 'bg-red-500',
    refunded: 'bg-gray-500',
    paid: 'bg-green-500',
  }

  const total = Object.values(data).reduce((a: number, b: number) => a + b, 0)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {Object.entries(data).map(([status, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0
          return (
            <div key={status}>
              <div className="flex justify-between text-sm mb-2">
                <span className="capitalize font-medium">{status}</span>
                <span className="font-bold">{count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`${colors[status]} h-3 rounded-full transition-all`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OrdersTable({
  orders,
  formatCurrency,
  formatDate,
}: {
  orders: Order[]
  formatCurrency: (amount: number) => string
  formatDate: (dateString: string) => string
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg mb-8 border overflow-hidden">
      <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
        <h3 className="text-lg font-bold">Recent Orders</h3>
        <Link
          href="/admin/collections/orders"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
        >
          View All →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                Order #
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold">{order.orderNumber}</td>
                <td className="px-6 py-4 text-sm">
                  {order.shippingAddress?.name || order.guestEmail || 'Guest'}
                </td>
                <td className="px-6 py-4 text-sm">{formatDate(order.createdAt)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : order.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : ''
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold">{formatCurrency(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function LowStockProductsTable({ products }: { products: Product[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
      <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-white flex justify-between items-center">
        <h3 className="text-lg font-bold">Low Stock Products</h3>
        <Link
          href="/admin/collections/products"
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm"
        >
          Manage Stock →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">SKU</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold">{product.title}</td>
                <td className="px-6 py-4 text-sm font-mono">{product.inventory?.sku || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      product.inventory?.stock === 0
                        ? 'bg-red-100 text-red-800'
                        : (product.inventory?.stock ?? 0) <= 5
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {product.inventory?.stock || 0} units
                  </span>
                </td>
                <td className="px-6 py-4 text-sm capitalize">{product.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
