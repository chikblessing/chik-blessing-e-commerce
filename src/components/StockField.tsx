'use client'

import React from 'react'
import { useField, NumberField } from '@payloadcms/ui'

export const StockField: React.FC<any> = (props) => {
  const { value } = useField({ path: props.path })
  const { value: lowStockThreshold } = useField({ path: 'inventory.lowStockThreshold' })

  const stock = typeof value === 'number' ? value : 0
  const threshold = typeof lowStockThreshold === 'number' ? lowStockThreshold : 10

  const getStockStatus = () => {
    if (stock === 0) {
      return { label: 'OUT OF STOCK', color: '#dc2626', bgColor: '#fee2e2' }
    } else if (stock <= threshold) {
      return { label: 'LOW STOCK', color: '#ea580c', bgColor: '#ffedd5' }
    } else {
      return { label: 'IN STOCK', color: '#16a34a', bgColor: '#dcfce7' }
    }
  }

  const status = getStockStatus()

  return (
    <div style={{ marginBottom: '1rem' }}>
      <NumberField {...props} />
      <div
        style={{
          marginTop: '0.5rem',
          padding: '0.5rem 0.75rem',
          borderRadius: '0.375rem',
          backgroundColor: status.bgColor,
          border: `1px solid ${status.color}`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: status.color,
          }}
        />
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: status.color,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {status.label}
        </span>
        <span
          style={{
            fontSize: '0.875rem',
            color: status.color,
            fontWeight: '500',
          }}
        >
          {stock} {stock === 1 ? 'unit' : 'units'}
        </span>
      </div>
    </div>
  )
}
