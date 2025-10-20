-- Temporary: Allow anonymous operations on game_configs for testing
-- Migration: 20251020035442_temp_allow_anon_game_configs

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users full access to game_configs" ON game_configs;
DROP POLICY IF EXISTS "Allow anonymous users to read active game_configs" ON game_configs;

-- Allow anonymous users full access temporarily for testing
CREATE POLICY "Temporary: Allow anonymous full access to game_configs" ON game_configs
  FOR ALL USING (true);