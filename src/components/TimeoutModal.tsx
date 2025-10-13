import { motion } from 'framer-motion';

interface TimeoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  correctAnswer: string;
  skill: string;
}

export default function TimeoutModal({ isOpen, onClose, correctAnswer, skill }: TimeoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full shadow-2xl"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tempo Esgotado!
          </h2>
          <p className="text-gray-600 mb-4">
            Você não conseguiu responder a tempo.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="text-sm text-red-700 mb-1">Resposta correta:</div>
            <div className="font-semibold text-red-900">{correctAnswer}</div>
            <div className="text-xs text-red-600 mt-1">Categoria: {skill}</div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-red-500 text-white rounded-xl py-3 font-semibold hover:bg-red-600 active:scale-95 transition-all duration-300"
          >
            Continuar
          </button>
        </div>
      </motion.div>
    </div>
  );
}