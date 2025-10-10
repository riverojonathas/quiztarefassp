import { UserRepository, QuestionRepository, MatchRepository, LeaderboardRepository } from '../../domain/repositories';
import { User, Question, Match, LeaderboardEntry, UserId, RoomId } from '../../domain/models';
import { supabase } from '../../lib/supabase';

export class SupabaseRepository implements UserRepository, QuestionRepository, MatchRepository, LeaderboardRepository {
  // UserRepository
  async getUser(id: UserId): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return { id: data.id, name: data.username } as User;
  }

  async createUser(user: User): Promise<void> {
    const { error } = await supabase
      .from('users')
      .insert({ id: user.id, username: user.name });

    if (error) throw error;
  }

  // QuestionRepository
  async getQuestionsByDifficulty(difficulty: number): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('difficulty', difficulty);

    if (error) throw error;
    return data as Question[];
  }

  async getAllQuestions(): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*');

    if (error) throw error;
    return data as Question[];
  }

  // MatchRepository
  async createMatch(match: Match): Promise<void> {
    const { error } = await supabase
      .from('matches')
      .insert(match);

    if (error) throw error;
  }

  async getMatch(roomId: RoomId): Promise<Match | null> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('room_id', roomId)
      .single();

    if (error) return null;
    return data as Match;
  }

  async updateMatch(match: Match): Promise<void> {
    const { error } = await supabase
      .from('matches')
      .update(match)
      .eq('room_id', match.roomId);

    if (error) throw error;
  }

  // LeaderboardRepository
  async getLeaderboard(scope: string, scopeId: string): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('scope', scope)
      .eq('scope_id', scopeId)
      .order('score', { ascending: false });

    if (error) throw error;
    return data as LeaderboardEntry[];
  }

  async addEntry(entry: LeaderboardEntry): Promise<void> {
    const { error } = await supabase
      .from('leaderboard')
      .insert(entry);

    if (error) throw error;
  }
}