import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Check if user exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existingUsers.docs.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = existingUsers.docs[0]

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    // Update user with OTP and expiry
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        verificationOTP: otp,
        otpExpiry: otpExpiry.toISOString(),
      },
    })

    // Professional email template with brand styling
    const emailHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - Chik Blessing Global Store</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #084710 0%, #0a5c14 100%); padding: 40px 30px; text-align: center;">
            <div style="background-color: white; display: inline-block; padding: 15px 25px; border-radius: 10px; margin-bottom: 20px;">
              <h1 style="color: #084710; margin: 0; font-size: 24px; font-weight: bold;">CBGS</h1>
            </div>
            <h2 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">Email Verification</h2>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background-color: #084710; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V3H13V9H19Z"/>
                </svg>
              </div>
            </div>

            <h3 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">Hello ${user.name || user.firstName || 'Valued Customer'}!</h3>
            
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
              We received a request to verify your email address for your Chik Blessing Global Store account. 
              Please use the verification code below to complete the process.
            </p>

            <!-- OTP Code Box -->
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px dashed #084710; border-radius: 15px; padding: 30px; text-align: center; margin: 30px 0;">
              <p style="color: #084710; font-size: 14px; font-weight: 600; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
              <div style="background-color: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 15px 0;">
                <h1 style="color: #084710; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${otp}</h1>
              </div>
              <p style="color: #666666; font-size: 14px; margin: 15px 0 0 0;">
                <strong> Expires in 10 minutes</strong>
              </p>
            </div>

            <!-- Instructions -->
            <div style="background-color: #f8f9fa; border-left: 4px solid #084710; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
              <h4 style="color: #084710; margin: 0 0 10px 0; font-size: 16px;">How to use this code:</h4>
              <ol style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Return to the verification page</li>
                <li>Enter the 6-digit code above</li>
                <li>Click "Verify" to complete the process</li>
              </ol>
            </div>

            <!-- Security Notice -->
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
                <strong> Security Notice:</strong> If you didn't request this verification code, please ignore this email. 
                Your account security is important to us.
              </p>
            </div>

            <p style="color: #666666; font-size: 14px; line-height: 1.6; text-align: center; margin-top: 30px;">
              Need help? Contact our support team at 
              <a href="mailto:info@chikblessing.com" style="color: #084710; text-decoration: none;"info@chikblessingglobal.com</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #084710; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">Chik Blessing Global Store</p>
            <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">Your trusted partner for quality products</p>
            
            <div style="margin: 20px 0;">
              <a href="#" style="display: inline-block; margin: 0 10px; color: #084710; text-decoration: none;">
                <div style="width: 40px; height: 40px; background-color: #084710; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-weight: bold;">f</span>
                </div>
              </a>
              <a href="#" style="display: inline-block; margin: 0 10px; color: #084710; text-decoration: none;">
                <div style="width: 40px; height: 40px; background-color: #084710; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-weight: bold;">@</span>
                </div>
              </a>
              <a href="#" style="display: inline-block; margin: 0 10px; color: #084710; text-decoration: none;">
                <div style="width: 40px; height: 40px; background-color: #084710; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-weight: bold;">in</span>
                </div>
              </a>
            </div>

            <p style="color: #999999; font-size: 12px; line-height: 1.4; margin: 20px 0 0 0;">
              © ${new Date().getFullYear()} Chik Blessing Global Store. All rights reserved.<br>
              This email was sent to ${email}. If you no longer wish to receive these emails, 
              <a href="#" style="color: #084710;">unsubscribe here</a>.
            </p>
          </div>
        </div>

        <!-- Mobile Responsiveness -->
        <style>
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .content { padding: 20px !important; }
            .otp-code { font-size: 28px !important; letter-spacing: 4px !important; }
          }
        </style>
      </body>
      </html>
    `

    // Send email using Resend API directly
    try {
      console.log('Attempting to send email to:', email)
      console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY)

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Chik Blessing Global Store info@chikblessing.com', // Use Resend's test email or your verified domain
          to: [email],
          subject: 'Email Verification Code - Chik Blessing Global Store',
          html: emailHTML,
        }),
      })

      const responseText = await resendResponse.text()
      console.log('Resend API response status:', resendResponse.status)
      console.log('Resend API response:', responseText)

      if (!resendResponse.ok) {
        let errorData
        try {
          errorData = JSON.parse(responseText)
        } catch {
          errorData = { message: responseText }
        }
        console.error('Resend API error:', errorData)
        return NextResponse.json(
          {
            error: 'Failed to send verification email',
            details: errorData.message || 'Unknown error',
          },
          { status: 500 },
        )
      }

      const resendData = JSON.parse(responseText)
      console.log('Email sent successfully:', resendData)
    } catch (emailError: any) {
      console.error('Failed to send email:', emailError)
      return NextResponse.json(
        {
          error: 'Failed to send verification email',
          details: emailError.message || 'Unknown error',
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
