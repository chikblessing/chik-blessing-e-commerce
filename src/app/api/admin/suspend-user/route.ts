import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { CustomUser } from '@/types/User'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, suspended } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (typeof suspended !== 'boolean') {
      return NextResponse.json({ error: 'Suspended status must be a boolean' }, { status: 400 })
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

    // Prevent admin from suspending themselves
    if (targetUser.id === currentUser.id) {
      return NextResponse.json({ error: 'You cannot suspend your own account' }, { status: 400 })
    }

    // Update user suspension status
    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        suspended,
      },
    })

    return NextResponse.json({
      success: true,
      message: `User ${suspended ? 'suspended' : 'unsuspended'} successfully`,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        suspended,
      },
    })
  } catch (error) {
    console.error('Suspend user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
