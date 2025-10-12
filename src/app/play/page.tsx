'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PlayPage() {
  const router = useRouter();

  const handleStartGame = () => {
    router.push('/solo-game');
  };

  const handleBackToHome = () => {
    router.push('/home');
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-3 sm:p-4 animate-fade-in pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="container mx-auto max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Pronto para Jogar?</h1>
          <p className="text-lg sm:text-xl text-white/80">Teste seus conhecimentos agora</p>
        </div>

        {/* Start Game Button */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <motion.button
            onClick={handleStartGame}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 group w-full max-w-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-center flex-1">
                <h3 className="text-xl sm:text-2xl font-bold">Começar Jogo</h3>
                <p className="text-green-100 text-sm sm:text-base">Modo Solo</p>
              </div>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>
        </div>

        {/* Back to Home Button */}
        <div className="text-center">
          <motion.button
            onClick={handleBackToHome}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg px-6 py-3 hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Voltar ao Início</span>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}