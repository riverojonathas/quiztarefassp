-- Add onboarding_completed flag to user_profiles
ALTER TABLE user_profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;

-- Update existing profiles to have onboarding_completed = TRUE if they have nickname and avatar_seed
UPDATE user_profiles
SET onboarding_completed = TRUE
WHERE nickname IS NOT NULL AND avatar_seed IS NOT NULL;