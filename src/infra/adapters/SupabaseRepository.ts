import { UserRepository, UserProfileRepository, QuestionRepository, MatchRepository, LeaderboardRepository } from '../../domain/repositories';
import { User, UserProfile, Question, Match, LeaderboardEntry, UserId, RoomId } from '../../domain/models';
import { supabase } from '../../lib/supabase';
import { dbToUserProfile, userProfileToDb, dbToLeaderboardEntry, leaderboardEntryToDb } from '../../lib/database-mappers';

export class SupabaseRepository implements UserRepository, UserProfileRepository, QuestionRepository, MatchRepository, LeaderboardRepository {
  // UserRepository
  async getUser(id: UserId): Promise<User | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error) return null;
    return { id: data.user_id, name: data.nickname } as User;
  }

  async createUser(user: User): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .insert({ user_id: user.id, nickname: user.name });

    if (error) throw error;
  }

  // UserProfileRepository
  async getUserProfile(userId: UserId): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return dbToUserProfile(data);
  }

  async createUserProfile(profile: UserProfile): Promise<void> {
    const dbProfile = userProfileToDb(profile);
    const { error } = await supabase
      .from('user_profiles')
      .insert(dbProfile);

    if (error) throw error;
  }

  async updateUserProfile(profile: UserProfile): Promise<void> {
    const dbProfile = userProfileToDb(profile);
    const { error } = await supabase
      .from('user_profiles')
      .update(dbProfile)
      .eq('user_id', profile.user_id!);

    if (error) throw error;
  }

  async upsertUserProfile(profile: UserProfile): Promise<void> {
    const dbProfile = userProfileToDb(profile);
    const { error } = await supabase
      .from('user_profiles')
      .upsert(dbProfile, {
        onConflict: 'user_id'
      });

    if (error) throw error;
  }

  // QuestionRepository
  async getQuestionsByDifficulty(difficulty: number): Promise<Question[]> {
    // Temporarily disabled - complex type conversion needed
    return [];
  }

  async getAllQuestions(): Promise<Question[]> {
    // Temporarily disabled - complex type conversion needed
    return [];
  }

  // MatchRepository
  async createMatch(match: Match): Promise<void> {
    // Temporarily disabled - complex type conversion needed
  }

  async getMatch(roomId: RoomId): Promise<Match | null> {
    // Temporarily disabled - complex type conversion needed
    return null;
  }

  async updateMatch(match: Match): Promise<void> {
    // Temporarily disabled - complex type conversion needed
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