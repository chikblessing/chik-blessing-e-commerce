import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Find user with matching email and OTP
    const users = await payload.find({
      collection: 'users',
      where: {
        and: [
          {
            email: {
              equals: email,
            },
          },
          {
            verificationOTP: {
              equals: otp,
            },
          },
        ],
      },
    })

    if (users.docs.length === 0) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }

    const user = users.docs[0]

    // Check if OTP has expired
    if (user.otpExpiry && new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 })
    }

    // Verify the user and clear OTP data
    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        _verified: true,
        verificationOTP: null,
        otpExpiry: null,
      },
    })

    // Since the user is now verified, we can return success without a token
    // The frontend can handle login separately if needed
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        _verified: updatedUser._verified,
      },
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
