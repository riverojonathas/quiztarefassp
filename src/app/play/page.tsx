'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PlayPage() {
  const router = useRouter();

  const handleStartGame = () => {
    router.push('/solo-game');
  };

  const handleTrilhaTarefas = () => {
    router.push('/trilha-tarefas');
  };

  const handleTarefasGrupo = () => {
    router.push('/tarefas-grupo');
  };

  const handleBackToHome = () => {
    router.push('/home');
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-3 sm:p-4 animate-fade-in flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="container mx-auto max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl flex-1 flex flex-col">
        {/* Header - Topo */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">Escolha seu Modo de Jogo</h1>
          <p className="text-base sm:text-lg text-white/80">Selecione como quer aprender hoje</p>
        </div>

        {/* Botões Principais - Centralizados */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-4 sm:space-y-6 max-w-md mx-auto w-full">
            {/* Start Game Button */}
            <motion.button
              onClick={handleStartGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 group w-full"
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

            {/* Trilha de Tarefas */}
            <motion.button
              onClick={handleTrilhaTarefas}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 group w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-center flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold">Trilha de Tarefas</h3>
                  <p className="text-purple-100 text-sm sm:text-base">Progressão escolar</p>
                </div>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>

            {/* Tarefas em Grupo */}
            <motion.button
              onClick={handleTarefasGrupo}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300 group w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-center flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold">Tarefas em Grupo</h3>
                  <p className="text-orange-100 text-sm sm:text-base">Sala de aula</p>
                </div>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Back to Home Button - Parte inferior fixa */}
        <div className="mt-auto pb-6">
          <motion.button
            onClick={handleBackToHome}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-4 shadow-lg hover:bg-white/20 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 group w-full max-w-xs mx-auto block"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-white/20 rounded-full p-2 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="text-center flex-1">
                <h3 className="text-base sm:text-lg font-medium">Voltar ao Início</h3>
                <p className="text-white/60 text-xs sm:text-sm">Página inicial</p>
              </div>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}