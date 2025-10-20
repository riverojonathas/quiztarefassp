-- Restore proper RLS policies for game_configs
-- Migration: 20251020035527_restore_proper_game_configs_rls

-- Drop temporary policy
DROP POLICY IF EXISTS "Temporary: Allow anonymous full access to game_configs" ON game_configs;

-- Allow authenticated users to manage game configs (admin check is done in frontend)
CREATE POLICY "Authenticated users can manage game configs" ON game_configs
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow anonymous users to read active configs for gameplay
CREATE POLICY "Anonymous users can read active game configs" ON game_configs
  FOR SELECT USING (is_active = true);