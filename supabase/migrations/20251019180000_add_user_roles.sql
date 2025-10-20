-- Add role column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN role TEXT DEFAULT 'student' CHECK (role IN ('student', 'professor', 'admin'));

-- Create index for role column for better performance
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Update existing profiles to have 'student' role (default)
UPDATE user_profiles SET role = 'student' WHERE role IS NULL;