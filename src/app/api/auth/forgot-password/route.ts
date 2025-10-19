import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Check if user exists
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (users.docs.length === 0) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account exists, you will receive a password reset email',
      })
    }

    const user = users.docs[0]

    // Generate password reset token
    const token = await payload.forgotPassword({
      collection: 'users',
      data: {
        email: email,
      },
    })

    // Send email using Resend API
    const resetLink = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/auth/reset-password?token=${token}`

    const emailHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Chik Blessing Global Store</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #084710 0%, #0a5c14 100%); padding: 40px 30px; text-align: center;">
            <div style="background-color: white; display: inline-block; padding: 15px 25px; border-radius: 10px; margin-bottom: 20px;">
              <h1 style="color: #084710; margin: 0; font-size: 24px; font-weight: bold;">CBGS</h1>
            </div>
            <h2 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">Password Reset</h2>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background-color: #084710; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z"/>
                </svg>
              </div>
            </div>

            <h3 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">Hello ${user.name || user.firstName || 'Valued Customer'}!</h3>

            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
              We received a request to reset your password for your Chik Blessing Global Store account.
              Click the button below to create a new password.
            </p>

            <!-- Reset Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; background-color: #084710; color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                Reset Password
              </a>
            </div>

            <!-- Alternative Link -->
            <div style="background-color: #f8f9fa; border-left: 4px solid #084710; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #084710; font-size: 14px; word-break: break-all; margin: 0;">
                ${resetLink}
              </p>
            </div>

            <!-- Security Notice -->
            <div style="background-color: #fff3cd; border: 1px solid: #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
                <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
              </p>
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
          subject: 'Reset Your Password - Chik Blessing Global Store',
          html: emailHTML,
        }),
      })

      if (!resendResponse.ok) {
        const errorData = await resendResponse.json()
        console.error('Resend API error:', errorData)
        throw new Error('Failed to send email')
      }

      console.log('Password reset email sent successfully to:', email)
    } catch (emailError: any) {
      console.error('Failed to send password reset email:', emailError)
      return NextResponse.json(
        {
          error: 'Failed to send password reset email',
          details: emailError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully',
    })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
