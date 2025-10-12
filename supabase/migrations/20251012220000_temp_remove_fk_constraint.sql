-- Temporarily remove foreign key constraint for development
-- This allows profiles to be created even if user doesn't exist in auth.users
-- WARNING: This should only be used for development - restore constraint in production

-- Drop the foreign key constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;

-- Change user_id column to allow null temporarily (for development flexibility)
ALTER TABLE user_profiles ALTER COLUMN user_id DROP NOT NULL;

-- Add a comment explaining this is temporary
COMMENT ON TABLE user_profiles IS 'User profiles table - FK constraint temporarily disabled for development';