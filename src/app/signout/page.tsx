'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../../state/useSessionStore';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import toast, { Toaster } from 'react-hot-toast';

export default function SignOutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const logout = useSessionStore((state) => state.logout);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      // Use the store's logout method
      await logout();

      // Clear localStorage if any custom data
      localStorage.clear();

      // Show success toast
      toast.success('Logout realizado com sucesso!');

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/signin');
      }, 1500);
    } catch (error) {
      toast.error('Erro inesperado: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back(); // Go back to previous page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4 py-8 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      <Card className="w-full max-w-sm sm:max-w-md mx-auto">
        <CardHeader className="pb-4">
          <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Tarefas do Futuro
          </h1>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            Construa seu futuro com tarefas inteligentes!
          </p>
          <CardTitle className="text-center text-xl sm:text-2xl">Sair da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <p className="text-center text-gray-700 dark:text-gray-300">
            Tem certeza de que deseja sair da sua conta?
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
              aria-label="Cancelar logout e voltar"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSignOut}
              className="flex-1 bg-red-500 hover:bg-red-600"
              disabled={isLoading}
              aria-label="Confirmar logout da conta"
            >
              {isLoading ? 'Saindo...' : 'Sim, sair'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}