import { User, Question, Match, LeaderboardEntry, UserId, RoomId } from './models';

export interface UserRepository {
  getUser(id: UserId): Promise<User | null>;
  createUser(user: User): Promise<void>;
}

export interface QuestionRepository {
  getQuestionsByDifficulty(difficulty: number): Promise<Question[]>;
  getAllQuestions(): Promise<Question[]>;
}

export interface MatchRepository {
  createMatch(match: Match): Promise<void>;
  getMatch(roomId: RoomId): Promise<Match | null>;
  updateMatch(match: Match): Promise<void>;
}

export interface LeaderboardRepository {
  getLeaderboard(scope: string, scopeId: string): Promise<LeaderboardEntry[]>;
  addEntry(entry: LeaderboardEntry): Promise<void>;
}