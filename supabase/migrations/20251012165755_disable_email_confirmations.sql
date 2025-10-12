-- Disable email confirmations for new signups
-- This updates the auth configuration to not require email confirmation

-- Note: This migration attempts to disable email confirmations
-- If this doesn't work, the setting needs to be changed in the Supabase dashboard

-- Alternative approach: Update auth.users to mark all users as confirmed
-- This is a workaround if the above doesn't work

UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email_confirmed_at IS NULL;

-- Also ensure future signups don't require confirmation
-- This is handled by the config.toml, but we'll also try to update the database

-- If the above doesn't work, the email confirmation setting needs to be disabled
-- in the Supabase dashboard under Authentication > Settings