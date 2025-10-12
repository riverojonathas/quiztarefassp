'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function TarefasGrupoPage() {
  const router = useRouter();

  const handleBackToPlay = () => {
    router.push('/play');
  };

  const modalities = [
    {
      title: 'Sala de Aula',
      description: 'Tarefas colaborativas para toda a turma, com acompanhamento do professor em tempo real.',
      icon: '🏫',
      color: 'from-blue-500 to-indigo-600',
      features: ['Acompanhamento coletivo', 'Correção em grupo', 'Discussão de respostas']
    },
    {
      title: 'Duplas Competitivas',
      description: 'Compita contra colegas em duplas, combinando estratégia e conhecimento.',
      icon: '👥',
      color: 'from-green-500 to-emerald-600',
      features: ['Pontuação compartilhada', 'Estratégia em dupla', 'Competição amigável']
    },
    {
      title: 'Grupos Grandes',
      description: 'Trabalhe em equipes maiores para resolver desafios complexos juntos.',
      icon: '👨‍👩‍👧‍👦',
      color: 'from-purple-500 to-pink-600',
      features: ['Divisão de tarefas', 'Colaboração intensa', 'Resolução coletiva']
    }
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Tarefas em Grupo</h1>
          <p className="text-lg sm:text-xl text-white/80">Aprenda colaborando com colegas e professores</p>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6 sm:mb-8 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Em Desenvolvimento</h2>
          <p className="text-white/80 text-sm sm:text-base">
            Esta funcionalidade está sendo preparada para oferecer a melhor experiência de aprendizado colaborativo.
            Em breve você poderá competir e aprender com seus colegas!
          </p>
        </div>

        {/* Modalidades */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Modalidades Disponíveis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {modalities.map((modality, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-r ${modality.color} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{modality.icon}</div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{modality.title}</h3>
                  <p className="text-white/90 text-sm sm:text-base">{modality.description}</p>
                </div>
                <div className="space-y-2">
                  {modality.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      <span className="text-white/80 text-xs sm:text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefícios */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center">Benefícios do Aprendizado Colaborativo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🤝</div>
              <h3 className="text-white font-medium mb-1">Trabalho em Equipe</h3>
              <p className="text-white/70 text-xs sm:text-sm">Desenvolva habilidades sociais</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💡</div>
              <h3 className="text-white font-medium mb-1">Ideias Diversas</h3>
              <p className="text-white/70 text-xs sm:text-sm">Aprenda diferentes perspectivas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="text-white font-medium mb-1">Motivação</h3>
              <p className="text-white/70 text-xs sm:text-sm">Competição saudável impulsiona</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="text-white font-medium mb-1">Aprendizado</h3>
              <p className="text-white/70 text-xs sm:text-sm">Reforce conceitos juntos</p>
            </div>
          </div>
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