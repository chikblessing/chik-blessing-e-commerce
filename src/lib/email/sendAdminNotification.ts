interface AdminNotificationParams {
  type: 'order' | 'review' | 'contact' | 'product_report'
  subject: string
  title: string
  details: Record<string, any>
  actionUrl?: string
}

export async function sendAdminNotification({
  type,
  subject,
  title,
  details,
  actionUrl,
}: AdminNotificationParams) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.ADMIN_EMAIL || 'noreply@chikblessing.com'

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      return { success: false, error: 'Email service not configured' }
    }

    // Format details as HTML
    const detailsHtml = Object.entries(details)
      .map(
        ([key, value]) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">${key}:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${value}</td>
        </tr>
      `,
      )
      .join('')

    // Icon based on type
    const getIcon = () => {
      switch (type) {
        case 'order':
          return '🛒'
        case 'review':
          return '⭐'
        case 'contact':
          return '📧'
        case 'product_report':
          return '⚠️'
        default:
          return '🔔'
      }
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Notification</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #084710; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">${getIcon()} ${title}</h1>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; font-weight: bold;">New Activity Alert</p>
            <p style="margin: 5px 0 0 0;">A new ${type.replace('_', ' ')} requires your attention.</p>
          </div>

          <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #084710; margin-top: 0;">Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                ${detailsHtml}
              </tbody>
            </table>
          </div>

          ${
            actionUrl
              ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" style="display: inline-block; padding: 12px 30px; background-color: #084710; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
              View in Admin Panel
            </a>
          </div>
          `
              : ''
          }

          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            This is an automated notification from your e-commerce system.<br>
            Please log in to your admin panel to take action.
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Chik Blessing Global Store Admin System</p>
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
        from: 'Chik Blessing Store Notifications <notifications@chikblessingglobal.com>',
        to: [adminEmail],
        subject: `[Admin Alert] ${subject}`,
        html: emailHtml,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Failed to send admin notification:', data)
      return { success: false, error: data.message || 'Failed to send notification' }
    }

    console.log('Admin notification sent:', { type, subject })
    return { success: true, data }
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
