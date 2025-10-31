'use client'

import React, { useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminReportsPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()

  const [reportType, setReportType] = useState<'sales' | 'customers'>('sales')
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reportData, setReportData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
    if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      router.push('/')
      toast.error('Access denied - Admin only')
    }
  }, [user, loading, router])

  const generateReport = async () => {
    setIsLoading(true)
    try {
      const endpoint =
        reportType === 'sales' ? '/api/admin/reports/sales' : '/api/admin/reports/customers'

      const params = new URLSearchParams({ period })
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`${endpoint}?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setReportData(data)
        toast.success('Report generated successfully!')
      } else {
        toast.error(data.error || 'Failed to generate report')
      }
    } catch (error) {
      toast.error('An error occurred while generating report')
    } finally {
      setIsLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!reportData) return

    let csvContent = ''

    if (reportType === 'sales') {
      // Sales report CSV
      csvContent = 'Sales Report\n\n'
      csvContent += `Period: ${reportData.period}\n`
      csvContent += `Date Range: ${new Date(reportData.dateRange.from).toLocaleDateString()} - ${new Date(reportData.dateRange.to).toLocaleDateString()}\n\n`
      csvContent += 'Summary\n'
      csvContent += `Total Orders,${reportData.summary.totalOrders}\n`
      csvContent += `Paid Orders,${reportData.summary.paidOrders}\n`
      csvContent += `Total Revenue,₦${reportData.summary.totalRevenue.toLocaleString()}\n`
      csvContent += `Net Revenue,₦${reportData.summary.netRevenue.toLocaleString()}\n`
      csvContent += `Average Order Value,₦${reportData.summary.averageOrderValue.toFixed(2)}\n\n`

      csvContent += 'Top Products\n'
      csvContent += 'Product,Quantity Sold,Revenue\n'
      reportData.topProducts.forEach((product: any) => {
        csvContent += `"${product.title}",${product.quantity},₦${product.revenue.toLocaleString()}\n`
      })
    } else {
      // Customer report CSV
      csvContent = 'Customer Report\n\n'
      csvContent += `Period: ${reportData.period}\n\n`
      csvContent += 'Summary\n'
      csvContent += `Total Customers,${reportData.summary.totalCustomers}\n`
      csvContent += `New Customers,${reportData.summary.newCustomers}\n`
      csvContent += `Active Customers,${reportData.summary.activeCustomers}\n`
      csvContent += `Repeat Customers,${reportData.summary.repeatCustomers}\n`
      csvContent += `Repeat Rate,${reportData.summary.repeatCustomerRate}%\n`
      csvContent += `Average Customer Value,₦${reportData.summary.averageCustomerValue.toLocaleString()}\n\n`

      csvContent += 'Top Customers\n'
      csvContent += 'Name,Email,Orders,Total Spent\n'
      reportData.topCustomers.forEach((customer: any) => {
        csvContent += `"${customer.name}","${customer.email}",${customer.orders},₦${customer.totalSpent.toLocaleString()}\n`
      })
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `${reportType}_report_${period}_${new Date().toISOString().split('T')[0]}.csv`,
    )
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Report exported as CSV')
  }

  const exportToPDF = () => {
    if (!reportData) return

    // Create a printable version
    const printWindow = window.open('', '', 'height=600,width=800')
    if (!printWindow) {
      toast.error('Please allow popups to export PDF')
      return
    }

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportType === 'sales' ? 'Sales' : 'Customer'} Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #084710; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #084710; color: white; }
          .summary { background-color: #f4f4f4; padding: 15px; margin: 20px 0; }
          .summary-item { margin: 10px 0; }
        </style>
      </head>
      <body>
        <h1>${reportType === 'sales' ? 'Sales' : 'Customer'} Report</h1>
        <p><strong>Period:</strong> ${reportData.period}</p>
    `

    if (reportType === 'sales') {
      htmlContent += `
        <p><strong>Date Range:</strong> ${new Date(reportData.dateRange.from).toLocaleDateString()} - ${new Date(reportData.dateRange.to).toLocaleDateString()}</p>
        <div class="summary">
          <h2>Summary</h2>
          <div class="summary-item"><strong>Total Orders:</strong> ${reportData.summary.totalOrders}</div>
          <div class="summary-item"><strong>Paid Orders:</strong> ${reportData.summary.paidOrders}</div>
          <div class="summary-item"><strong>Total Revenue:</strong> ₦${reportData.summary.totalRevenue.toLocaleString()}</div>
          <div class="summary-item"><strong>Net Revenue:</strong> ₦${reportData.summary.netRevenue.toLocaleString()}</div>
          <div class="summary-item"><strong>Average Order Value:</strong> ₦${reportData.summary.averageOrderValue.toFixed(2)}</div>
        </div>
        <h2>Top Products</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.topProducts
              .map(
                (product: any) => `
              <tr>
                <td>${product.title}</td>
                <td>${product.quantity}</td>
                <td>₦${product.revenue.toLocaleString()}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      `
    } else {
      htmlContent += `
        <div class="summary">
          <h2>Summary</h2>
          <div class="summary-item"><strong>Total Customers:</strong> ${reportData.summary.totalCustomers}</div>
          <div class="summary-item"><strong>New Customers:</strong> ${reportData.summary.newCustomers}</div>
          <div class="summary-item"><strong>Active Customers:</strong> ${reportData.summary.activeCustomers}</div>
          <div class="summary-item"><strong>Repeat Customers:</strong> ${reportData.summary.repeatCustomers}</div>
          <div class="summary-item"><strong>Repeat Rate:</strong> ${reportData.summary.repeatCustomerRate}%</div>
          <div class="summary-item"><strong>Average Customer Value:</strong> ₦${reportData.summary.averageCustomerValue.toLocaleString()}</div>
        </div>
        <h2>Top Customers</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.topCustomers
              .map(
                (customer: any) => `
              <tr>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.orders}</td>
                <td>₦${customer.totalSpent.toLocaleString()}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      `
    }

    htmlContent += `
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()

    setTimeout(() => {
      printWindow.print()
      toast.success('Report ready for PDF export')
    }, 250)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Reports</h1>
          <p className="mt-2 text-gray-600">Generate and export sales and customer reports</p>
        </div>

        {/* Report Configuration */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Report Configuration</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as 'sales' | 'customers')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="sales">Sales Report</option>
                <option value="customers">Customer Report</option>
              </select>
            </div>

            {/* Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date (Optional)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={generateReport}
              disabled={isLoading}
              className="px-6 py-3 bg-[#084710] text-white rounded-lg hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {/* Report Display */}
        {reportData && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {reportType === 'sales' ? 'Sales' : 'Customer'} Report
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Export CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="14 2 14 8 20 8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Export PDF
                </button>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(reportData.summary).map(([key, value]) => (
                  <div key={key} className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {typeof value === 'number' && key.toLowerCase().includes('revenue')
                        ? `₦${value.toLocaleString()}`
                        : typeof value === 'number' && key.toLowerCase().includes('rate')
                          ? `${value}%`
                          : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Items Table */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {reportType === 'sales' ? 'Top Products' : 'Top Customers'}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {reportType === 'sales' ? (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revenue
                          </th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Orders
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Spent
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(reportType === 'sales'
                      ? reportData.topProducts
                      : reportData.topCustomers
                    ).map((item: unknown, index: number) => (
                      <tr key={index}>
                        {reportType === 'sales' ? (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₦{item.revenue.toLocaleString()}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.orders}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₦{item.totalSpent.toLocaleString()}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
