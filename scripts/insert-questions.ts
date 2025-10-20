import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Carregar variáveis de ambiente do .env.local
config({ path: '.env.local' });

// Configurações do Supabase (usando variáveis de ambiente)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// 10 questões para inserir no banco
const questions = [
  {
    text: "Qual é a capital do Brasil?",
    type: "multiple_choice",
    category: "Geografia",
    difficulty: "easy",
    choices: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
    correct_answer: "Brasília",
    explanation: "Brasília é a capital federal do Brasil desde 1960, projetada pelo arquiteto Oscar Niemeyer."
  },
  {
    text: "Quanto é 15 + 27?",
    type: "multiple_choice",
    category: "Matemática",
    difficulty: "easy",
    choices: ["42", "41", "43", "40"],
    correct_answer: "42",
    explanation: "15 + 27 = 42. Esta é uma adição básica de números inteiros."
  },
  {
    text: "Quem escreveu 'Dom Quixote'?",
    type: "multiple_choice",
    category: "Literatura",
    difficulty: "medium",
    choices: ["Machado de Assis", "Miguel de Cervantes", "José Saramago", "Gabriel García Márquez"],
    correct_answer: "Miguel de Cervantes",
    explanation: "'Dom Quixote' é considerado o primeiro romance moderno e foi escrito por Miguel de Cervantes em 1605."
  },
  {
    text: "Qual é o maior planeta do Sistema Solar?",
    type: "multiple_choice",
    category: "Ciências",
    difficulty: "easy",
    choices: ["Saturno", "Júpiter", "Urano", "Netuno"],
    correct_answer: "Júpiter",
    explanation: "Júpiter é o maior planeta do Sistema Solar, com um diâmetro de aproximadamente 143.000 km."
  },
  {
    text: "Em que ano o Brasil foi descoberto por Pedro Álvares Cabral?",
    type: "multiple_choice",
    category: "História",
    difficulty: "medium",
    choices: ["1492", "1500", "1498", "1502"],
    correct_answer: "1500",
    explanation: "Pedro Álvares Cabral chegou ao Brasil em 22 de abril de 1500, durante sua viagem para as Índias."
  },
  {
    text: "Qual é a fórmula química da água?",
    type: "multiple_choice",
    category: "Química",
    difficulty: "easy",
    choices: ["H2O", "CO2", "O2", "H2O2"],
    correct_answer: "H2O",
    explanation: "A água é composta por dois átomos de hidrogênio e um átomo de oxigênio, resultando na fórmula H2O."
  },
  {
    text: "Quem pintou a Mona Lisa?",
    type: "multiple_choice",
    category: "Arte",
    difficulty: "easy",
    choices: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correct_answer: "Leonardo da Vinci",
    explanation: "Leonardo da Vinci pintou a Mona Lisa entre 1503 e 1519, uma das obras de arte mais famosas do mundo."
  },
  {
    text: "Qual é o resultado de 8 × 7?",
    type: "multiple_choice",
    category: "Matemática",
    difficulty: "easy",
    choices: ["54", "56", "58", "52"],
    correct_answer: "56",
    explanation: "8 × 7 = 56. Esta é uma multiplicação básica da tabuada do 7."
  },
  {
    text: "Em que continente fica o Egito?",
    type: "multiple_choice",
    category: "Geografia",
    difficulty: "easy",
    choices: ["Ásia", "África", "Europa", "Oceania"],
    correct_answer: "África",
    explanation: "O Egito fica localizado no nordeste da África, com parte de seu território também na Ásia (Península do Sinai)."
  },
  {
    text: "Qual é o idioma oficial do Brasil?",
    type: "multiple_choice",
    category: "Linguagens",
    difficulty: "easy",
    choices: ["Espanhol", "Inglês", "Português", "Francês"],
    correct_answer: "Português",
    explanation: "O português é o idioma oficial do Brasil desde a colonização portuguesa no século XVI."
  }
];

async function insertQuestions() {
  try {
    console.log('Fazendo login como admin...');

    // Fazer login como admin
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@quiztarefas.com',
      password: 'admin123456'
    });

    if (signInError) {
      console.error('Erro ao fazer login:', signInError);
      return;
    }

    console.log('Login realizado com sucesso. Inserindo questões...');

    for (const question of questions) {
      const { error } = await supabase
        .from('questions')
        .insert([question])
        .select();

      if (error) {
        console.error('Erro ao inserir questão:', question.text, error);
      } else {
        console.log('✅ Questão inserida:', question.text);
      }
    }

    console.log('Todas as questões foram processadas!');

    // Fazer logout
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

// Executar apenas se for chamado diretamente
if (require.main === module) {
  insertQuestions();
}

export { insertQuestions };