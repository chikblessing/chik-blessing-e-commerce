import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import DashboardClient from './page.client'

export default async function AdminDashboardPage() {
  const payload = await getPayload({ config })
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')

  // Check authentication
  if (!token) {
    redirect('/admin/login')
  }

  try {
    const { user } = await payload.auth({ headers: { cookie: `payload-token=${token.value}` } })

    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      redirect('/admin/login')
    }

    // Fetch analytics data
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Total orders
    const allOrders = await payload.find({
      collection: 'orders',
      limit: 0,
    })

    // Orders in last 30 days
    const recentOrders = await payload.find({
      collection: 'orders',
      where: {
        createdAt: {
          greater_than: thirtyDaysAgo.toISOString(),
        },
      },
      limit: 1000,
    })

    // Orders in last 7 days
    const weekOrders = await payload.find({
      collection: 'orders',
      where: {
        createdAt: {
          greater_than: sevenDaysAgo.toISOString(),
        },
      },
      limit: 1000,
    })

    // Calculate revenue
    const totalRevenue = recentOrders.docs.reduce((sum, order: any) => sum + (order.total || 0), 0)
    const weekRevenue = weekOrders.docs.reduce((sum, order: any) => sum + (order.total || 0), 0)

    // Total products
    const products = await payload.find({
      collection: 'products',
      limit: 0,
    })

    // Low stock products
    const lowStockProducts = await payload.find({
      collection: 'products',
      where: {
        'inventory.stock': {
          less_than_equal: 10,
        },
        'inventory.trackInventory': {
          equals: true,
        },
      },
      limit: 100,
    })

    // Out of stock products
    const outOfStockProducts = await payload.find({
      collection: 'products',
      where: {
        status: {
          equals: 'out-of-stock',
        },
      },
      limit: 100,
    })

    // Total users
    const users = await payload.find({
      collection: 'users',
      limit: 0,
    })

    // New users in last 30 days
    const newUsers = await payload.find({
      collection: 'users',
      where: {
        createdAt: {
          greater_than: thirtyDaysAgo.toISOString(),
        },
      },
      limit: 1000,
    })

    // Total reviews
    const reviews = await payload.find({
      collection: 'reviews',
      limit: 0,
    })

    // Pending product reports
    const pendingReports = await payload.find({
      collection: 'product-reports',
      where: {
        status: {
          equals: 'pending',
        },
      },
      limit: 100,
    })

    // Order status breakdown
    const ordersByStatus = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    }

    recentOrders.docs.forEach((order: any) => {
      if (ordersByStatus.hasOwnProperty(order.status)) {
        ordersByStatus[order.status as keyof typeof ordersByStatus]++
      }
    })

    // Payment status breakdown
    const ordersByPayment = {
      pending: 0,
      paid: 0,
      failed: 0,
      refunded: 0,
    }

    recentOrders.docs.forEach((order: any) => {
      if (ordersByPayment.hasOwnProperty(order.paymentStatus)) {
        ordersByPayment[order.paymentStatus as keyof typeof ordersByPayment]++
      }
    })

    const analyticsData = {
      overview: {
        totalOrders: allOrders.totalDocs,
        ordersThisMonth: recentOrders.totalDocs,
        ordersThisWeek: weekOrders.totalDocs,
        totalRevenue,
        revenueThisMonth: totalRevenue,
        revenueThisWeek: weekRevenue,
        totalProducts: products.totalDocs,
        lowStockProducts: lowStockProducts.totalDocs,
        outOfStockProducts: outOfStockProducts.totalDocs,
        totalUsers: users.totalDocs,
        newUsersThisMonth: newUsers.totalDocs,
        totalReviews: reviews.totalDocs,
        pendingReports: pendingReports.totalDocs,
      },
      ordersByStatus,
      ordersByPayment,
      recentOrders: recentOrders.docs.slice(0, 10),
      lowStockProducts: lowStockProducts.docs.slice(0, 10),
      pendingReportsList: pendingReports.docs.slice(0, 5),
    }

    return <DashboardClient data={analyticsData} />
  } catch (error) {
    console.error('Dashboard error:', error)
    redirect('/admin/login')
  }
}
