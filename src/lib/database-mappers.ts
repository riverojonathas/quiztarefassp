// Database types - matching Supabase schema (snake_case)
export interface DbUserProfile {
  id: string;
  user_id: string | null;
  avatar_seed: string | null;
  avatar_url: string | null;
  nickname: string | null;
  role?: 'student' | 'professor' | 'admin' | null; // Made optional temporarily
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notifications: any; // Json from database - using any for Supabase Json type
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

export interface DbLeaderboardEntry {
  id: string;
  scope: string;
  scope_id: string;
  user_id: string | null;
  score: number;
  created_at: string | null;
}

export interface DbQuestion {
  id: string;
  statement: string;
  choices: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  difficulty: number;
  tags: string[];
  skill: string | null;
  time_suggested_sec: number | null;
  image_url: string | null;
  created_at: string | null;
}

export interface DbMatch {
  id: string;
  room_id: string;
  players: Array<{
    userId: string;
    score: number;
    streak: number;
    currentDifficulty: number;
  }>;
  scores: Record<string, number>;
  status: string;
  started_at: string | null;
  ended_at: string | null;
}

// Conversion functions
export function dbToUserProfile(db: DbUserProfile) {
  return {
    id: db.id,
    user_id: db.user_id,
    avatar_seed: db.avatar_seed,
    avatar_url: db.avatar_url,
    nickname: db.nickname,
    role: db.role || 'student', // Default to 'student' if role is not set
    notifications: db.notifications || {
      gameInvites: false,
      dailyReminders: false,
      achievements: false,
      leaderboardUpdates: false,
    },
    theme: db.theme || 'original',
    language: db.language || 'pt-BR',
    diretoria_ensino: db.diretoria_ensino,
    escola: db.escola,
    nivel_escolar: db.nivel_escolar,
    serie: db.serie,
    turma: db.turma,
    onboarding_completed: db.onboarding_completed,
    created_at: db.created_at || '',
    updated_at: db.updated_at || '',
  };
}

export function userProfileToDb(app: import('../domain/models').UserProfile): Partial<DbUserProfile> {
  return {
    id: app.id,
    user_id: app.user_id,
    avatar_seed: app.avatar_seed,
    avatar_url: app.avatar_url,
    nickname: app.nickname,
    role: app.role,
    notifications: app.notifications,
    theme: app.theme,
    language: app.language,
    diretoria_ensino: app.diretoria_ensino,
    escola: app.escola,
    nivel_escolar: app.nivel_escolar,
    serie: app.serie,
    turma: app.turma,
    onboarding_completed: app.onboarding_completed,
    created_at: app.created_at,
    updated_at: app.updated_at,
  };
}

export function dbToLeaderboardEntry(db: DbLeaderboardEntry) {
  return {
    id: db.id,
    scope: db.scope,
    scope_id: db.scope_id,
    user_id: db.user_id,
    score: db.score,
    created_at: db.created_at,
  };
}

export function leaderboardEntryToDb(app: import('../domain/models').LeaderboardEntry): DbLeaderboardEntry {
  return {
    id: app.id,
    scope: app.scope,
    scope_id: app.scope_id,
    user_id: app.user_id,
    score: app.score,
    created_at: app.created_at,
  };
}