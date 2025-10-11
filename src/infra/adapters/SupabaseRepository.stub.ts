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
  async getUser(_id: UserId): Promise<User | null> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async createUser(_user: User): Promise<void> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getQuestionsByDifficulty(_difficulty: number): Promise<Question[]> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getAllQuestions(): Promise<Question[]> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async createMatch(_match: Match): Promise<void> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getMatch(_roomId: RoomId): Promise<Match | null> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async updateMatch(_match: Match): Promise<void> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getLeaderboard(_scope: string, _scopeId: string): Promise<LeaderboardEntry[]> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async addEntry(_entry: LeaderboardEntry): Promise<void> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }
}