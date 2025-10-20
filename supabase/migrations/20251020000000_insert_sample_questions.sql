-- Insert 10 sample questions for testing
INSERT INTO questions (text, type, category, difficulty, choices, correct_answer, explanation, tags) VALUES
('Qual é a capital do Brasil?', 'multiple_choice', 'Geografia', 'easy',
 '["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"]'::jsonb,
 'Brasília',
 'Brasília é a capital federal do Brasil desde 1960, projetada pelo arquiteto Oscar Niemeyer.',
 '["Geografia", "Brasil"]'::jsonb),

('Quanto é 15 + 27?', 'multiple_choice', 'Matemática', 'easy',
 '["42", "41", "43", "40"]'::jsonb,
 '42',
 '15 + 27 = 42. Esta é uma adição básica de números inteiros.',
 '["Matemática", "Adição"]'::jsonb),

('Quem escreveu ''Dom Quixote''?', 'multiple_choice', 'Literatura', 'medium',
 '["Machado de Assis", "Miguel de Cervantes", "José Saramago", "Gabriel García Márquez"]'::jsonb,
 'Miguel de Cervantes',
 '''Dom Quixote'' é considerado o primeiro romance moderno e foi escrito por Miguel de Cervantes em 1605.',
 '["Literatura", "Clássicos"]'::jsonb),

('Qual é o maior planeta do Sistema Solar?', 'multiple_choice', 'Ciências', 'easy',
 '["Saturno", "Júpiter", "Urano", "Netuno"]'::jsonb,
 'Júpiter',
 'Júpiter é o maior planeta do Sistema Solar, com um diâmetro de aproximadamente 143.000 km.',
 '["Ciências", "Astronomia"]'::jsonb),

('Em que ano o Brasil foi descoberto por Pedro Álvares Cabral?', 'multiple_choice', 'História', 'medium',
 '["1492", "1500", "1498", "1502"]'::jsonb,
 '1500',
 'Pedro Álvares Cabral chegou ao Brasil em 22 de abril de 1500, durante sua viagem para as Índias.',
 '["História", "Descobrimento"]'::jsonb),

('Qual é a fórmula química da água?', 'multiple_choice', 'Química', 'easy',
 '["H2O", "CO2", "O2", "H2O2"]'::jsonb,
 'H2O',
 'A água é composta por dois átomos de hidrogênio e um átomo de oxigênio, resultando na fórmula H2O.',
 '["Química", "Fórmulas"]'::jsonb),

('Quem pintou a Mona Lisa?', 'multiple_choice', 'Arte', 'easy',
 '["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"]'::jsonb,
 'Leonardo da Vinci',
 'Leonardo da Vinci pintou a Mona Lisa entre 1503 e 1519, uma das obras de arte mais famosas do mundo.',
 '["Arte", "Renascimento"]'::jsonb),

('Qual é o resultado de 8 × 7?', 'multiple_choice', 'Matemática', 'easy',
 '["54", "56", "58", "52"]'::jsonb,
 '56',
 '8 × 7 = 56. Esta é uma multiplicação básica da tabuada do 7.',
 '["Matemática", "Multiplicação"]'::jsonb),

('Em que continente fica o Egito?', 'multiple_choice', 'Geografia', 'easy',
 '["Ásia", "África", "Europa", "Oceania"]'::jsonb,
 'África',
 'O Egito fica localizado no nordeste da África, com parte de seu território também na Ásia (Península do Sinai).',
 '["Geografia", "Continentes"]'::jsonb),

('Qual é o idioma oficial do Brasil?', 'multiple_choice', 'Linguagens', 'easy',
 '["Espanhol", "Inglês", "Português", "Francês"]'::jsonb,
 'Português',
 'O português é o idioma oficial do Brasil desde a colonização portuguesa no século XVI.',
 '["Linguagens", "Oficial"]'::jsonb);