-- Fix game_configs RLS policies - final version
-- Migration: 20251020035253_fix_game_configs_rls_final

-- Drop all existing policies for game_configs
DROP POLICY IF EXISTS "Admins can manage all game configs" ON game_configs;
DROP POLICY IF EXISTS "Authenticated users can manage game configs" ON game_configs;
DROP POLICY IF EXISTS "Users can read active game configs" ON game_configs;

-- Create simple permissive policies for testing
-- Allow authenticated users to do everything
CREATE POLICY "Allow authenticated users full access to game_configs" ON game_configs
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow anonymous users to read active configs only
CREATE POLICY "Allow anonymous users to read active game_configs" ON game_configs
  FOR SELECT USING (is_active = true);