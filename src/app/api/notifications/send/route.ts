import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

export async function POST(request: NextRequest) {
  try {
    const { subscription, payload } = await request.json()

    // Validate required environment variables
    if (!process.env.VAPID_PRIVATE_KEY || !process.env.VAPID_PUBLIC_KEY) {
      return NextResponse.json(
        { error: 'VAPID keys not configured' },
        { status: 500 }
      )
    }

    // Configure web-push
    webpush.setVapidDetails(
      'mailto:your-email@example.com', // Replace with your email
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    )

    // Send the notification
    await webpush.sendNotification(subscription, JSON.stringify(payload))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending push notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}