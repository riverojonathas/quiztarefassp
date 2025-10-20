import { GameConfigCalculated } from '@/domain/models';

/**
 * Calcula a pontuação de uma questão baseada na configuração do jogo
 */
export const calculateQuestionScore = (
  config: GameConfigCalculated,
  isCorrect: boolean,
  attemptsUsed: number = 1
): number => {
  if (isCorrect) {
    // Pontuação base por questão
    let score = config.pointsPerQuestion;

    // Aplicar penalidade por tentativas extras se erro habilitado
    if (config.config.settings.penaltyEnabled && attemptsUsed > 1) {
      const penaltyPerAttempt = config.penaltyPerError;
      const totalPenalty = penaltyPerAttempt * (attemptsUsed - 1);
      score = Math.max(0, score - totalPenalty);
    }

    return score;
  }

  return 0; // Resposta incorreta = 0 pontos
};

/**
 * Calcula a pontuação total de um jogo
 */
export const calculateTotalScore = (
  config: GameConfigCalculated,
  results: Array<{
    isCorrect: boolean;
    attemptsUsed: number;
  }>
): number => {
  return results.reduce((total, result) => {
    return total + calculateQuestionScore(config, result.isCorrect, result.attemptsUsed);
  }, 0);
};

/**
 * Calcula a porcentagem de acertos
 */
export const calculateAccuracy = (
  results: Array<{ isCorrect: boolean }>
): number => {
  if (results.length === 0) return 0;

  const correctAnswers = results.filter(r => r.isCorrect).length;
  return Math.round((correctAnswers / results.length) * 100);
};

/**
 * Calcula o tempo médio por questão
 */
export const calculateAverageTime = (
  times: number[]
): number => {
  if (times.length === 0) return 0;

  const total = times.reduce((sum, time) => sum + time, 0);
  return Math.round(total / times.length);
};

/**
 * Formata pontuação para display
 */
export const formatScore = (score: number): string => {
  return score.toFixed(1);
};

/**
 * Formata tempo para display
 */
export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
};

/**
 * Calcula XP baseado na pontuação e dificuldade
 */
export const calculateXp = (
  score: number,
  difficulty: number = 1,
  timeBonus: number = 0
): number => {
  const baseXp = score * 10; // 10 XP por ponto
  const difficultyMultiplier = 1 + (difficulty - 1) * 0.2; // +20% por nível de dificuldade
  const totalXp = Math.round(baseXp * difficultyMultiplier + timeBonus);

  return Math.max(0, totalXp);
};

/**
 * Determina o nível baseado no XP total
 */
export const calculateLevel = (totalXp: number): number => {
  // Fórmula: nível = floor(sqrt(XP / 100)) + 1
  // Ex: 0 XP = nível 1, 100 XP = nível 2, 400 XP = nível 3, etc.
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
};

/**
 * Calcula XP necessário para o próximo nível
 */
export const xpForNextLevel = (currentLevel: number): number => {
  // XP necessário = (nível)^2 * 100
  return currentLevel * currentLevel * 100;
};

/**
 * Calcula progresso no nível atual (0-100)
 */
export const levelProgress = (totalXp: number): number => {
  const currentLevel = calculateLevel(totalXp);
  const currentLevelXp = xpForNextLevel(currentLevel - 1);
  const nextLevelXp = xpForNextLevel(currentLevel);
  const progressXp = totalXp - currentLevelXp;
  const requiredXp = nextLevelXp - currentLevelXp;

  return Math.min(100, Math.round((progressXp / requiredXp) * 100));
};