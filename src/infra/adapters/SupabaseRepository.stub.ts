import {
  UserRepository,
  QuestionRepository,
  MatchRepository,
  LeaderboardRepository,
} from '../../domain/repositories';
import { User, Question, Match, LeaderboardEntry, UserId, RoomId } from '../../domain/models';

// Stub implementation for future Supabase integration
export class SupabaseRepository
  implements UserRepository, QuestionRepository, MatchRepository, LeaderboardRepository
{
  async getUser(id: UserId): Promise<User | null> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async createUser(user: User): Promise<void> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getQuestionsByDifficulty(difficulty: number): Promise<Question[]> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getAllQuestions(): Promise<Question[]> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async createMatch(match: Match): Promise<void> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getMatch(roomId: RoomId): Promise<Match | null> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async updateMatch(match: Match): Promise<void> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getLeaderboard(scope: string, scopeId: string): Promise<LeaderboardEntry[]> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async addEntry(entry: LeaderboardEntry): Promise<void> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }
}