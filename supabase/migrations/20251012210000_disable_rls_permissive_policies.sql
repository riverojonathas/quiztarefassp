-- Disable Row Level Security for all tables to allow unrestricted access
-- This is a temporary measure for development - RLS should be re-enabled in production

-- Disable RLS on user_profiles table
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop existing policies on user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON user_profiles;

-- Create permissive policies for user_profiles (allow all operations)
CREATE POLICY "Allow all operations on user_profiles" ON user_profiles
  FOR ALL USING (true);

-- Disable RLS on users table if it exists
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Disable RLS on questions table if it exists
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

-- Disable RLS on matches table if it exists
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;

-- Disable RLS on leaderboard table if it exists
ALTER TABLE leaderboard DISABLE ROW LEVEL SECURITY;

-- Create permissive policies for all tables (allow all operations)
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on questions" ON questions FOR ALL USING (true);
CREATE POLICY "Allow all operations on matches" ON matches FOR ALL USING (true);
CREATE POLICY "Allow all operations on leaderboard" ON leaderboard FOR ALL USING (true);
