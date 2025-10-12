import { UserRepository, UserProfileRepository, QuestionRepository, MatchRepository, LeaderboardRepository } from '../../domain/repositories';
import { User, UserProfile, Question, Match, LeaderboardEntry, UserId, RoomId } from '../../domain/models';
import { supabase } from '../../lib/supabase';

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
    return {
      id: data.id,
      userId: data.user_id,
      avatarSeed: data.avatar_seed,
      avatarUrl: data.avatar_url,
      nickname: data.nickname,
      notifications: data.notifications,
      theme: data.theme,
      language: data.language,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as UserProfile;
  }

  async createUserProfile(profile: UserProfile): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: profile.userId,
        avatar_seed: profile.avatarSeed,
        avatar_url: profile.avatarUrl,
        nickname: profile.nickname,
        notifications: profile.notifications,
        theme: profile.theme,
        language: profile.language,
      });

    if (error) throw error;
  }

  async updateUserProfile(profile: UserProfile): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        avatar_seed: profile.avatarSeed,
        avatar_url: profile.avatarUrl,
        nickname: profile.nickname,
        notifications: profile.notifications,
        theme: profile.theme,
        language: profile.language,
      })
      .eq('user_id', profile.userId);

    if (error) throw error;
  }

  async upsertUserProfile(profile: UserProfile): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: profile.userId,
        avatar_seed: profile.avatarSeed,
        avatar_url: profile.avatarUrl,
        nickname: profile.nickname,
        notifications: profile.notifications,
        theme: profile.theme,
        language: profile.language,
      }, {
        onConflict: 'user_id'
      });

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