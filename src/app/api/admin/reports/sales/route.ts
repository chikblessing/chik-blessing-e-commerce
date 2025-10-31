import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { CustomUser } from '@/types/User'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'daily' // daily, weekly, monthly
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const payload = await getPayload({ config })

    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify the user is an admin
    let currentUser: CustomUser | null = null
    try {
      const result = await payload.find({
        collection: 'users',
        where: {
          _id: {
            equals: token,
          },
        },
      })

      if (result.docs.length > 0) {
        currentUser = result.docs[0] as CustomUser
      }
    } catch (error) {
      console.error('Error verifying user:', error)
    }

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Calculate date range based on period
    const now = new Date()
    let dateFrom: Date
    let dateTo: Date = new Date(now.setHours(23, 59, 59, 999))

    if (startDate && endDate) {
      dateFrom = new Date(startDate)
      dateTo = new Date(endDate)
    } else {
      switch (period) {
        case 'daily':
          dateFrom = new Date(now.setHours(0, 0, 0, 0))
          break
        case 'weekly':
          dateFrom = new Date(now.setDate(now.getDate() - 7))
          dateFrom.setHours(0, 0, 0, 0)
          break
        case 'monthly':
          dateFrom = new Date(now.setMonth(now.getMonth() - 1))
          dateFrom.setHours(0, 0, 0, 0)
          break
        default:
          dateFrom = new Date(now.setHours(0, 0, 0, 0))
      }
    }

    // Fetch orders within date range
    const orders = await payload.find({
      collection: 'orders',
      where: {
        and: [
          {
            createdAt: {
              greater_than_equal: dateFrom.toISOString(),
            },
          },
          {
            createdAt: {
              less_than_equal: dateTo.toISOString(),
            },
          },
        ],
      },
      limit: 10000,
      depth: 1,
    })

    // Calculate statistics
    const totalOrders = orders.docs.length
    const paidOrders = orders.docs.filter((order) => order.paymentStatus === 'paid')
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0)
    const totalShipping = paidOrders.reduce((sum, order) => sum + (order.shipping || 0), 0)
    const totalTax = paidOrders.reduce((sum, order) => sum + (order.tax || 0), 0)
    const netRevenue = totalRevenue - totalShipping - totalTax

    // Order status breakdown
    const statusBreakdown = orders.docs.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Payment status breakdown
    const paymentBreakdown = orders.docs.reduce(
      (acc, order) => {
        acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Top products
    const productSales: Record<string, { title: string; quantity: number; revenue: number }> = {}
    paidOrders.forEach((order) => {
      order.items?.forEach((item: any) => {
        const productId = typeof item.product === 'string' ? item.product : item.product?.id
        if (productId) {
          if (!productSales[productId]) {
            productSales[productId] = {
              title: item.productTitle || 'Unknown Product',
              quantity: 0,
              revenue: 0,
            }
          }
          productSales[productId].quantity += item.quantity
          productSales[productId].revenue += item.price * item.quantity
        }
      })
    })

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Average order value
    const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

    return NextResponse.json({
      success: true,
      period,
      dateRange: {
        from: dateFrom.toISOString(),
        to: dateTo.toISOString(),
      },
      summary: {
        totalOrders,
        paidOrders: paidOrders.length,
        totalRevenue,
        netRevenue,
        totalShipping,
        totalTax,
        averageOrderValue,
      },
      statusBreakdown,
      paymentBreakdown,
      topProducts,
      orders: orders.docs,
    })
  } catch (error) {
    console.error('Sales report error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate sales report',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
