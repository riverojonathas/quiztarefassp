import {
  UserRepository,
  QuestionRepository,
  MatchRepository,
  LeaderboardRepository,
} from '../../domain/repositories';
import { User, Question, Match, LeaderboardEntry, UserId, RoomId } from '../../domain/models';

export class InMemoryRepository
  implements UserRepository, QuestionRepository, MatchRepository, LeaderboardRepository
{
  private users: Map<UserId, User> = new Map();
  private questions: Question[] = [];
  private matches: Map<RoomId, Match> = new Map();
  private leaderboard: LeaderboardEntry[] = [];

  // For loading from Supabase or other sources
  async loadFromExternal(repo: { getAllQuestions: () => Promise<Question[]>, getLeaderboard: (scope: string, scopeId: string) => Promise<LeaderboardEntry[]> }) {
    try {
      this.questions = await repo.getAllQuestions();
      this.leaderboard = await repo.getLeaderboard('geral', 'all');
    } catch (_error) {
      console.warn('Failed to load from external repo, using mock data');
    }
  }

  // UserRepository
  async getUser(id: UserId): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async createUser(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  // QuestionRepository
  async getQuestionsByDifficulty(difficulty: number): Promise<Question[]> {
    return this.questions.filter(q => q.difficulty === difficulty);
  }

  async getAllQuestions(): Promise<Question[]> {
    return this.questions;
  }

  // For loading mocked data
  setQuestions(questions: Question[]): void {
    this.questions = questions;
  }

  // MatchRepository
  async createMatch(match: Match): Promise<void> {
    this.matches.set(match.room_id, match);
  }

  async getMatch(roomId: RoomId): Promise<Match | null> {
    return this.matches.get(roomId) || null;
  }

  async updateMatch(match: Match): Promise<void> {
    this.matches.set(match.room_id, match);
  }

  // LeaderboardRepository
  async getLeaderboard(scope: string, scopeId: string): Promise<LeaderboardEntry[]> {
    return this.leaderboard.filter(entry => entry.scope === scope && entry.scope_id === scopeId);
  }

  async addEntry(entry: LeaderboardEntry): Promise<void> {
    this.leaderboard.push(entry);
  }

  // For loading mocked leaderboard
  setLeaderboard(entries: LeaderboardEntry[]): void {
    this.leaderboard = entries;
  }
}