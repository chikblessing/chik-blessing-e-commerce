import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { CustomUser } from '@/types/User'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'monthly'

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

    // Calculate date range
    const now = new Date()
    let dateFrom: Date

    switch (period) {
      case 'daily':
        dateFrom = new Date(now.setHours(0, 0, 0, 0))
        break
      case 'weekly':
        dateFrom = new Date(now.setDate(now.getDate() - 7))
        break
      case 'monthly':
        dateFrom = new Date(now.setMonth(now.getMonth() - 1))
        break
      default:
        dateFrom = new Date(now.setMonth(now.getMonth() - 1))
    }

    // Fetch all customers
    const allCustomers = await payload.find({
      collection: 'users',
      where: {
        role: {
          equals: 'customer',
        },
      },
      limit: 10000,
    })

    // Fetch new customers in period
    const newCustomers = await payload.find({
      collection: 'users',
      where: {
        and: [
          {
            role: {
              equals: 'customer',
            },
          },
          {
            createdAt: {
              greater_than_equal: dateFrom.toISOString(),
            },
          },
        ],
      },
      limit: 10000,
    })

    // Fetch orders for customer analysis
    const orders = await payload.find({
      collection: 'orders',
      where: {
        paymentStatus: {
          equals: 'paid',
        },
      },
      limit: 10000,
      depth: 1,
    })

    // Calculate customer metrics
    const customerOrders: Record<
      string,
      { name: string; email: string; orders: number; totalSpent: number; lastOrder: string }
    > = {}

    orders.docs.forEach((order: any) => {
      const customerId = typeof order.customer === 'string' ? order.customer : order.customer?.id
      if (customerId) {
        if (!customerOrders[customerId]) {
          customerOrders[customerId] = {
            name: order.shippingAddress?.name || 'Unknown',
            email: order.shippingAddress?.email || order.guestEmail || 'Unknown',
            orders: 0,
            totalSpent: 0,
            lastOrder: order.createdAt,
          }
        }
        customerOrders[customerId].orders += 1
        customerOrders[customerId].totalSpent += order.total
        if (new Date(order.createdAt) > new Date(customerOrders[customerId].lastOrder)) {
          customerOrders[customerId].lastOrder = order.createdAt
        }
      }
    })

    // Top customers by spending
    const topCustomers = Object.entries(customerOrders)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)

    // Customer lifetime value
    const totalCustomerValue = Object.values(customerOrders).reduce(
      (sum, customer) => sum + customer.totalSpent,
      0,
    )
    const averageCustomerValue =
      Object.keys(customerOrders).length > 0
        ? totalCustomerValue / Object.keys(customerOrders).length
        : 0

    // Repeat customer rate
    const repeatCustomers = Object.values(customerOrders).filter(
      (customer) => customer.orders > 1,
    ).length
    const repeatCustomerRate =
      Object.keys(customerOrders).length > 0
        ? (repeatCustomers / Object.keys(customerOrders).length) * 100
        : 0

    return NextResponse.json({
      success: true,
      period,
      dateFrom: dateFrom.toISOString(),
      summary: {
        totalCustomers: allCustomers.docs.length,
        newCustomers: newCustomers.docs.length,
        activeCustomers: Object.keys(customerOrders).length,
        repeatCustomers,
        repeatCustomerRate: Math.round(repeatCustomerRate * 100) / 100,
        averageCustomerValue: Math.round(averageCustomerValue * 100) / 100,
      },
      topCustomers,
      customers: allCustomers.docs,
    })
  } catch (error) {
    console.error('Customer report error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate customer report',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
