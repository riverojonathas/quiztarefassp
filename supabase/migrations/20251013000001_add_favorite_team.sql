-- Add favorite_team field to user_profiles table
ALTER TABLE user_profiles ADD COLUMN favorite_team TEXT;

-- Add comment to the column
COMMENT ON COLUMN user_profiles.favorite_team IS 'User favorite national team for World Cup 2026 theme';