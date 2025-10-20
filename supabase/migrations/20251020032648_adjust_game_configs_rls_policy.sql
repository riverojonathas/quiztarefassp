-- Adjust game_configs RLS policy to allow authenticated users to manage configs
-- Migration: 20251020032648_adjust_game_configs_rls_policy

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admins can manage all game configs" ON game_configs;

-- Create a more permissive policy for testing (allow authenticated users)
CREATE POLICY "Authenticated users can manage game configs" ON game_configs
  FOR ALL USING (auth.role() = 'authenticated');

-- Keep the read policy for active configs (users can still read active configs)
-- The existing policy "Users can read active game configs" should remain