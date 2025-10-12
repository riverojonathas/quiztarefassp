'use client';

import { useRouter } from 'next/navigation';

export default function PlayPage() {
  const router = useRouter();

  const handleSoloPlay = () => {
    // TODO: Implementar jogo solo
    router.push('/solo-game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-24">
      <main className="pt-20 px-4 pb-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Escolha seu modo de jogo
            </h1>
            <p className="text-gray-600">
              Selecione como você quer jogar
            </p>
          </div>

          <div className="space-y-4">
            {/* Jogar Sozinho */}
            <button
              onClick={handleSoloPlay}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold">Jogar Sozinho</h3>
                  <p className="text-green-100 text-sm">Pratique e melhore suas habilidades</p>
                </div>
                <svg className="w-6 h-6 ml-auto group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Botão voltar */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
            >
              ← Voltar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}