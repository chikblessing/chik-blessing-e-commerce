# Email Setup for OTP Verification

To enable OTP email verification, you need to configure email settings in your Payload CMS configuration.

## Environment Variables

Add these email configuration variables to your `.env.local` file:

```env
# Email Configuration (choose one method)

# Method 1: SMTP (recommended for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME=Your App Name
SMTP_FROM_ADDRESS=your-email@gmail.com

# Method 2: SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key

# Method 3: Resend
RESEND_API_KEY=your-resend-api-key
```

## Payload Configuration

Update your `payload.config.ts` to include email configuration:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  // ... your existing config

  email: {
    // Method 1: SMTP
    transport: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
    fromName: process.env.SMTP_FROM_NAME || 'Your App',
    fromAddress: process.env.SMTP_FROM_ADDRESS || 'noreply@yourapp.com',

    // OR Method 2: SendGrid
    // transport: {
    //   service: 'SendGrid',
    //   auth: {
    //     user: 'apikey',
    //     pass: process.env.SENDGRID_API_KEY,
    //   },
    // },

    // OR Method 3: Resend
    // transport: {
    //   service: 'Resend',
    //   auth: {
    //     user: 'resend',
    //     pass: process.env.RESEND_API_KEY,
    //   },
    // },
  },

  // ... rest of your config
})
```

## Gmail Setup (if using Gmail SMTP)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `SMTP_PASS`

## Testing

After configuration, test the email functionality:

1. Register a new user
2. Check that you receive the OTP email
3. Use the 6-digit code on the verification page

## Troubleshooting

- **Emails not sending**: Check your SMTP credentials and firewall settings
- **Gmail blocking**: Make sure you're using an App Password, not your regular password
- **Port issues**: Try port 465 with `secure: true` if 587 doesn't work
- **Development**: Consider using a service like Mailtrap for testing emails in development

## Production Recommendations

- Use a dedicated email service (SendGrid, Resend, AWS SES)
- Set up proper SPF, DKIM, and DMARC records
- Use a dedicated sending domain
- Monitor email delivery rates and reputation
