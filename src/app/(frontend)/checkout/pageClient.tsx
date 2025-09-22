'use client'
import React, { useMemo, useState } from 'react'
import { useCart } from '@/providers/Cart'

export default function CheckoutClient() {
  const { items, total, clear } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postalCode: '',
  })

  const shipping = useMemo(() => {
    // Simple flat rate placeholder; server will recompute properly
    return 0
  }, [form])

  const grandTotal = total + shipping

  const onSubmit = async () => {
    try {
      setSubmitting(true)
      setError(null)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, address: form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Checkout failed')
      // Redirect to Paystack
      const url = data?.data?.authorization_url || data?.authorization_url
      if (url) {
        clear()
        window.location.href = url
      } else {
        throw new Error('Missing Paystack URL')
      }
    } catch (e: any) {
      setError(e.message || 'Error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="grid gap-3">
        <input
          className="border rounded p-2"
          placeholder="Full name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Address line 1"
          value={form.addressLine1}
          onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Address line 2"
          value={form.addressLine2}
          onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Country"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Postal code"
          value={form.postalCode}
          onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
        />
      </div>
      <div className="border rounded p-4 h-fit">
        <div className="font-medium mb-3">Order Summary</div>
        <div className="space-y-2 mb-3">
          {items.map((it) => (
            <div
              key={`${it.id}-${it.variantName || ''}`}
              className="flex items-center justify-between"
            >
              <div className="text-sm">
                {it.title} x{it.quantity}
              </div>
              <div className="text-sm">₦{(it.price * it.quantity).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>Shipping</div>
          <div>₦{shipping.toLocaleString()}</div>
        </div>
        <div className="flex items-center justify-between text-lg font-semibold mt-2">
          <div>Total</div>
          <div>₦{grandTotal.toLocaleString()}</div>
        </div>
        {error && <div className="text-red-600 text-sm mt-3">{error}</div>}
        <button
          onClick={onSubmit}
          disabled={submitting || items.length === 0}
          className="mt-4 w-full inline-flex items-center justify-center rounded-md border bg-primary text-primary-foreground px-4 py-2 text-sm disabled:opacity-50"
        >
          {submitting ? 'Processing…' : 'Pay with Paystack'}
        </button>
      </div>
    </div>
  )
}




