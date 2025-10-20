export type UserId = string;
export type RoomId = string;
export type Difficulty = 1 | 2 | 3;

export interface User {
  id: UserId;
  name: string;
}

export interface UserProfile {
  id: string;
  user_id: UserId | null;
  avatar_seed: string | null;
  avatar_url: string | null;
  nickname: string | null;
  role: 'student' | 'professor' | 'admin' | null;
  notifications: {
    gameInvites: boolean;
    dailyReminders: boolean;
    achievements: boolean;
    leaderboardUpdates: boolean;
  } | null;
  theme: string | null;
  language: string | null;
  diretoria_ensino: string | null;
  escola: string | null;
  nivel_escolar: string | null;
  serie: string | null;
  turma: string | null;
  onboarding_completed: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  statement: string;
  choices: Choice[];
  difficulty: Difficulty;
  tags: string[];
  skill: string | null;
  time_suggested_sec: number | null;
  image_url: string | null;
  created_at: string | null;
}

export interface PlayerState {
  userId: UserId;
  score: number;
  streak: number;
  currentDifficulty: Difficulty;
}

export interface Match {
  id: string;
  room_id: string;
  players: PlayerState[];
  scores: Record<UserId, number>;
  status: string;
  started_at: string | null;
  ended_at: string | null;
}

export interface LeaderboardEntry {
  id: string;
  scope: string;
  scope_id: string;
  user_id: UserId | null;
  score: number;
  created_at: string | null;
}

// Game Configuration Types
export type GameType = 'solo_game' | 'multiplayer' | 'tournament';

export type ScoringMode = 'evaluation' | 'practice';

export type QuestionCategory =
  | 'Matemática'
  | 'Geografia'
  | 'Literatura'
  | 'Ciências'
  | 'História'
  | 'Química'
  | 'Arte'
  | 'Biologia'
  | 'Física'
  | 'Inglês'
  | 'Português';

export interface GameConfigSettings {
  // Time controls
  timeEnabled: boolean;
  timePerQuestion: number; // seconds (10-60)

  // Question selection
  selectedCategories: QuestionCategory[];
  questionCount: number; // 5-20

  // Scoring system
  scoringMode: ScoringMode;
  penaltyEnabled: boolean;

  // Game mechanics
  maxAttempts: number; // 1-3
  shuffleAlternatives: boolean;
  randomOrder: boolean;

  // Feedback & UX
  immediateFeedback: boolean;
  soundEnabled: boolean;
}

export interface GameConfig {
  id: string;
  game_type: GameType;
  config_name: string;
  settings: GameConfigSettings;
  is_active: boolean;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Calculated values for game play
export interface GameConfigCalculated {
  config: GameConfig;
  pointsPerQuestion: number; // 10 / questionCount
  penaltyPerError: number; // pointsPerQuestion * 0.25 (when penaltyEnabled)
  totalPossiblePoints: number; // Always 10
}

// Default configurations
export const DEFAULT_GAME_CONFIG_SETTINGS: GameConfigSettings = {
  timeEnabled: true,
  timePerQuestion: 30,
  selectedCategories: ['Matemática', 'Geografia', 'História'],
  questionCount: 10,
  scoringMode: 'evaluation',
  penaltyEnabled: true,
  maxAttempts: 1,
  shuffleAlternatives: true,
  randomOrder: true,
  immediateFeedback: true,
  soundEnabled: true,
};

// Predefined templates
export const GAME_CONFIG_TEMPLATES: Record<string, GameConfigSettings> = {
  relaxed: {
    ...DEFAULT_GAME_CONFIG_SETTINGS,
    timeEnabled: false,
    questionCount: 5,
    scoringMode: 'practice',
    penaltyEnabled: false,
  },
  quickChallenge: {
    ...DEFAULT_GAME_CONFIG_SETTINGS,
    timePerQuestion: 10,
    questionCount: 5,
    scoringMode: 'evaluation',
    penaltyEnabled: true,
  },
  fullAssessment: {
    ...DEFAULT_GAME_CONFIG_SETTINGS,
    timeEnabled: true,
    timePerQuestion: 45,
    questionCount: 15,
    scoringMode: 'evaluation',
    penaltyEnabled: true,
  },
};