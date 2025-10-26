import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { CustomUser } from '@/types/User'

export async function PUT(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Verify authentication using Payload's built-in auth
    const authResult = await payload.auth({ headers: request.headers })
    if (!authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, ...updateData } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const currentUser = authResult.user as CustomUser

    // Users can only update their own profile unless they're admin
    if (currentUser.id !== userId && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Remove sensitive fields that shouldn't be updated via this endpoint
    const {
      password,
      email,
      role,
      suspended,
      verificationOTP,
      otpExpiry,
      _verified,
      ...safeUpdateData
    } = updateData

    // Update user profile
    const updatedUser = await payload.update({
      collection: 'users',
      id: userId,
      data: safeUpdateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
