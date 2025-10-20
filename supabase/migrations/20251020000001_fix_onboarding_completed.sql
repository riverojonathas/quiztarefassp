-- Add missing onboarding_completed column to user_profiles table
-- This migration should be run manually in Supabase SQL Editor if CLI is not working

-- Add the column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'user_profiles'
                 AND column_name = 'onboarding_completed') THEN
    ALTER TABLE user_profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Column onboarding_completed added to user_profiles';
  ELSE
    RAISE NOTICE 'Column onboarding_completed already exists in user_profiles';
  END IF;
END $$;

-- Update existing profiles to have onboarding_completed = TRUE if they have nickname and avatar_seed
UPDATE user_profiles
SET onboarding_completed = TRUE
WHERE nickname IS NOT NULL AND avatar_seed IS NOT NULL AND onboarding_completed IS FALSE;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles' AND column_name = 'onboarding_completed';