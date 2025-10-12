'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function TrilhaTarefasPage() {
  const router = useRouter();

  const handleBackToPlay = () => {
    router.push('/play');
  };

  const phases = [
    { id: 1, title: 'Fase 1', subtitle: 'Introdução', description: 'Conceitos básicos e fundamentos', color: 'from-blue-500 to-cyan-600', icon: '📚' },
    { id: 2, title: 'Fase 2', subtitle: 'Desenvolvimento', description: 'Aprofundamento dos temas', color: 'from-green-500 to-emerald-600', icon: '🌱' },
    { id: 3, title: 'Fase 3', subtitle: 'Aplicação', description: 'Exercícios práticos', color: 'from-purple-500 to-indigo-600', icon: '⚡' },
    { id: 4, title: 'Fase 4', subtitle: 'Consolidação', description: 'Revisão e avaliação', color: 'from-orange-500 to-red-600', icon: '🏆' },
    { id: 5, title: 'Fase 5', subtitle: 'Avançado', description: 'Tópicos complexos', color: 'from-pink-500 to-rose-600', icon: '🚀' },
    { id: 6, title: 'Fase 6', subtitle: 'Especialização', description: 'Temas específicos', color: 'from-teal-500 to-cyan-600', icon: '🎯' },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-3 sm:p-4 animate-fade-in pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="container mx-auto max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Trilha de Tarefas</h1>
          <p className="text-lg sm:text-xl text-white/80">Sua jornada de aprendizado ao longo do ano</p>
        </div>

        {/* Fases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              className={`bg-gradient-to-r ${phase.color} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {phase.icon}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">{phase.title}</h3>
                  <p className="text-white/80 text-sm sm:text-base">{phase.subtitle}</p>
                </div>
              </div>
              <p className="text-white/90 text-sm sm:text-base mb-4">{phase.description}</p>
              <div className="flex items-center justify-between">
                <div className="bg-white/20 rounded-full px-3 py-1 text-xs sm:text-sm">
                  Em breve
                </div>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Back to Play Button */}
        <div className="text-center">
          <motion.button
            onClick={handleBackToPlay}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-4 shadow-lg hover:bg-white/20 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 group w-full max-w-md"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-white/20 rounded-full p-2 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              <div className="text-center flex-1">
                <h3 className="text-base sm:text-lg font-medium">Voltar às Opções</h3>
                <p className="text-white/60 text-xs sm:text-sm">Página de jogos</p>
              </div>
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}