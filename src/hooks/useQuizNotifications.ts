'use client'

import { useCallback } from 'react'
import { pushNotificationManager, NotificationPayload } from '@/lib/pushNotifications'

export interface QuizNotificationOptions {
  title: string
  body: string
  url?: string
  requireInteraction?: boolean
  silent?: boolean
}

export function useQuizNotifications() {
  const sendNotification = useCallback(async (options: QuizNotificationOptions) => {
    // Check if notifications are supported and permitted
    const permission = await pushNotificationManager.getPermission()
    if (permission !== 'granted') {
      console.log('Notifications not permitted, skipping notification')
      return
    }

    const subscription = await pushNotificationManager.getSubscription()
    if (!subscription) {
      console.log('No push subscription found, skipping notification')
      return
    }

    const payload: NotificationPayload = {
      title: options.title,
      body: options.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      url: options.url || '/home',
      requireInteraction: options.requireInteraction || false,
      silent: options.silent || false,
    }

    try {
      // Send notification via API
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
              auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
            },
          },
          payload,
        }),
      })

      if (!response.ok) {
        console.error('Failed to send notification')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }, [])

  const notifyTimeWarning = useCallback((secondsLeft: number, roomId: string) => {
    sendNotification({
      title: '⏰ Tempo Acabando!',
      body: `Restam apenas ${secondsLeft} segundos para responder!`,
      url: `/room/${roomId}`,
      requireInteraction: true,
    })
  }, [sendNotification])

  const notifyNewQuestion = useCallback((questionNumber: number, totalQuestions: number, roomId: string) => {
    sendNotification({
      title: '📝 Nova Pergunta!',
      body: `Pergunta ${questionNumber} de ${totalQuestions} disponível`,
      url: `/room/${roomId}`,
      requireInteraction: false,
    })
  }, [sendNotification])

  const notifyQuizEnd = useCallback((score: number, totalQuestions: number, roomId: string) => {
    sendNotification({
      title: '🏆 Quiz Finalizado!',
      body: `Você acertou ${score} de ${totalQuestions} perguntas. Veja seu resultado!`,
      url: `/room/${roomId}`,
      requireInteraction: true,
    })
  }, [sendNotification])

  const notifyRoomInvitation = useCallback((roomName: string, hostName: string, roomId: string) => {
    sendNotification({
      title: '🎯 Convite para Quiz!',
      body: `${hostName} te convidou para participar do quiz "${roomName}"`,
      url: `/room/${roomId}`,
      requireInteraction: true,
    })
  }, [sendNotification])

  const notifyChatMessage = useCallback((senderName: string, message: string, roomId: string) => {
    // Only send chat notifications if they're important (mentions, etc.)
    if (message.includes('@') || message.length < 50) {
      sendNotification({
        title: '💬 Nova Mensagem',
        body: `${senderName}: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`,
        url: `/room/${roomId}`,
        requireInteraction: false,
        silent: true, // Chat messages are less urgent
      })
    }
  }, [sendNotification])

  return {
    notifyTimeWarning,
    notifyNewQuestion,
    notifyQuizEnd,
    notifyRoomInvitation,
    notifyChatMessage,
    sendNotification,
  }
}