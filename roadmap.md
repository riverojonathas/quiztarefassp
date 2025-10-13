# Quiz App - MVP Completo

![Status](https://img.shields.io/badge/Status-Completo-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

Um app de perguntas e respostas competitivo, estilo "Perguntados", construído com Next.js + TypeScript. **Aplicação completa com 3 sprints implementados**: MVP funcional, melhorias de acessibilidade/performance, e infraestrutura de produção.

## 🚀 Funcionalidades Principais

### 🎯 Navegação Reorganizada
- **🏠 Home**: Página inicial com estatísticas pessoais e ranking consolidado
- **🏆 Ranking**: Ver classificações globais
- **▶️ Jogar**: Escolha entre 3 modos: "Jogar sozinho", "Trilha de Tarefas" ou "Tarefas em Grupo"
- **📚 Trilha de Tarefas**: Sistema de progressão educacional com fases
- **👥 Tarefas em Grupo**: Aprendizado colaborativo (em desenvolvimento)

## 📋 Roadmap e Funcionalidades Futuras

Este documento descreve as expansões planejadas para o app, organizadas em passos incrementais. O foco é evoluir de um MVP básico para um sistema educacional completo, com ênfase em configuração, modalidades e colaboração.

### ✅ **Implementado Recentemente**
- **Layout Mobile Otimizado**: Reorganização da página `/play` com texto no topo, botões centralizados e botão inferior fixo (sem scroll)
- **Página Trilha de Tarefas**: Sistema de 6 fases educacionais com cards visuais e status "Em breve"
- **Página Tarefas em Grupo**: Explicação das modalidades colaborativas com banner "Em desenvolvimento"
- **Texto Renovado**: "Escolha seu Modo de Jogo" para melhor comunicação educacional
- **Interface de Configurações Otimizada**: 
  - Avatar clicável ao lado do campo de apelido (layout mais eficiente)
  - Nova seção "Segurança" dedicada para alteração de senha
  - Remoção de títulos desnecessários ("Perfil")
  - Menu responsivo aprimorado (4 abas: Perfil, Segurança, Notificações, Tema)
  - Email do usuário exibido corretamente do Supabase Auth

### 1. **Front-end para Cadastro de Questões**
   - **Objetivo**: Permitir que usuários (professores/admin) cadastrem, editem e excluam questões diretamente no app.
   - **Funcionalidades**:
     - Formulário para criar questões (statement, choices, correct_answer, skill, time_limit).
     - Upload de imagens/mídia para questões.
     - Validação e preview antes de salvar.
     - Integração com tabela `questions` no Supabase.
   - **Passos**: Criar página `/admin/questions`, usar shadcn/ui para forms, adicionar RLS para controle de acesso.
   - **Status**: Não iniciado.

### 2. **Jogo Configurável**
   - **Objetivo**: Tornar o jogo personalizável por usuário/professor.
   - **Funcionalidades**:
     - Configurações por jogo: Número de questões, tempo limite global, skills selecionadas.
     - Salvar configurações como "modelos" reutilizáveis.
     - Interface de drag-and-drop para organizar questões.
   - **Passos**: Adicionar estado/config no solo game, persistir em localStorage ou Supabase.
   - **Status**: Não iniciado.

### 3. **Vários Modelos de Jogos**
   - **Objetivo**: Oferecer diversidade de experiências de jogo.
   - **Modalidades Planejadas**:
     - **Trilha Obrigatória com Fases (Solo)**: Jogador avança fases sequenciais, cada uma com configuração própria (ex.: fase 1 = 5 questões fáceis, fase 2 = 10 médias). Progresso salvo no perfil.
     - **Jogar com Colegas (Grupo)**: 
       - Salas criadas por professor/aluno.
       - Entrada via código/invite.
       - Professor cria tarefas, usa questões prontas ou modelos de jogos.
       - Modo competitivo em tempo real (pontuação compartilhada).
     - **Outros Modelos Futuros**: Quiz por tempo, desafio diário, torneios.
   - **Passos**: 
     - Implementar rota `/game/[mode]` para diferentes tipos.
     - Usar WebSockets (ex.: Supabase Realtime) para salas multiplayer.
     - Criar tabelas para `game_sessions`, `rooms`, `tasks`.
   - **Status**: Não iniciado.

### 4. **Módulo Professor**
   - **Objetivo**: Criar um painel dedicado para professores gerenciarem alunos, jogos e conteúdos.
   - **Funcionalidades**:
     - Dashboard com visão geral de turmas, progresso de alunos e estatísticas.
     - Criar e gerenciar salas de jogo.
     - Atribuir tarefas e metas personalizadas para alunos.
     - Acessar ferramentas de criação de questões e modelos de jogos.
     - Relatórios de desempenho por aluno/turma.
   - **Passos**: Criar página `/professor/dashboard`, integrar com tabelas de usuários e jogos, adicionar permissões baseadas em roles.
   - **Status**: Não iniciado.

### 5. **Sistema de Fases Configuráveis**
   - **Objetivo**: Permitir criação e configuração de fases personalizadas para jogos.
   - **Funcionalidades**:
     - Interface para criar fases (ex.: nome, dificuldade, número de questões, skills obrigatórias).
     - Sequenciamento automático ou manual de fases.
     - Bloqueio/desbloqueio baseado em progresso (ex.: completar fase 1 para acessar fase 2).
     - Salvamento de progresso por usuário.
   - **Passos**: Criar tabela `phases` no Supabase, integrar com `user_profiles` para progresso, adicionar UI no módulo professor.
   - **Status**: Não iniciado.

### 6. **Relacionamentos Educacionais**
   - **Objetivo**: Vincular usuários a estruturas educacionais para organização e relatórios.
   - **Funcionalidades**:
     - Campos em perfil: Série (ex.: 1º ano), Escola, Turma, Diretoria de Ensino.
     - Hierarquia: Diretoria > Escola > Turma > Aluno.
     - Filtros e relatórios por nível (ex.: desempenho por escola).
     - Importação em lote (ex.: CSV) para cadastro de alunos.
   - **Passos**: Adicionar campos à tabela `user_profiles`, criar tabelas `schools`, `classes`, `districts`, atualizar forms de cadastro/onboarding.
   - **Status**: Não iniciado.

### 7. **Metas e Progresso**
   - **Objetivo**: Definir e rastrear metas educacionais para alunos.
   - **Funcionalidades**:
     - Metas por aluno (ex.: completar 10 jogos por mês, acertar 80% das questões).
     - Notificações de progresso (ex.: "Você está a 50% da meta!").
     - Relatórios visuais (gráficos de progresso).
     - Recompensas por cumprir metas (ex.: badges, pontos extras).
   - **Passos**: Criar tabela `goals` no Supabase, integrar com hooks de notificação, adicionar UI no perfil e dashboard professor.
   - **Status**: Não iniciado.

### 8. **Tematização Dinâmica**
   - **Objetivo**: Permitir temas visuais baseados em datas comemorativas ou eventos.
   - **Funcionalidades**:
     - Temas pré-definidos (ex.: Halloween, Natal, Copa do Mundo, Dia das Crianças).
     - Interface para criar temas personalizados (cores, ícones, backgrounds).
     - Ativação automática por data ou manual.
     - Reversão fácil ao tema padrão.
     - Adaptação automática de componentes (ex.: botões, cards).
   - **Passos**: Criar tabela `themes` no Supabase, usar CSS variables/Tailwind para troca dinâmica, adicionar painel de controle no admin.
   - **Status**: Não iniciado.

### 9. **Passos Gerais para Implementação**
   - **Passo 1**: Atualizar README e planejar arquitetura (ex.: novas tabelas no Supabase).
   - **Passo 2**: Implementar cadastro de questões e jogo configurável (solo).
   - **Passo 3**: Adicionar módulo professor e fases configuráveis.
   - **Passo 4**: Desenvolver relacionamentos educacionais e metas.
   - **Passo 5**: Implementar tematização e salas multiplayer.
   - **Passo 6**: Testes, otimização e deploy.
   - **Considerações**: Priorizar acessibilidade, performance e segurança. Usar branches Git para features.
   - **Itens Inacabados**: Integração do solo game com Supabase (questões mockadas), onboarding flag aplicada mas sem testes extensivos, signout básico sem confirmação avançada.

## 🛠️ Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- Supabase account

### Passos
1. Clone o repositório: `git clone https://github.com/your-repo/quiztarefassp.git`
2. Instale dependências: `npm install`
3. Configure Supabase: Copie `.env.example` para `.env.local` e adicione suas chaves.
4. Execute migrations: `supabase db push`
5. Rode o app: `npm run dev`

## 🚀 Deploy
- **Vercel**: Conecte o repositório e configure variáveis de ambiente.
- **CI/CD**: GitHub Actions para testes automáticos.

## 📝 Contribuição
Siga os passos do roadmap. Abra issues para discussões e PRs para implementações.

---

*Última atualização: 12 de outubro de 2025*