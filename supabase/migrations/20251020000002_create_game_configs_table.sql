-- Create game_configs table for Solo Game configuration
-- Migration: 20251020000002_create_game_configs_table

CREATE TABLE IF NOT EXISTS game_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type TEXT NOT NULL DEFAULT 'solo_game',
  config_name TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{
    "timeEnabled": true,
    "timePerQuestion": 30,
    "selectedCategories": ["Matemática"],
    "questionCount": 10,
    "scoringMode": "evaluation",
    "penaltyEnabled": true,
    "maxAttempts": 1,
    "shuffleAlternatives": true,
    "randomOrder": true,
    "immediateFeedback": true,
    "soundEnabled": true
  }'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_game_configs_game_type ON game_configs(game_type);
CREATE INDEX IF NOT EXISTS idx_game_configs_active ON game_configs(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_game_configs_created_by ON game_configs(created_by);

-- Enable RLS
ALTER TABLE game_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow admins to manage all configs
CREATE POLICY "Admins can manage all game configs" ON game_configs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Allow users to read active configs (for game play)
CREATE POLICY "Users can read active game configs" ON game_configs
  FOR SELECT USING (is_active = true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_game_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_game_configs_updated_at
  BEFORE UPDATE ON game_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_game_configs_updated_at();

-- Insert default configuration
INSERT INTO game_configs (game_type, config_name, settings, is_active)
VALUES (
  'solo_game',
  'Configuração Padrão',
  '{
    "timeEnabled": true,
    "timePerQuestion": 30,
    "selectedCategories": ["Matemática", "Geografia", "História"],
    "questionCount": 10,
    "scoringMode": "evaluation",
    "penaltyEnabled": true,
    "maxAttempts": 1,
    "shuffleAlternatives": true,
    "randomOrder": true,
    "immediateFeedback": true,
    "soundEnabled": true
  }'::jsonb,
  true
) ON CONFLICT DO NOTHING;