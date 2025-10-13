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