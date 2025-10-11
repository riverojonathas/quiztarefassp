export type UserId = string;
export type RoomId = string;
export type Difficulty = 1 | 2 | 3;

export interface User {
  id: UserId;
  name: string;
}

export interface UserProfile {
  id: string;
  userId: UserId;
  avatarSeed?: string;
  avatarUrl?: string;
  nickname?: string;
  notifications: {
    gameInvites: boolean;
    dailyReminders: boolean;
    achievements: boolean;
    leaderboardUpdates: boolean;
  };
  theme: 'light' | 'dark';
  language: string;
  createdAt: string;
  updatedAt: string;
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
  tags: string[]; // ex.: ["BNCC-H1", "Frações"]
  skill?: string; // fake para analytics
  timeSuggestedSec?: number;
  imageUrl?: string; // optional image for visual questions
}

export interface PlayerState {
  userId: UserId;
  score: number;
  streak: number;
  currentDifficulty: Difficulty;
}

export interface Match {
  id: string;
  roomId: RoomId;
  mode: 'solo' | 'dupla' | 'sala';
  round: number;
  totalRounds: number;
  players: PlayerState[];
}

export interface LeaderboardEntry {
  scope: 'turma' | 'escola' | 'serie' | 'de' | 'geral';
  scopeId: string;
  userId: UserId;
  score: number;
}