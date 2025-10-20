-- Disable RLS completely for development
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Professors and admins can manage questions" ON questions;
DROP POLICY IF EXISTS "Authenticated users can read questions" ON questions;
DROP POLICY IF EXISTS "Allow anonymous inserts for seeding" ON questions;

-- Delete existing questions
DELETE FROM questions;

-- Insert sample questions for testing
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
 '["1808", "1822", "1889", "1500"]'::jsonb, '1822', '["história", "brasil"]'::jsonb),
('Qual é a fórmula química da água?', 'multiple_choice', 'Química', 'easy',
 '["H2O", "CO2", "O2", "H2O2"]'::jsonb, 'H2O', '["química", "fórmula"]'::jsonb),
('Quem pintou a Mona Lisa?', 'multiple_choice', 'Arte', 'medium',
 '["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"]'::jsonb, 'Leonardo da Vinci', '["arte", "renascimento"]'::jsonb),
('Qual é a raiz quadrada de 16?', 'multiple_choice', 'Matemática', 'easy',
 '["2", "4", "8", "16"]'::jsonb, '4', '["matemática", "raiz quadrada"]'::jsonb),
('Qual é o rio mais longo do mundo?', 'multiple_choice', 'Geografia', 'medium',
 '["Amazonas", "Nilo", "Yangtzé", "Mississippi"]'::jsonb, 'Nilo', '["geografia", "rios"]'::jsonb),
('Qual é a unidade básica da vida?', 'multiple_choice', 'Ciências', 'medium',
 '["Átomo", "Molécula", "Célula", "Tecido"]'::jsonb, 'Célula', '["ciências", "biologia"]'::jsonb);
