import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'

async function sendOrderConfirmationEmail(order: any, email: string, items: any[]) {
  const orderItemsHTML = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e9ecef;">
        <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${item.product.title}</div>
        <div style="font-size: 14px; color: #666;">Quantity: ${item.quantity}</div>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #e9ecef; text-align: right; font-weight: 600; color: #084710;">
        ₦${((item.product.salePrice || item.product.price) * item.quantity).toLocaleString()}
      </td>
    </tr>
  `,
    )
    .join('')

  const emailHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Chik Blessing Global Store</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #084710 0%, #0a5c14 100%); padding: 40px 30px; text-align: center;">
          <div style="background-color: white; display: inline-block; padding: 15px 25px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: #084710; margin: 0; font-size: 24px; font-weight: bold;">CBGS</h1>
          </div>
          <h2 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">Order Confirmation</h2>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background-color: #084710; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          </div>

          <h3 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">Thank you for your order!</h3>

          <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
            We've received your order and will process it shortly. Here are your order details:
          </p>

          <!-- Order Details Box -->
          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #084710; border-radius: 15px; padding: 25px; margin: 30px 0;">
            <div style="text-align: center; margin-bottom: 20px;">
              <p style="color: #084710; font-size: 14px; font-weight: 600; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">Order Number</p>
              <h2 style="color: #084710; font-size: 28px; font-weight: bold; margin: 0; font-family: 'Courier New', monospace;">${order.orderNumber}</h2>
            </div>

            <div style="border-top: 1px solid #084710; padding-top: 15px;">
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Order Date:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #333;">${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Payment Method:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #333;">${order.paymentMethod === 'cash' ? 'Pay on Pickup' : 'Online Payment'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Shipping Method:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #333;">${order.shippingMethod === 'pickup' ? 'Store Pickup' : 'Standard Delivery'}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Order Items -->
          <div style="margin: 30px 0;">
            <h4 style="color: #084710; font-size: 18px; margin-bottom: 15px; font-weight: 600;">Order Items</h4>
            <table style="width: 100%; border-collapse: collapse; background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden;">
              ${orderItemsHTML}
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 15px; font-weight: 600; color: #333;">Subtotal</td>
                <td style="padding: 15px; text-align: right; font-weight: 600; color: #333;">₦${order.subtotal.toLocaleString()}</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 15px; font-weight: 600; color: #333;">Shipping</td>
                <td style="padding: 15px; text-align: right; font-weight: 600; color: #333;">${order.shipping === 0 ? '<span style="color: #28a745;">FREE</span>' : `₦${order.shipping.toLocaleString()}`}</td>
              </tr>
              <tr style="background-color: #084710;">
                <td style="padding: 20px; font-weight: bold; color: white; font-size: 18px;">Total</td>
                <td style="padding: 20px; text-align: right; font-weight: bold; color: white; font-size: 18px;">₦${order.total.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <!-- Shipping Address -->
          <div style="background-color: #f8f9fa; border-left: 4px solid #084710; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
            <h4 style="color: #084710; margin: 0 0 15px 0; font-size: 16px;">Shipping Address</h4>
            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
              ${order.shippingAddress.name}<br>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}<br>
              Phone: ${order.shippingAddress.phone}
            </p>
          </div>

          ${
            order.shippingMethod === 'pickup'
              ? `
          <!-- Pickup Information -->
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
              <strong>📍 Pickup Information:</strong> We'll send you an email with the pickup address and available times shortly. Please bring your order number when collecting your items.
            </p>
          </div>
          `
              : ''
          }

          <!-- Next Steps -->
          <div style="background-color: #e7f5ff; border-left: 4px solid #084710; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
            <h4 style="color: #084710; margin: 0 0 10px 0; font-size: 16px;">What's Next?</h4>
            <ol style="color: #666666; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>We'll process your order within 24 hours</li>
              <li>You'll receive updates via email</li>
              <li>Track your order anytime on our website</li>
              ${order.shippingMethod === 'pickup' ? "<li>We'll notify you when your order is ready for pickup</li>" : '<li>Your order will be delivered within 3-5 business days</li>'}
            </ol>
          </div>

          <!-- Track Order Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders" style="display: inline-block; background-color: #084710; color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
              Track Your Order
            </a>
          </div>

          <p style="color: #666666; font-size: 14px; line-height: 1.6; text-align: center; margin-top: 30px;">
            Need help? Contact our support team at
            <a href="mailto:support@chikblessingglobal.com" style="color: #084710; text-decoration: none;">support@chikblessingglobal.com</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
          <p style="color: #084710; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">Chik Blessing Global Store</p>
          <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">Your trusted partner for quality products</p>

          <p style="color: #999999; font-size: 12px; line-height: 1.4; margin: 20px 0 0 0;">
            © ${new Date().getFullYear()} Chik Blessing Global Store. All rights reserved.<br>
            This email was sent to ${email}.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Chik Blessing Global Store <onboarding@resend.dev>',
        to: [email],
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: emailHTML,
      }),
    })

    if (!resendResponse.ok) {
      console.error('Failed to send order confirmation email')
    } else {
      console.log('Order confirmation email sent to:', email)
    }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingMethod,
      total,
      subtotal,
      shipping,
    } = body

    // Get user from cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    let customer = null
    let guestEmail = null

    if (token) {
      // Authenticated user
      const { user } = await payload.auth({ headers: request.headers })
      if (user) {
        customer = user.id
      }
    }

    // If no authenticated user, use guest email
    if (!customer) {
      guestEmail = shippingAddress.email
    }

    // Create order
    const order = await payload.create({
      collection: 'orders',
      data: {
        customer: customer || undefined,
        guestEmail: guestEmail || undefined,
        items: items.map((item: any) => ({
          product: item.product.id,
          quantity: item.quantity,
          price: item.product.salePrice || item.product.price,
          sku: item.variantSku,
        })),
        subtotal,
        shipping,
        total,
        shippingMethod,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending',
        status: 'pending',
        shippingAddress: {
          name: shippingAddress.name,
          phone: shippingAddress.phone,
          email: shippingAddress.email,
          street: shippingAddress.street || 'N/A',
          city: shippingAddress.city || 'N/A',
          state: shippingAddress.state || 'N/A',
          postalCode: shippingAddress.postalCode || 'N/A',
          country: shippingAddress.country || 'Nigeria',
        },
        billingAddress: {
          name: billingAddress.name,
          street: billingAddress.street || 'N/A',
          city: billingAddress.city || 'N/A',
          state: billingAddress.state || 'N/A',
          postalCode: billingAddress.postalCode || 'N/A',
          country: billingAddress.country || 'Nigeria',
        },
      },
    })

    // Send order confirmation email
    await sendOrderConfirmationEmail(order, shippingAddress.email, items)

    // If pickup/cash payment, return success
    if (paymentMethod === 'cash') {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        message: 'Order created successfully',
      })
    }

    // If online payment, initialize Paystack
    if (paymentMethod === 'paystack') {
      const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          email: shippingAddress.email,
          amount: Math.round(total * 100), // Convert to kobo
          currency: 'NGN',
          reference: order.orderNumber,
          callback_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order-confirmation?orderId=${order.id}`,
          metadata: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            custom_fields: [
              {
                display_name: 'Order Number',
                variable_name: 'order_number',
                value: order.orderNumber,
              },
            ],
          },
        }),
      })

      const paystackData = await paystackResponse.json()

      if (!paystackResponse.ok || !paystackData.status) {
        throw new Error(paystackData.message || 'Failed to initialize payment')
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      })
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 })
  }
}
