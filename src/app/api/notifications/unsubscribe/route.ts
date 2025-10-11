import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Here you would typically remove the subscription from your database
    // For now, we'll just return success
    console.log('Push subscription removed')

    // TODO: Remove from database
    // await removePushSubscription(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing push subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}