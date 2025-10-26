import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import crypto from 'crypto'
import type { CustomUser } from '@/types/User'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Verify admin authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user from the token
    const token = authHeader.replace('Bearer ', '')
    let currentUser: CustomUser | null = null

    try {
      const result = await payload.find({
        collection: 'users',
        where: {
          _id: {
            equals: token,
          },
        },
      })

      if (result.docs.length > 0) {
        currentUser = result.docs[0] as CustomUser
      }
    } catch (error) {
      console.error('Error verifying admin:', error)
    }

    // Check if current user is admin
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Find the target user
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const targetUser = user as CustomUser

    // Check if user is already verified
    if (targetUser._verified) {
      return NextResponse.json({ error: 'User is already verified' }, { status: 400 })
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    // Update user with OTP and expiry
    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        verificationOTP: otp,
        otpExpiry: otpExpiry.toISOString(),
      },
    })

    // Professional email template
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
            <h2 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">Email Verification</h2>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h3 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">Hello ${targetUser.name || targetUser.firstName || 'Valued Customer'}!</h3>

            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
              An administrator has resent your verification code. Please use the code below to verify your email address.
            </p>

            <!-- OTP Code Box -->
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px dashed #084710; border-radius: 15px; padding: 30px; text-align: center; margin: 30px 0;">
              <p style="color: #084710; font-size: 14px; font-weight: 600; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
              <div style="background-color: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 15px 0;">
                <h1 style="color: #084710; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${otp}</h1>
              </div>
              <p style="color: #666666; font-size: 14px; margin: 15px 0 0 0;">
                <strong>⏱ Expires in 10 minutes</strong>
              </p>
            </div>

            <!-- Instructions -->
            <div style="background-color: #f8f9fa; border-left: 4px solid #084710; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
              <h4 style="color: #084710; margin: 0 0 10px 0; font-size: 16px;">How to use this code:</h4>
              <ol style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Go to the verification page</li>
                <li>Enter the 6-digit code above</li>
                <li>Click "Verify" to complete the process</li>
              </ol>
            </div>

            <p style="color: #666666; font-size: 14px; line-height: 1.6; text-align: center; margin-top: 30px;">
              Need help? Contact our support team at
              <a href="mailto:info@chikblessingglobal.com" style="color: #084710; text-decoration: none;">info@chikblessingglobal.com</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #084710; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">Chik Blessing Global Store</p>
            <p style="color: #999999; font-size: 12px; line-height: 1.4; margin: 20px 0 0 0;">
              © ${new Date().getFullYear()} Chik Blessing Global Store. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email using Resend API
    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Chik Blessing Global Store <noreply@chikblessing.com>',
          to: [targetUser.email],
          subject: 'Email Verification Code - Chik Blessing Global Store',
          html: emailHTML,
        }),
      })

      if (!resendResponse.ok) {
        const errorData = await resendResponse.json()
        console.error('Resend API error:', errorData)
        return NextResponse.json(
          {
            error: 'Failed to send verification email',
            details: errorData.message || 'Unknown error',
          },
          { status: 500 },
        )
      }

      const resendData = await resendResponse.json()
      console.log('Email sent successfully:', resendData)
    } catch (emailError: unknown) {
      console.error('Failed to send email:', emailError)
      const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown error'
      return NextResponse.json(
        {
          error: 'Failed to send verification email',
          details: errorMessage,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to user',
      email: targetUser.email,
    })
  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
