'use client'

import React, { useState } from 'react'

export default function AdminReportsView() {
  const [reportType, setReportType] = useState<'sales' | 'customers'>('sales')
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reportData, setReportData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const generateReport = async () => {
    setIsLoading(true)
    try {
      const endpoint =
        reportType === 'sales' ? '/api/admin/reports/sales' : '/api/admin/reports/customers'

      const params = new URLSearchParams({ period })
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`${endpoint}?${params}`, {
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        setReportData(data)
      } else {
        alert(data.error || 'Failed to generate report')
      }
    } catch (_error) {
      alert('An error occurred while generating report')
    } finally {
      setIsLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!reportData) return

    let csvContent = ''

    if (reportType === 'sales') {
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
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Reports Dashboard</h1>

      {/* Configuration */}
      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ marginBottom: '15px' }}>Report Configuration</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'sales' | 'customers')}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            >
              <option value="sales">Sales Report</option>
              <option value="customers">Customer Report</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button
            onClick={generateReport}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              background: '#084710',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>

          {reportData && (
            <button
              onClick={exportToCSV}
              style={{
                padding: '10px 20px',
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Report Display */}
      {reportData && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '20px' }}>
            {reportType === 'sales' ? 'Sales' : 'Customer'} Report
          </h2>

          {/* Summary */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
              {Object.entries(reportData.summary).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    background: '#f9fafb',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
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

          {/* Table */}
          <div>
            <h3 style={{ marginBottom: '15px' }}>
              {reportType === 'sales' ? 'Top Products' : 'Top Customers'}
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  {reportType === 'sales' ? (
                    <>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Quantity</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Revenue</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Orders</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Total Spent</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {(reportType === 'sales' ? reportData.topProducts : reportData.topCustomers).map(
                  (item: any, index: number) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      {reportType === 'sales' ? (
                        <>
                          <td style={{ padding: '12px' }}>{item.title}</td>
                          <td style={{ padding: '12px' }}>{item.quantity}</td>
                          <td style={{ padding: '12px' }}>₦{item.revenue.toLocaleString()}</td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '12px' }}>{item.name}</td>
                          <td style={{ padding: '12px' }}>{item.email}</td>
                          <td style={{ padding: '12px' }}>{item.orders}</td>
                          <td style={{ padding: '12px' }}>₦{item.totalSpent.toLocaleString()}</td>
                        </>
                      )}
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
