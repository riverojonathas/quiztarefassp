-- Temporarily disable RLS for seeding
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

-- Delete existing questions
DELETE FROM questions;

-- Insert sample questions
INSERT INTO questions (text, type, category, difficulty, choices, correct_answer, tags) VALUES
('Quanto é 2 + 2?', 'multiple_choice', 'Matemática', 'easy', 
 '["2", "3", "4", "5"]'::jsonb, '4', '["matemática", "aritmética"]'::jsonb),
('Qual é a capital do Brasil?', 'multiple_choice', 'Geografia', 'easy',
 '["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"]'::jsonb, 'Brasília', '["geografia", "brasil"]'::jsonb),
('Quem escreveu "Dom Casmurro"?', 'multiple_choice', 'Literatura', 'medium',
 '["Machado de Assis", "José de Alencar", "Monteiro Lobato", "Carlos Drummond de Andrade"]'::jsonb, 'Machado de Assis', '["literatura", "brasileira"]'::jsonb),
('Qual é o maior planeta do Sistema Solar?', 'multiple_choice', 'Ciências', 'easy',
 '["Terra", "Marte", "Júpiter", "Saturno"]'::jsonb, 'Júpiter', '["ciências", "astronomia"]'::jsonb),
('Em que ano ocorreu a Independência do Brasil?', 'multiple_choice', 'História', 'medium',
 '["1808", "1822", "1889", "1500"]'::jsonb, '1822', '["história", "brasil"]'::jsonb);

-- Re-enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
