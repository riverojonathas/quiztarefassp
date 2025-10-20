-- Temporarily allow anonymous inserts for seeding data
-- This will be reverted after seeding

-- Drop the restrictive policy temporarily
DROP POLICY IF EXISTS "Professors and admins can manage questions" ON questions;

-- Allow anonymous inserts for seeding
CREATE POLICY "Allow anonymous inserts for seeding" ON questions
FOR INSERT WITH CHECK (true);

-- Insert sample questions
INSERT INTO questions (text, type, category, difficulty, choices, correct_answer, explanation, tags) VALUES
('Qual é a capital do Brasil?', 'multiple_choice', 'Geografia', 'easy',
 '["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"]'::jsonb,
 'Brasília',
 'Brasília é a capital federal do Brasil desde 1960.',
 '["Geografia", "Brasil"]'::jsonb),

('Quanto é 15 + 27?', 'multiple_choice', 'Matemática', 'easy',
 '["42", "41", "43", "40"]'::jsonb,
 '42',
 '15 + 27 = 42.',
 '["Matemática", "Adição"]'::jsonb),

('Quem escreveu "Dom Quixote"?', 'multiple_choice', 'Literatura', 'medium',
 '["Machado de Assis", "Miguel de Cervantes", "José Saramago", "Gabriel García Márquez"]'::jsonb,
 'Miguel de Cervantes',
 '"Dom Quixote" é considerado o primeiro romance moderno.',
 '["Literatura", "Clássicos"]'::jsonb),

('Qual é o maior planeta do Sistema Solar?', 'multiple_choice', 'Ciências', 'easy',
 '["Saturno", "Júpiter", "Urano", "Netuno"]'::jsonb,
 'Júpiter',
 'Júpiter é o maior planeta do Sistema Solar.',
 '["Ciências", "Astronomia"]'::jsonb),

('Em que ano o Brasil foi descoberto por Pedro Álvares Cabral?', 'multiple_choice', 'História', 'medium',
 '["1492", "1500", "1498", "1502"]'::jsonb,
 '1500',
 'Pedro Álvares Cabral chegou ao Brasil em 1500.',
 '["História", "Descobrimento"]'::jsonb);

-- Restore the original restrictive policy
DROP POLICY IF EXISTS "Allow anonymous inserts for seeding" ON questions;

CREATE POLICY "Professors and admins can manage questions" ON questions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role IN ('professor', 'admin')
  )
);