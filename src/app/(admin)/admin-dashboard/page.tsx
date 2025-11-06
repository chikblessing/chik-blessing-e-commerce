import { getPayload } from 'payload'
import config from '@payload-config'
import DashboardClient from './page.client'
import Link from 'next/link'

export default async function AdminDashboard() {
  try {
    const payload = await getPayload({ config })

    // Fetch overview data
    const [products, orders, users] = await Promise.all([
      payload.find({ collection: 'products', limit: 0 }),
      payload.find({ collection: 'orders', limit: 0 }),
      payload.find({ collection: 'users', limit: 0 }),
    ])

    // Calculate date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))

    // Fetch orders for calculations
    const allOrders = await payload.find({
      collection: 'orders',
      limit: 1000,
    })

    const ordersThisMonth = allOrders.docs.filter(
      (order) => new Date(order.createdAt) >= startOfMonth,
    )
    const ordersThisWeek = allOrders.docs.filter(
      (order) => new Date(order.createdAt) >= startOfWeek,
    )

    // Calculate revenue
    const totalRevenue = allOrders.docs.reduce((sum, order) => sum + (order.total || 0), 0)
    const revenueThisMonth = ordersThisMonth.reduce((sum, order) => sum + (order.total || 0), 0)
    const revenueThisWeek = ordersThisWeek.reduce((sum, order) => sum + (order.total || 0), 0)

    // Fetch users created this month
    const usersThisMonth = await payload.find({
      collection: 'users',
      where: {
        createdAt: {
          greater_than_equal: startOfMonth.toISOString(),
        },
      },
      limit: 0,
    })

    // Get low stock and out of stock products
    const allProducts = await payload.find({
      collection: 'products',
      limit: 1000,
    })

    const lowStockProducts = allProducts.docs.filter(
      (product: any) => product.inventory?.stock > 0 && product.inventory?.stock <= 10,
    )

    const outOfStockProducts = allProducts.docs.filter(
      (product: any) => product.inventory?.stock === 0,
    )

    // Get orders by status
    const ordersByStatus: Record<string, number> = {}
    allOrders.docs.forEach((order: any) => {
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1
    })

    // Get orders by payment status
    const ordersByPayment: Record<string, number> = {}
    allOrders.docs.forEach((order: any) => {
      const paymentStatus = order.paymentStatus || 'pending'
      ordersByPayment[paymentStatus] = (ordersByPayment[paymentStatus] || 0) + 1
    })

    // Get recent orders
    const recentOrders = await payload.find({
      collection: 'orders',
      limit: 10,
      sort: '-createdAt',
    })

    const data = {
      overview: {
        totalRevenue,
        revenue: totalRevenue,
        revenueThisMonth,
        revenueThisWeek,
        totalOrders: orders.totalDocs,
        orders: orders.totalDocs,
        ordersThisMonth: ordersThisMonth.length,
        ordersThisWeek: ordersThisWeek.length,
        totalProducts: products.totalDocs,
        lowStockProducts: lowStockProducts.length,
        outOfStockProducts: outOfStockProducts.length,
        totalUsers: users.totalDocs,
        newUsersThisMonth: usersThisMonth.totalDocs,
      },
      ordersByStatus,
      ordersByPayment,
      recentOrders: recentOrders.docs,
      lowStockProducts: lowStockProducts.slice(0, 10),
      pendingReportsLists: [],
    }

    return <DashboardClient data={data} />
  } catch (error) {
    console.error('Admin Dashboard Error:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <Link href="/admin" className="text-blue-600 hover:underline">
            Go to Admin Panel
          </Link>
        </div>
      </div>
    )
  }
}
