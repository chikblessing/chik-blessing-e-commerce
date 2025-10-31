import type { Order } from '@/payload-types'

interface EmailParams {
  to: string
  orderNumber: string
  customerName: string
  order: Order
}

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  customerName,
  order,
}: EmailParams) {
  try {
    // Using Resend API
    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      return { success: false, error: 'Email service not configured' }
    }

    const itemsHtml = order.items
      ?.map(
        (item: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productTitle || 'Product'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₦${item.price.toLocaleString()}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₦${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
      `,
      )
      .join('')

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #084710; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Order Confirmation</h1>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px;">Dear ${customerName},</p>

          <p>Thank you for your order! We're excited to confirm that we've received your order and it's being processed.</p>

          <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #084710; margin-top: 0;">Order Details</h2>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
          </div>

          <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #084710; margin-top: 0;">Items Ordered</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f4f4f4;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #084710;">Product</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #084710;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #084710;">Price</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #084710;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #084710; margin-top: 0;">Order Summary</h2>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 5px;">Subtotal:</td>
                <td style="padding: 5px; text-align: right;">₦${order.subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 5px;">Shipping:</td>
                <td style="padding: 5px; text-align: right;">₦${(order.shipping || 0).toLocaleString()}</td>
              </tr>
              ${
                order.tax
                  ? `
              <tr>
                <td style="padding: 5px;">Tax:</td>
                <td style="padding: 5px; text-align: right;">₦${order.tax.toLocaleString()}</td>
              </tr>
              `
                  : ''
              }
              <tr style="border-top: 2px solid #084710; font-weight: bold; font-size: 18px;">
                <td style="padding: 10px 5px;">Total:</td>
                <td style="padding: 10px 5px; text-align: right; color: #084710;">₦${order.total.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #084710; margin-top: 0;">Shipping Address</h2>
            <p style="margin: 5px 0;">${order.shippingAddress.name}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.street}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.country}</p>
            <p style="margin: 5px 0;">Phone: ${order.shippingAddress.phone}</p>
          </div>

          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0;"><strong>What's Next?</strong></p>
            <p style="margin: 10px 0 0 0;">We'll send you another email once your order has been shipped with tracking information.</p>
          </div>

          <p style="margin-top: 30px;">If you have any questions about your order, please contact our customer support.</p>

          <p style="margin-top: 20px;">Thank you for shopping with us!</p>

          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Best regards,<br>
            <strong>Chik Blessing Global Store</strong>
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Chik Blessing Global Store. All rights reserved.</p>
        </div>
      </body>
      </html>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Chik Blessing Global Store <noreply@chikblessing.com>',
        to: [to],
        subject: `Order Confirmation - ${orderNumber}`,
        html: emailHtml,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Failed to send email:', data)
      return { success: false, error: data.message || 'Failed to send email' }
    }

    console.log('Order confirmation email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
