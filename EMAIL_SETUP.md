# Order Confirmation Email Setup

## Overview

Customers automatically receive an order confirmation email when they place an order.

## Features

- ✅ Automatic email on order creation
- ✅ Professional HTML email template
- ✅ Order details with itemized list
- ✅ Shipping address information
- ✅ Order summary with totals
- ✅ Order number and status

## Email Service

Uses **Resend** API for reliable email delivery.

## Configuration

### 1. Environment Variable

Add to your `.env.local`:

```env
RESEND_API_KEY=re_your_api_key_here
```

### 2. Get Resend API Key

1. Sign up at https://resend.com
2. Verify your domain (or use their test domain)
3. Get your API key from the dashboard
4. Add it to `.env.local`

### 3. Configure Sender Email

In `src/lib/email/sendOrderConfirmation.ts`, update the `from` address:

```typescript
from: 'Chik Blessing Global Store <orders@yourdomain.com>',
```

**Important**: The sender email domain must be verified in Resend.

## Email Template Includes

### Order Details

- Order number
- Order date
- Order status

### Items Ordered

- Product name
- Quantity
- Price per item
- Total per item

### Order Summary

- Subtotal
- Shipping fee
- Tax (if applicable)
- Grand total

### Shipping Address

- Customer name
- Full address
- Phone number

### Next Steps

- Information about shipping notification
- Customer support contact

## Testing

### Test Email Sending

1. Create a test order
2. Check server logs for email status
3. Verify email received in inbox

### Logs

Email sending is logged with:

- Success: `Order confirmation email sent`
- Failure: `Failed to send order confirmation email`

## Troubleshooting

### Email Not Sending

1. **Check API Key**: Verify `RESEND_API_KEY` is set correctly
2. **Check Domain**: Ensure sender domain is verified in Resend
3. **Check Logs**: Look for error messages in server logs
4. **Test API**: Use Resend dashboard to test API key

### Email Goes to Spam

1. Verify your domain in Resend
2. Set up SPF and DKIM records
3. Use a professional sender address

### Email Not Received

1. Check spam/junk folder
2. Verify customer email address is correct
3. Check Resend dashboard for delivery status

## Email Flow

```
Order Created
    ↓
afterChange Hook Triggered
    ↓
sendOrderConfirmationEmail()
    ↓
Resend API Call
    ↓
Email Delivered
    ↓
Customer Receives Confirmation
```

## Future Enhancements

Consider adding:

- Order shipped notification
- Order delivered notification
- Order cancelled notification
- Payment confirmation email
- Refund notification

## Notes

- Email sending is non-blocking - order creation succeeds even if email fails
- All email attempts are logged for debugging
- Uses HTML email for better presentation
- Mobile-responsive email template
- Includes company branding
