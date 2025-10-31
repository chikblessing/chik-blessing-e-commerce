import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { CustomUser } from '@/types/User'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reportType, period, format, startDate, endDate } = body

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

    // Fetch report data based on type
    let reportData: any
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

    if (reportType === 'sales') {
      const salesResponse = await fetch(
        `${baseUrl}/api/admin/reports/sales?period=${period}&startDate=${startDate || ''}&endDate=${endDate || ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      reportData = await salesResponse.json()
    } else if (reportType === 'customers') {
      const customersResponse = await fetch(
        `${baseUrl}/api/admin/reports/customers?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      reportData = await customersResponse.json()
    }

    // Generate CSV
    if (format === 'csv') {
      let csvContent = ''

      if (reportType === 'sales') {
        // Sales CSV
        csvContent = 'Order Number,Customer,Date,Status,Payment Status,Total,Shipping,Tax\n'
        reportData.orders?.forEach((order: any) => {
          const customerName = order.shippingAddress?.name || order.guestEmail || 'Guest'
          csvContent += `"${order.orderNumber}","${customerName}","${new Date(order.createdAt).toLocaleDateString()}","${order.status}","${order.paymentStatus}",${order.total},${order.shipping || 0},${order.tax || 0}\n`
        })
      } else if (reportType === 'customers') {
        // Customers CSV
        csvContent = 'Name,Email,Registration Date,Status\n'
        reportData.customers?.forEach((customer: any) => {
          csvContent += `"${customer.name}","${customer.email}","${new Date(customer.createdAt).toLocaleDateString()}","${customer.suspended ? 'Suspended' : 'Active'}"\n`
        })
      }

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${reportType}-report-${period}-${Date.now()}.csv"`,
        },
      })
    }

    // For PDF, return data to be processed on client side
    // (PDF generation is better done client-side with libraries like jsPDF)
    return NextResponse.json({
      success: true,
      format,
      reportType,
      data: reportData,
    })
  } catch (error) {
    console.error('Export report error:', error)
    return NextResponse.json(
      {
        error: 'Failed to export report',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
