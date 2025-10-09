import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Simple test - just try to connect
    const result = await payload.find({
      collection: 'users',
      limit: 1,
    })

    return NextResponse.json({
      success: true,
      message: 'Payload connection successful',
      userCount: result.totalDocs,
    })
  } catch (error) {
    console.error('Payload test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Payload connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}