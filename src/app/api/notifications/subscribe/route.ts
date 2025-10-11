import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()

    // Validate subscription data
    if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      )
    }

    // Here you would typically save the subscription to your database
    // For now, we'll just log it and return success
    console.log('Push subscription received:', {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh.substring(0, 10) + '...', // Log partial key for security
        auth: subscription.keys.auth.substring(0, 10) + '...',
      },
    })

    // TODO: Save to database with user association
    // await savePushSubscription(userId, subscription)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving push subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}