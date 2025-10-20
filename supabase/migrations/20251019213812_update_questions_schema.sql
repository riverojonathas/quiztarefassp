-- Update questions table to match the new schema
-- Add new columns and update existing ones

-- Add new columns
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS text TEXT,
ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('multiple_choice', 'true_false', 'essay')),
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS correct_answer TEXT,
ADD COLUMN IF NOT EXISTS explanation TEXT,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Change difficulty column type to TEXT first
ALTER TABLE questions ALTER COLUMN difficulty TYPE TEXT;

-- Convert difficulty number to enum values
UPDATE questions SET difficulty = CASE
  WHEN difficulty = '1' THEN 'easy'
  WHEN difficulty = '2' THEN 'medium'
  WHEN difficulty = '3' THEN 'hard'
  ELSE 'medium'
END WHERE difficulty NOT IN ('easy', 'medium', 'hard');

-- Add constraint for difficulty (ignore if exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'questions_difficulty_check') THEN
    ALTER TABLE questions ADD CONSTRAINT questions_difficulty_check
    CHECK (difficulty IN ('easy', 'medium', 'hard'));
  END IF;
END $$;

-- Update existing data to new format
-- Convert statement to text
UPDATE questions SET text = statement WHERE text IS NULL;

-- Set default type as multiple_choice for existing questions
UPDATE questions SET type = 'multiple_choice' WHERE type IS NULL;

-- Set default category as 'Matemática' for existing questions (can be updated later)
UPDATE questions SET category = 'Matemática' WHERE category IS NULL;

-- For existing questions, assume first choice is correct (this needs manual review)
UPDATE questions SET correct_answer = (choices->>0) WHERE correct_answer IS NULL AND jsonb_array_length(choices) > 0;

-- Add constraint for type (ignore if exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'questions_type_check') THEN
    ALTER TABLE questions ADD CONSTRAINT questions_type_check
    CHECK (type IN ('multiple_choice', 'true_false', 'essay'));
  END IF;
END $$;

-- Make text column NOT NULL
ALTER TABLE questions ALTER COLUMN text SET NOT NULL;

-- Drop old columns that are no longer needed
ALTER TABLE questions
DROP COLUMN IF EXISTS statement,
DROP COLUMN IF EXISTS skill,
DROP COLUMN IF EXISTS time_suggested_sec;

-- Rename image_url to imageUrl for consistency
ALTER TABLE questions RENAME COLUMN image_url TO imageUrl;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_created_by ON questions(created_by);

-- Update RLS policies for the new structure
DROP POLICY IF EXISTS "Allow all operations on questions" ON questions;

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Allow professors and admins to manage questions
CREATE POLICY "Professors and admins can manage questions" ON questions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role IN ('professor', 'admin')
  )
);

-- Allow all authenticated users to read questions
CREATE POLICY "Authenticated users can read questions" ON questions
FOR SELECT USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();