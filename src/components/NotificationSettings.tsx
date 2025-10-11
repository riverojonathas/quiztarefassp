'use client'

import { useState, useEffect } from 'react'
import { pushNotificationManager } from '@/lib/pushNotifications'

interface NotificationSettingsProps {
  className?: string
}

export default function NotificationSettings({ className = '' }: NotificationSettingsProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkNotificationStatus()
  }, [])

  const checkNotificationStatus = async () => {
    const currentPermission = await pushNotificationManager.getPermission()
    setPermission(currentPermission)

    if (currentPermission === 'granted') {
      const subscription = await pushNotificationManager.getSubscription()
      setIsSubscribed(!!subscription)
    }
  }

  const handleEnableNotifications = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Request permission
      const newPermission = await pushNotificationManager.requestPermission()
      setPermission(newPermission)

      if (newPermission === 'granted') {
        // Initialize service worker and subscribe
        await pushNotificationManager.init()
        const subscription = await pushNotificationManager.subscribe()
        setIsSubscribed(!!subscription)
      }
    } catch (err) {
      setError('Falha ao ativar notificações. Verifique as permissões do navegador.')
      console.error('Error enabling notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisableNotifications = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const success = await pushNotificationManager.unsubscribe()
      if (success) {
        setIsSubscribed(false)
      } else {
        setError('Falha ao desativar notificações.')
      }
    } catch (err) {
      setError('Erro ao desativar notificações.')
      console.error('Error disabling notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusMessage = () => {
    if (permission === 'denied') {
      return 'Notificações bloqueadas pelo navegador. Permita notificações nas configurações do site.'
    }
    if (permission === 'default') {
      return 'Clique em "Ativar Notificações" para receber atualizações sobre quizzes.'
    }
    if (isSubscribed) {
      return 'Notificações ativadas! Você receberá atualizações sobre quizzes.'
    }
    return 'Notificações permitidas, mas não inscritas. Clique em "Ativar Notificações".'
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Notificações Push
      </h3>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {permission === 'granted' && isSubscribed ? (
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              {getStatusMessage()}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex space-x-3">
          {(!isSubscribed || permission !== 'granted') ? (
            <button
              onClick={handleEnableNotifications}
              disabled={isLoading || permission === 'denied'}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Ativando...' : 'Ativar Notificações'}
            </button>
          ) : (
            <button
              onClick={handleDisableNotifications}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Desativando...' : 'Desativar Notificações'}
            </button>
          )}

          {permission === 'denied' && (
            <button
              onClick={() => window.open('chrome://settings/content/notifications', '_blank')}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
            >
              Configurações do Navegador
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p>
            As notificações incluem atualizações sobre quizzes, lembretes de tempo e resultados.
            Você pode alterar essas preferências a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  )
}