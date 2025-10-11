'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Send } from 'lucide-react';

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUserId: string;
  disabled?: boolean;
}

export function Chat({ messages, onSendMessage, currentUserId, disabled = false }: ChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && !disabled) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-md h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Chat da Sala</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        {/* Messages area */}
        <div
          className="flex-1 overflow-y-auto mb-4 space-y-2"
          role="log"
          aria-label="Mensagens do chat"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-4">
              Nenhuma mensagem ainda. Seja o primeiro a conversar!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.userId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.userId === currentUserId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                  role="article"
                  aria-label={`Mensagem de ${message.userName}: ${message.message}`}
                >
                  {message.userId !== currentUserId && (
                    <div className="font-semibold text-xs mb-1">{message.userName}</div>
                  )}
                  <div>{message.message}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.userId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                    }`}
                    aria-hidden="true"
                  >
                    {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? 'Chat desabilitado' : 'Digite sua mensagem...'}
            disabled={disabled}
            aria-label="Digite sua mensagem"
            maxLength={200}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || disabled}
            size="sm"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}