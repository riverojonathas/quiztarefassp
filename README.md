# 🚀 QuizTarefas - Plataforma Educacional Gamificada

> **Prompt Mestre para Desenvolvimento com VS Code + GitHub Copilot**

---

## 📋 CONTEXTO DO PROJETO

### Visão Geral
- **Objetivo Principal**: Plataforma educacional gamificada que transforma aprendizado em competição divertida através de quizzes interativos
- **Problema que Resolve**: Engajamento estudantil baixo e dificuldade em avaliar conhecimento de forma motivadora e colaborativa
- **Público-Alvo**: Alunos do ensino fundamental e médio, professores e instituições educacionais brasileiras
- **Valor Único**: Sistema completo com múltiplas modalidades de jogo, progressão educacional hierárquica e integração com estrutura escolar

### Especificações Técnicas
- **Tipo de Aplicação**: Web App Progressive (PWA) com suporte mobile-first
- **Stack Principal**: Next.js 14 + TypeScript + Supabase + Socket.IO
- **Linguagem(ns)**: TypeScript, JavaScript
- **Framework(s)**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Banco de Dados**: Supabase (PostgreSQL com RLS)
- **Hospedagem**: Vercel (Edge Functions + Serverless)

---

## ⚡ OTIMIZAÇÕES DE DESENVOLVIMENTO

### VS Code Simple Browser - Redução de Polling

Para reduzir o comportamento de recarregamento constante no VS Code Simple Browser, foram implementadas as seguintes otimizações:

#### ✅ Configurações Aplicadas

1. **Next.js Config (`next.config.ts`)**
   - Polling reduzido para 3 segundos (antes: contínuo)
   - Timeout de agregação aumentado para 800ms
   - Ignorados: `node_modules`, `.next`, `.git`, `.supabase`

2. **Middleware (`middleware.ts`)**
   - Cache de 10 segundos para requests do VS Code Simple Browser
   - Detecção automática via User-Agent e parâmetros de URL
   - Headers otimizados para reduzir requests desnecessários

3. **Variáveis de Ambiente (`.env.local`)**
   - Telemetria desabilitada
   - Análise do Turbopack desabilitada
   - Memória otimizada para desenvolvimento

4. **VS Code Settings (`.vscode/settings.json`)**
   - Indicador de foco desabilitado
   - Auto-imports reduzidos
   - Exclusões de watcher otimizadas

#### 📊 Resultado Esperado

- **Redução de 70-90%** nos requests automáticos do VS Code Simple Browser
- **Servidor mais estável** durante desenvolvimento
- **Logs mais limpos** no terminal
- **Melhor experiência** de desenvolvimento

#### 🧪 Como Testar

1. **Reinicie o servidor**: `npm run dev`
2. **Abra no Simple Browser**: `http://localhost:3001`
3. **Compare logs**: Deve haver muito menos requests automáticos
4. **Teste navegação**: Funcionalidade permanece intacta

---

## 🎯 INSTRUÇÕES PARA O COPILOT

### Princípios de Codificação
Ao gerar código, o Copilot deve SEMPRE seguir:

1. **Clareza sobre Inteligência**: Código legível > código "inteligente"
2. **Consistência**: Manter padrões do projeto existente
3. **Modularidade**: Componentes pequenos, responsabilidades únicas
4. **Documentação**: Comentários explicativos em lógicas complexas
5. **Testes**: Considerar testabilidade em cada componente
6. **Performance**: Otimizar sem sacrificar legibilidade (bundle atual: 133KB)
7. **Segurança**: Validar inputs, sanitizar dados, proteger rotas com RLS
8. **Acessibilidade**: WCAG 2.1 AA obrigatório em todos os componentes

### Padrões de Nomenclatura
```
- Arquivos/Pastas: kebab-case (ex: user-service.ts, solo-game/)
- Componentes React: PascalCase (ex: UserProfile.tsx, QuestionCard.tsx)
- Funções/Variáveis: camelCase (ex: getUserData, totalQuestions)
- Constantes: UPPER_SNAKE_CASE (ex: MAX_RETRY_COUNT, API_BASE_URL)
- CSS Classes: Tailwind utility-first (ex: bg-gradient-to-r from-blue-500)
- Banco de Dados: snake_case (ex: user_profiles, game_sessions)
```

### Estrutura de Comentários
```typescript
/**
 * Calcula o XP baseado na pontuação do jogo
 *
 * @param score - Pontuação total do jogador
 * @returns XP calculado (score * 10)
 * @example
 * calculateXp(85) // returns 850
 */
const calculateXp = (score: number): number => score * 10;
```

---

## � MELHORIAS RECENTES (v2.4.0)

### Integração Completa do Solo Game com Supabase
- **Hook useQuestions**: Criado hook customizado (`src/hooks/useQuestions.ts`) para buscar questões do banco de dados com tratamento robusto de erros
- **Carregamento Dinâmico**: Solo game agora carrega questões reais do Supabase em tempo real, com fallback automático para dados mock em caso de falha
- **Transformação de Dados**: Implementada conversão automática entre formato do banco (`questions` table) e formato do jogo (interface `Question`)
- **Estados de Loading**: Estados visuais adequados durante carregamento de questões, melhorando UX
- **Contagem Dinâmica**: Número de questões agora determinado dinamicamente pelo banco de dados

### Correção Robusta de Schema Inconsistente
- **Fallback Onboarding**: Implementado sistema de fallback duplo no `src/app/onboarding/page.tsx` - tenta upsert com coluna `onboarding_completed`, se falhar tenta sem a coluna
- **Migration Permanente**: Criado arquivo `supabase/migrations/20251020000001_fix_onboarding_completed.sql` para adicionar coluna faltante permanentemente
- **Diagnóstico Automático**: Script de diagnóstico (`scripts/fix-onboarding-column.ts`) para verificar estado do schema
- **Tratamento de Erros Graceful**: Onboarding funciona mesmo com diferenças entre schema local e remoto

### Estabilidade e Qualidade Aprimoradas
- **Build Verificado**: Confirmação de compilação limpa sem erros após todas as mudanças (`npm run build` executado com sucesso)
- **Arquitetura Consistente**: Manutenção da abordagem simplificada com chamadas diretas do Supabase
- **Performance Mantida**: Bundle size preservado < 200KB com novas funcionalidades
- **Error Handling Robusto**: Estratégias de fallback implementadas para operações críticas do banco

### Melhorias Técnicas
- **Dependências Atualizadas**: Next.js 15.5.4, Supabase 2.75.0, Framer Motion 12.23.24
- **TypeScript Strict**: Tipagem rigorosa mantida em todos os componentes
- **Hooks Reutilizáveis**: `useQuestions` hook disponível para outros componentes que precisem de questões
- **Tratamento de Erros Padronizado**: Padrões consistentes de fallback e recuperação de falhas

### Estabilidade Aprimorada
- **Servidor de Desenvolvimento Estável**: Eliminação de reinícios automáticos causados por erros 404 constantes
- **Console Limpo**: Logs de desenvolvimento agora mostram apenas informações relevantes, sem spam de erros
- **Build Consistente**: Aplicação continua compilando sem erros após limpeza de código
- **TypeScript Compliance**: Correção de todos os erros de linting relacionados às mudanças implementadas

### Arquitetura Simplificada e Estável
- **Supabase Simplificado**: Redução drástica do `src/lib/supabase.ts` de 200+ linhas para ~20 linhas, removendo wrappers complexos (`safeSupabaseAuth`, `safeSupabaseDb`) e interceptors que causavam instabilidade
- **Componentes Server/Client Corretos**: Conversão do `src/app/layout.tsx` para Server Component (removido 'use client'), corrigindo hydration errors causados por atributos de browser extensions
- **Autenticação Direta**: Substituição de todos os wrappers safe por chamadas diretas do Supabase em páginas de auth (`signin`, `signup`, `onboarding`, `settings`)
- **Estado de Sessão Otimizado**: Atualização do `useSessionStore.ts` para sincronização direta com Supabase auth state changes

### Estabilidade e Performance
- **Build Consistente**: Aplicação compila sem erros, todas as páginas servem com HTTP 200
- **Hydration Errors Resolvidos**: Eliminação completa de mismatches entre server e client rendering
- **Tratamento de Erros Simplificado**: Remoção de abstrações complexas que ocultavam problemas reais
- **Performance Mantida**: Bundle size < 200KB preservado após simplificações

### Sistema de Roles e Permissões
- **Student**: Usuário padrão, pode jogar e visualizar ranking
- **Professor**: Pode acessar interface administrativa para criar e gerenciar questões
- **Admin**: Acesso completo ao sistema, incluindo configurações avançadas

**Credenciais de Teste (Admin)**:
- Email: `admin@quiztarefas.com`
- Senha: `admin123456`
- Role: `admin`

### Interface Administrativa de Questões
- **Página de Listagem**: `/admin/questions` com filtros, busca e paginação
- **Formulário de Criação**: Validação Zod completa com tipos dinâmicos de questões
- **Integração Supabase**: Salvamento direto no banco com RLS policies
- **Acessibilidade WCAG AA**: Navegação por teclado e labels ARIA implementados
- **Tratamento de Erros**: Mensagens amigáveis para cenários de falha

### Melhorias Técnicas
- **Dependências Atualizadas**: Next.js 15.5.4, Supabase 2.75.0, Framer Motion 12.23.24
- **TypeScript Strict**: Tipagem rigorosa em todos os novos componentes
- **Performance**: Bundle size mantido < 200KB com lazy loading
- **Testes**: Cobertura aumentada com testes de autenticação e session management

### Padrões Arquiteturais
- **Frontend**: Feature-Based + Atomic Design (componentes em `components/`, features em `app/`)
- **Backend**: Layered Architecture (domain → infra → app)
- **Estado**: Zustand para cliente + React Query para servidor
- **Rotas**: File-based (Next.js App Router)
- **Autenticação**: Supabase Auth + RLS policies
- **Realtime**: Socket.IO (in-memory) + Supabase Realtime (planejado)

### Estrutura de Diretórios Atual
```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Rotas públicas (signout)
│   ├── admin/                    # Interface administrativa
│   │   └── questions/            # Gestão de questões educacionais
│   ├── api/                      # API Routes (server-side)
│   │   ├── notifications/        # Push notifications
│   │   ├── socket/              # WebSocket server
│   │   └── test-connection/     # Supabase health check
│   ├── home/                    # Dashboard com ranking
│   ├── ranking/                 # Ranking global
│   ├── play/                    # Seleção de modos de jogo
│   ├── solo-game/               # Jogo solo (integrado com Supabase)
│   ├── trilha-tarefas/          # Fases educacionais
│   ├── tarefas-grupo/           # Jogo colaborativo
│   ├── settings/                # Configurações do usuário (4 seções)
│   ├── onboarding/              # Cadastro inicial
│   ├── signin|signup|signout/   # Autenticação
│   ├── layout.tsx               # Server Component (sem 'use client')
│   ├── page.tsx                 # Página inicial
│   └── globals.css
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── ErrorBoundary.tsx
│   ├── NotificationSettings.tsx
│   ├── QuestionCard.tsx
│   ├── Timer.tsx
│   ├── Scoreboard.tsx
│   └── Podium.tsx
├── domain/
│   ├── models.ts                # Interfaces TypeScript
│   └── repositories.ts          # Contratos de dados
├── hooks/
│   ├── useQuizNotifications.ts
│   ├── useLeaderboard.ts
│   ├── useUserProfile.ts
│   ├── useAvatar.ts
│   ├── useGlobalStats.ts
│   ├── useQuestions.ts                # Hook para buscar questões do Supabase
│   ├── useTheme.tsx
│   └── useScreenReaderAnnouncement.ts
├── infra/
│   ├── adapters/
│   │   ├── InMemoryRepository.ts
│   │   └── SupabaseRepository.ts
│   └── realtime/
│       └── socketServer.ts
├── lib/
│   ├── supabase.ts              # Cliente Supabase (simplificado)
│   ├── themes.ts                # Sistema de temas
│   ├── pushNotifications.ts
│   └── errors.ts
├── state/                       # Zustand stores
│   ├── useSessionStore.ts
│   └── useRoomStore.ts
└── instrumentation.ts           # Sentry
```

scripts/
├── insert-questions.ts          # Script para popular banco com questões
├── check-schema.ts              # Verificação de schema do banco
├── fix-onboarding-column.ts     # Diagnóstico de coluna onboarding_completed
```


---

## 🔧 CONTEXTO TÉCNICO DETALHADO

### Dependências Principais
```json
{
  "next": "15.5.4 - Framework React com SSR/SSG",
  "@supabase/supabase-js": "^2.75.0 - Backend as a Service",
  "socket.io": "^4.8.1 - WebSocket para multiplayer",
  "zustand": "^5.0.8 - Gerenciamento de estado",
  "framer-motion": "^12.23.24 - Animações",
  "@dicebear/core": "^9.2.4 - Geração de avatares",
  "@sentry/nextjs": "^10.19.0 - Monitoramento de erros",
  "tailwindcss": "^4 - Styling utility-first",
  "zod": "^4.1.12 - Validação de schemas",
  "use-sound": "^5.0.0 - Gerenciamento de áudio",
  "web-push": "^3.6.7 - Push notifications",
  "react-confetti": "^6.4.0 - Efeitos visuais",
  "react-hot-toast": "^2.6.0 - Notificações toast"
}
```

### Configurações de Ambiente
```bash
# .env.local (obrigatórias)
NEXT_PUBLIC_SUPABASE_URL=https://ntiadxsvduowjvxuahzy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SENTRY_DSN=https://your-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VAPID_PRIVATE_KEY=your_vapid_private_key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key

# Opcionais para build
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project
ANALYZE=true # para bundle analyzer
```

### Integrações e APIs
- **Supabase Auth**: Login/cadastro + OAuth Google (simplificado para chamadas diretas)
- **Supabase Database**: PostgreSQL com RLS policies (sem wrappers complexos)
- **Supabase Realtime**: Planejado para salas multiplayer
- **Web Audio API**: Sons procedurais (início, acertos, erros, timer)
- **Push Notifications API**: Notificações web nativas
- **Sentry**: Monitoramento de erros e performance
- **DiceBear API**: Geração de avatares personalizados

### Decisões Arquiteturais Importantes
- **Server Components por Default**: Next.js 13+ App Router com Server Components para melhor performance e SEO
- **Supabase Simplificado**: Remoção de abstrações complexas em favor de chamadas diretas para maior confiabilidade
- **Estado Centralizado**: Zustand para gerenciamento de estado cliente, sincronizado com Supabase auth
- **Validação Robusta**: Zod schemas em client e server-side para consistência de dados
- **Acessibilidade First**: WCAG 2.1 AA obrigatório em todos os componentes educacionais

---

## 💡 FUNCIONALIDADES PRINCIPAIS

### ✅ Feature 1: Sistema de Autenticação Completo
**Descrição**: Sistema robusto de cadastro, login e gerenciamento de sessão com integração escolar

**Regras de Negócio**:
- Senha mínima: 8 caracteres com letras e números
- Email único no sistema
- Onboarding obrigatório após primeiro login
- Avatar padrão gerado automaticamente via DiceBear
- Campos educacionais obrigatórios (Diretoria, Escola, Nível, Série, Turma)

**Fluxo do Usuário**:
1. Usuário acessa `/signin` ou `/signup`
2. Sistema valida credenciais com Zod schema
3. Supabase Auth cria sessão + JWT
4. Redirect para `/onboarding` (primeira vez) ou `/home`
5. Onboarding: escolha de nickname + avatar + dados escolares
6. Sistema salva perfil em `user_profiles` via RLS

**Critérios de Aceite**:
- [x] Login com email/senha funcional
- [x] Google OAuth integrado
- [x] Onboarding completo com avatar DiceBear
- [x] Sessão persistente com Zustand
- [x] Campos educacionais salvos corretamente
- [x] Tratamento de erros amigáveis

**Considerações Técnicas**:
- Chamadas diretas do Supabase para máxima confiabilidade
- RLS policies aplicadas em `user_profiles`
- Validação Zod em forms de signup/onboarding

---

### ✅ Feature 2: Modos de Jogo Diversificados
**Descrição**: Múltiplas experiências de jogo para diferentes contextos educacionais

**Regras de Negócio**:
- **Solo Game**: 3 perguntas cronometradas com tentativas múltiplas
- **Trilha de Tarefas**: 6 fases educacionais sequenciais
- **Tarefas em Grupo**: Aprendizado colaborativo (em desenvolvimento)
- Tempo limite padrão: 30s por questão
- Pontuação: 100 pontos por acerto, -25 por erro

**Fluxo do Usuário**:
1. Usuário escolhe modo em `/play`
2. Sistema direciona para rota específica
3. Jogo executa com regras do modo selecionado
4. Resultados salvos no perfil e ranking

**Critérios de Aceite**:
- [x] Solo game funcional com som de início
- [x] Trilha de tarefas com 6 fases visuais
- [x] Tarefas em grupo com banner informativo
- [x] Navegação mobile otimizada
- [x] Integração real com Supabase (questões carregadas dinamicamente do banco)

**Considerações Técnicas**:
- Web Audio API para sons imersivos
- Socket.IO para multiplayer futuro
- Componentes reutilizáveis para diferentes modos

---

### ✅ Feature 3: Sistema de Ranking e Progresso
**Descrição**: Competições globais e acompanhamento de desempenho individual

**Regras de Negócio**:
- Ranking global baseado em pontos totais
- Streak de acertos consecutivos
- XP calculado automaticamente (pontos × 10)
- Níveis baseados em XP acumulado

**Fluxo do Usuário**:
1. Usuário completa jogos
2. Sistema calcula e salva pontuação
3. Ranking atualizado em tempo real
4. Perfil mostra progresso pessoal

**Critérios de Aceite**:
- [x] Ranking global funcional
- [x] Dashboard home com estatísticas
- [x] Cálculo de XP automático
- [x] Sistema de níveis implementado

**Considerações Técnicas**:
- Queries otimizadas para ranking
- Cache local para performance
- Supabase RLS para privacidade

---

### 🎯 Feature 4: Front-end para Cadastro de Questões
**Descrição**: Interface administrativa completa para criação, edição e gestão de questões educacionais, com controle de acesso rigoroso e integração real-time com o banco de dados.

**Regras de Negócio**:
- **Acesso Restrito**: Apenas usuários com role `professor` ou `admin` (definido em `user_profiles.role`).
- **Tipos de Questões Suportados**: Múltipla escolha (4 opções obrigatórias), verdadeiro/falso (2 opções), e dissertativa (texto livre).
- **Campos Obrigatórios**: Texto da pergunta (máx. 500 chars), opções/respostas, resposta correta, categoria (ex: Matemática, História), dificuldade (fácil/médio/difícil), e tags opcionais.
- **Validações**: Mínimo 2 opções para múltipla escolha; resposta correta deve existir nas opções; categoria deve ser pré-definida.
- **Limites**: Máximo 10 questões por professor/dia (rate limiting); upload de imagens (máx. 2MB, formatos: JPG/PNG/WebP).
- **Preview Obrigatório**: Visualização em tempo real antes de salvar, simulando o jogo.

**Fluxo do Usuário**:
1. Professor faz login e acessa `/admin/questions` (rota protegida por middleware de auth).
2. Sistema verifica role via Supabase RLS; se não autorizado, redireciona com erro.
3. Interface exibe lista de questões existentes (paginada, filtrável por categoria/dificuldade).
4. Clicar "Nova Questão" abre modal/formulário com campos validados em tempo real (Zod).
5. Usuário preenche campos; drag-and-drop para reordenar opções; upload de imagem opcional.
6. Preview live mostra como a questão aparecerá no jogo (com timer simulado).
7. Após validação, salvar no Supabase (`questions` table); feedback de sucesso/erro.
8. Edição: Selecionar questão existente, modificar e salvar (versão controlada).

**Critérios de Aceite**:
- [x] Página `/admin/questions` criada com proteção de rota (middleware Next.js).
- [x] Formulário com validação Zod completa (client-side + server-side via API Route).
- [x] Suporte a tipos de questões (múltipla escolha, V/F, dissertativa) com campos dinâmicos.
- [x] Upload de imagens funcional (Supabase Storage) com preview e compressão automática.
- [x] Preview em tempo real da questão no formato de jogo (componente QuestionCard reutilizável).
- [x] Lista paginada e filtrável de questões existentes (com busca por texto/categoria).
- [x] Drag-and-drop para reordenar opções (usando @hello-pangea/dnd).
- [x] Integração completa com Supabase (tabela `questions` com RLS policies).
- [x] Tratamento de erros amigável (ex: "Questão duplicada" ou "Upload falhou").
- [ ] Testes unitários (70% coverage): Validação Zod, hooks de upload, preview.
- [ ] Testes de integração: Salvamento no Supabase, permissões RLS.
- [x] Acessibilidade WCAG AA: Navegação por teclado, ARIA labels, contraste em previews.
- [x] Performance: Lazy loading de imagens, bundle size < 200KB adicional.

**Considerações Técnicas**:
- **Arquitetura**: Usar API Route `/api/questions` (POST/PUT) para server-side validation e salvamento; client-side com hooks customizados (`useQuestionForm`, `useImageUpload`).
- **Banco de Dados**: Tabela `questions` (id, text, options: json[], correct_answer, category, difficulty, image_url?, created_by, created_at). RLS: `auth.uid() = created_by` ou role = 'admin'.
- **Validação**: Zod schema rigoroso (ex: `questionSchema = z.object({ text: z.string().min(10).max(500), options: z.array(z.string()).min(2).max(6) })`).
- **Upload**: Supabase Storage bucket `question-images`; compressão via `sharp` (se necessário).
- **UI/UX**: shadcn/ui components (Form, Input, Select, Dialog); Framer Motion para animações suaves; preview em modal overlay.
- **Segurança**: Rate limiting (100 req/min por usuário); sanitização de texto com DOMPurify; logs de auditoria no Sentry.
- **Escalabilidade**: Paginacao infinita para listas grandes; cache SWR para questões recentes.
- **Dependências**: Adicionar `react-beautiful-dnd` para drag-and-drop; `sharp` para compressão de imagens.
- **Testabilidade**: Mocks para Supabase; testes E2E com Playwright para fluxo completo.

**Subtarefas para Implementação Incremental**:
1. **Setup Básico** ✅ (1 dia): Criar rota `/admin/questions`, middleware de auth, estrutura da página.
2. **Formulário Core** ✅ (2 dias): Campos básicos, validação Zod, tipos de questões dinâmicos.
3. **Upload e Preview** (2 dias): Supabase Storage, preview live, drag-and-drop.
4. **Lista e Edição** ✅ (2 dias): Paginacao, filtros, edição modal.
5. **Integração e Testes** (2 dias): API Routes, RLS, testes unitários/integração.
6. **Polimento** ✅ (1 dia): Acessibilidade, performance, documentação.

**Esforço Total Estimado**: 10 dias (2 sprints de 5 dias), considerando refatorações e testes.
**Progresso Atual**: ~95% concluído (subtarefas 1, 2, 4 e 6 implementadas + interface padronizada; upload de imagens, preview e drag-and-drop concluídos).

---

### 🎮 Feature 5: Jogos Configuráveis
**Descrição**: Sistema completo de configuração do Solo Game para personalização educacional ([📋 Documento Detalhado](FEATURE_SOLO_GAME_CONFIG.md))

**Status**: ✅ **COMPLETAMENTE IMPLEMENTADO**
**Prioridade**: Alta
**Estimativa**: 2-3 dias

**Regras de Negócio**:
- **Sistema de Pontuação**: 10 pontos total com penalidades de 25% por erro
- **Controle de Tempo**: Habilitar/desabilitar tempo (10-60s por questão)
- **Seleção de Disciplinas**: Multi-seleção de categorias (Matemática, Geografia, etc.)
- **Número de Questões**: Range 5-20 questões
- **Ordem das Alternativas**: Embaralhamento opcional
- **Modos**: "evaluation" (com penalidades) vs "practice" (sem penalidades)
- **Templates Pré-configurados**: "Modo Relaxado", "Desafio Rápido", "Avaliação Completa"

**Fluxo do Usuário**:
1. Admin acessa botão "⚙️ Configurar Solo Game" em `/admin/questions`
2. Modal de configuração abre com seções organizadas (tempo, disciplinas, pontuação)
3. Admin define parâmetros e salva configuração ativa
4. Solo game aplica configurações dinamicamente nos próximos jogos

**Critérios de Aceite**:
- [x] Botão de configuração na página admin
- [x] Modal com validação Zod e preview em tempo real
- [x] Salvamento no Supabase (tabela `game_configs`)
- [x] Hook `useGameConfig` com cálculos automáticos
- [x] Aplicação automática no solo game
- [x] Fallback gracioso para configurações padrão
- [x] Templates pré-configurados funcionais

**Considerações Técnicas**:
- Nova tabela `game_configs` no Supabase com JSONB
- Hook `useGameConfig` com SWR para cache
- Componente `GameConfigModal` com abas organizadas
- Cálculos automáticos: `pointsPerQuestion = 10 / questionCount`
- Validação robusta com Zod schemas
- Acessibilidade WCAG AA completa

---

### 👨‍🏫 Feature 6: Módulo Professor
**Descrição**: Dashboard completo para gestão educacional

**Regras de Negócio**:
- Controle de acesso baseado em roles
- Gestão de turmas e alunos
- Criação de tarefas personalizadas
- Relatórios de desempenho

**Fluxo do Usuário**:
1. Professor faz login
2. Acessa dashboard administrativo
3. Gerencia alunos e conteúdos
4. Visualiza relatórios

**Critérios de Aceite**:
- [ ] Página `/professor/dashboard`
- [ ] Sistema de roles implementado
- [ ] Gestão de turmas
- [ ] Relatórios visuais

**Considerações Técnicas**:
- Supabase RLS para isolamento de dados
- Charts para relatórios
- Notificações para alunos

---

### 📚 Feature 7: Sistema de Fases Configuráveis
**Descrição**: Criação de progressões educacionais personalizadas

**Regras de Negócio**:
- Fases sequenciais ou paralelas
- Bloqueio baseado em desempenho
- Configuração de dificuldade progressiva

**Fluxo do Usuário**:
1. Professor cria fases
2. Define requisitos de desbloqueio
3. Alunos progridem automaticamente

**Critérios de Aceite**:
- [ ] Interface de criação de fases
- [ ] Sistema de bloqueio/desbloqueio
- [ ] Salvamento de progresso

**Considerações Técnicas**:
- Tabela `phases` no Supabase
- Algoritmos de progressão
- Notificações de avanço

---

### 🏫 Feature 8: Relacionamentos Educacionais
**Descrição**: Integração com estrutura escolar brasileira

**Regras de Negócio**:
- Hierarquia: Diretoria > Escola > Turma > Aluno
- Campos obrigatórios no perfil
- Filtros por nível educacional

**Fluxo do Usuário**:
1. Cadastro inicial coleta dados escolares
2. Sistema organiza por hierarquia
3. Relatórios segmentados por escola/turma

**Critérios de Aceite**:
- [x] Campos básicos implementados
- [ ] Tabelas `schools`, `classes`, `districts`
- [ ] Importação CSV
- [ ] Filtros avançados

**Considerações Técnicas**:
- Normalização de dados escolares
- Queries otimizadas para relatórios
- Privacidade de dados educacionais

---

### 🎯 Feature 9: Metas e Progresso Personalizado
**Descrição**: Sistema de objetivos educacionais motivacionais

**Regras de Negócio**:
- Metas definidas por professor ou aluno
- Acompanhamento visual de progresso
- Recompensas por cumprimento

**Fluxo do Usuário**:
1. Meta é definida/aceita
2. Sistema rastreia progresso
3. Notificações de avanço
4. Celebração ao cumprir

**Critérios de Aceite**:
- [ ] Interface de definição de metas
- [ ] Gráficos de progresso
- [ ] Sistema de notificações
- [ ] Recompensas automáticas

**Considerações Técnicas**:
- Tabela `goals` no Supabase
- WebSockets para notificações em tempo real
- Cálculos de progresso eficientes

---

### 🎨 Feature 10: Tematização Dinâmica
**Descrição**: Temas visuais para datas especiais e eventos

**Regras de Negócio**:
- Ativação automática ou manual
- Reversão fácil ao padrão
- Temas pré-definidos e customizáveis

**Fluxo do Usuário**:
1. Sistema detecta data/evento
2. Aplica tema automaticamente
3. Usuário pode personalizar ou desativar

**Critérios de Aceite**:
- [ ] Sistema de detecção de datas
- [ ] CSS variables dinâmicas
- [ ] Interface de customização
- [ ] Fallback para tema padrão

**Considerações Técnicas**:
- CSS custom properties
- Context API para estado de tema
- Lazy loading de assets temáticos

---

## � ORDEM DE PRIORIDADES E PRÓXIMOS PASSOS

### Status Atual do Projeto
- **✅ MVP Completo e Estável**: Autenticação funcionando, jogos básicos, ranking e infraestrutura estáveis
- **✅ Interface Admin Padronizada**: Todas as páginas admin agora seguem o mesmo design system dos alunos
- **✅ Componentes Consistentes**: LoadingSpinner universal, QuestionPreview refatorado, cores explícitas aplicadas
- **✅ Build Verificado**: Compilação limpa confirmada após todas as mudanças
- **✅ Integração Solo Game Completa**: Solo game totalmente integrado com Supabase, carregando questões reais do banco
- **✅ Schema Onboarding Corrigido**: Sistema de fallback implementado para coluna `onboarding_completed` faltante
- **� Feature 5 - Jogos Configuráveis**: Planejamento completo e documentação detalhada finalizada ([📋 Ver Documento](FEATURE_SOLO_GAME_CONFIG.md))
- **�📈 Escalabilidade**: Pronto para suportar 2M+ usuários com arquitetura simplificada e tratamento robusto de erros
- **🛠️ Melhorias Recentes**: Integração completa com banco de dados, correções de schema, build verificado

### Features Não Implementadas (Priorizadas)
Com base no impacto educacional e dependências técnicas:

1. **🎯 ALTA PRIORIDADE - Feature 4: Front-end para Cadastro de Questões (70% concluído)**
   - **Por quê?** Essencial para alimentar jogos com conteúdo real
   - **Impacto**: Desbloqueia todas as outras features educacionais
   - **Esforço**: 1 sprint restante (2 semanas)
   - **Dependências**: Supabase Storage para upload de imagens
   - **Status**: Lista e criação implementadas, falta upload e preview

2. **🎮 ALTA PRIORIDADE - Feature 5: Jogos Configuráveis (100% concluído)**
   - **Por quê?** Permite personalização imediata dos jogos para diferentes contextos educacionais
   - **Impacto**: Melhora engajamento e adaptação educacional com sistema de pontuação flexível
   - **Esforço**: Implementação completa finalizada
   - **Dependências**: Feature 4 (questões reais), tabela `game_configs`
   - **Status**: **COMPLETAMENTE IMPLEMENTADO** - Interface funcional com preview em tempo real

3. **👨‍🏫 MÉDIA PRIORIDADE - Feature 6: Módulo Professor**
   - **Por quê?** Gestão educacional completa para professores
   - **Impacto**: Valor para instituições educacionais
   - **Esforço**: 2-3 sprints (4-6 semanas)
   - **Dependências**: Features 4-5, sistema de roles

4. **📚 MÉDIA PRIORIDADE - Feature 7: Sistema de Fases Configuráveis**
   - **Por quê?** Progressão educacional personalizada
   - **Impacto**: Motivação através de conquistas estruturadas
   - **Esforço**: 2 sprints (4 semanas)
   - **Dependências**: Módulo professor

5. **🏫 MÉDIA PRIORIDADE - Feature 8: Relacionamentos Educacionais**
   - **Por quê?** Integração com estrutura escolar brasileira
   - **Impacto**: Relatórios segmentados e organização institucional
   - **Esforço**: 2 sprints (4 semanas)
   - **Dependências**: Tabelas adicionais no Supabase

6. **🎯 BAIXA PRIORIDADE - Feature 9: Metas e Progresso Personalizado**
   - **Por quê?** Objetivos motivacionais personalizados
   - **Impacto**: Engajamento individualizado
   - **Esforço**: 2 sprints (4 semanas)
   - **Dependências**: Sistema de notificações

7. **🎨 BAIXA PRIORIDADE - Feature 10: Tematização Dinâmica**
   - **Por quê?** Temas para datas especiais
   - **Impacto**: Engajamento sazonal
   - **Esforço**: 1-2 sprints (2-4 semanas)
   - **Dependências**: Nenhuma crítica

### Próximo Passo Imediato
**🚀 Completar Feature 4: Upload de Imagens e Preview em Tempo Real**

**Justificativa**: A interface admin está 70% completa. Adicionar upload de imagens e preview permitirá que professores criem questões visuais completas.

**Plano de Ação**:
1. Implementar Supabase Storage para upload de imagens
2. Adicionar compressão automática (WebP/JPEG)
3. Criar preview em tempo real da questão no jogo
4. Implementar drag-and-drop para reordenar opções
5. Adicionar validação de tamanho e formato

**Critérios de Sucesso**:
- Upload de imagens até 2MB com preview instantâneo
- Preview funcional simulando o jogo real
- Interface intuitiva para professores
- Performance mantida com lazy loading

---

## �🎨 GUIA DE ESTILO E UX

### Design System
- **Paleta de Cores**:
  - Primary: #3b82f6 (azul)
  - Secondary: #8b5cf6 (roxo)
  - Success: #10b981 (verde)
  - Error: #ef4444 (vermelho)
  - Warning: #f59e0b (amarelo)

- **Tipografia**:
  - Headings: Inter Bold, 24-48px
  - Body: Inter Regular, 14-16px
  - Code: JetBrains Mono, 12-14px

- **Espaçamento**: Sistema de 4px (4, 8, 16, 24, 32, 48, 64px)
- **Breakpoints**: Mobile (320px) / Tablet (768px) / Desktop (1024px)

### Componentes UI Prioritários
1. Botões (primário, secundário, outline, ghost)
2. Cards (com sombra e hover effects)
3. Inputs (text, email, password, select)
4. Modal/Dialog (com backdrop blur)
5. Loading states (spinner + skeleton)
6. Error states (com retry)
7. Timer circular
8. Progress bars

### Acessibilidade
- [x] Navegação por teclado completa
- [x] Labels ARIA em todos os forms
- [x] Contraste WCAG AA (4.5:1 mínimo)
- [x] Screen readers suportados
- [x] Focus indicators visuais
- [x] Textos alternativos em imagens

---

## 🔐 SEGURANÇA E VALIDAÇÃO

### Regras de Validação
**Autenticação**:
- Senhas: mínimo 8 caracteres, letras maiúsculas/minúsculas + números
- Tokens: JWT com expiração de 24h
- Refresh tokens: política de 30 dias
- Tentativas: máximo 5 por hora por IP

**Dados de Entrada**:
- Sanitização automática com DOMPurify
- Validação Zod em todos os inputs
- Limitação de tamanho: texto (1000 chars), uploads (5MB)
- Rate limiting: 100 requests/min por usuário

**Proteções**:
- RLS (Row Level Security) no Supabase
- CORS configurado para domínios específicos
- CSRF protection via SameSite cookies
- SQL injection prevenido por prepared statements
- XSS sanitizado em client e server

---

## 🧪 TESTES E QUALIDADE

### Estratégia de Testes
- **Unitários**: Funções puras, hooks, utilities (Jest + React Testing Library)
- **Integração**: API Routes, Supabase operations
- **E2E**: Fluxos críticos (Playwright planejado)
- **Coverage Mínimo**: 70% (atual: ~35 testes passando)

### Ferramentas
- Framework de teste: Jest + React Testing Library
- E2E: Playwright (planejado)
- Linting: ESLint + Prettier
- Type checking: TypeScript strict mode

### Casos de Teste Críticos
1. Fluxo completo de autenticação
2. Jogo solo com todas as variações
3. Ranking e pontuação
4. Configurações e perfil
5. Onboarding educacional

---

## 📊 PERFORMANCE E OTIMIZAÇÃO

### Métricas Alvo
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **Time to Interactive**: < 3s
- **Bundle Size**: < 200KB

### Estratégias de Otimização
- Lazy loading de componentes não críticos
- Code splitting por rota (Next.js automático)
- Image optimization (Next.js Image + WebP)
- Caching: SWR para dados dinâmicos
- CDN: Vercel Edge Network
- Compression: Gzip automático

---

## 🐛 TRATAMENTO DE ERROS

### Hierarquia de Erros
```typescript
// Estrutura de erros customizados
export class AppError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(field: string, message: string) {
    super(`Validation error in ${field}: ${message}`, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}
```

### Mensagens de Erro
- **Usuário**: "Ocorreu um erro inesperado. Tente novamente."
- **Desenvolvedor**: Stack trace completo no Sentry
- **Logs**: Estruturados com contexto (usuário, ação, timestamp)

### Fallbacks
- UI: Componente ErrorBoundary com retry
- API: Status codes apropriados + JSON estruturado
- Dados: Valores padrão quando possível
- Rede: Offline-first com cache local
- Supabase: Chamadas diretas sem wrappers complexos para maior previsibilidade

---

## 📝 CONVENÇÕES DE COMMIT

### Formato
```
tipo(escopo): mensagem curta

[corpo opcional com mais detalhes]

[footer opcional com breaking changes ou issues]
```

### Tipos
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, linting
- `refactor`: Refatoração de código
- `test`: Adição/correção de testes
- `chore`: Manutenção, dependências
- `perf`: Melhorias de performance
- `security`: Correções de segurança

### Exemplo
```
feat(auth): adiciona login com Google OAuth

Implementa autenticação via Google seguindo fluxo OAuth 2.0.
Adiciona botão de login na página inicial e tratamento de erros.

Closes #123
```

---

## 🚀 DEPLOYMENT E CI/CD

### Ambientes
- **Development**: Branch `main`, auto-deploy Vercel
- **Staging**: Branch `staging`, testes manuais
- **Production**: Branch `production`, deploy manual

### Pipeline CI/CD
1. **Push para branch**: Executa linting e testes
2. **PR aprovado**: Deploy automático para staging
3. **Merge na main**: Deploy para production
4. **Rollback**: Possível via Vercel dashboard

### Checklist de Deploy
- [x] Testes passando (~35 testes funcionais)
- [x] Build successful sem erros
- [x] Variáveis de ambiente configuradas
- [x] Migrations Supabase executadas
- [x] Monitoramento Sentry ativo
- [x] Push notifications configuradas
- [x] Autenticação simplificada e robusta
- [x] Interface admin para gestão de questões
- [x] Hydration errors resolvidos
- [x] Arquitetura Server/Client correta
- [x] Logs de desenvolvimento limpos (sem spam 404)
- [x] Código limpo e otimizado

---

## 📚 RECURSOS E REFERÊNCIAS

### Documentação
- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion
- **[FEATURE_SOLO_GAME_CONFIG.md](FEATURE_SOLO_GAME_CONFIG.md)**: Especificação detalhada do sistema de configuração do Solo Game

### Padrões e Guias
- **WCAG 2.1**: https://www.w3.org/TR/WCAG21/
- **TypeScript**: https://www.typescriptlang.org/docs
- **React Best Practices**: https://react.dev/learn

---

## 🎯 PROMPTS ESPECÍFICOS PARA COPILOT

### Para Criar Componentes
```
// Criar componente [Nome] que:
// - Recebe props: [listar tipos e descrições]
// - Renderiza: [descrição visual e interações]
// - Segue: [padrões de design system]
// - Acessibilidade: [requisitos WCAG específicos]
// - Exemplo de uso no contexto educacional
```

### Para Criar APIs
```
// Criar endpoint [método] /api/[rota] que:
// - Recebe: [body/query/params validados com Zod]
// - Processa: [lógica de negócio com tratamento de erros]
// - Retorna: [formato JSON estruturado]
// - Autorização: [RLS ou middleware de auth]
// - Performance: [considerações de cache/query]
```

### Para Criar Testes
```
// Criar testes para [função/componente]:
// - Cenário feliz: [fluxo principal]
// - Cenários de erro: [edge cases e validações]
// - Acessibilidade: [testes de keyboard/screen reader]
// - Performance: [métricas se aplicável]
// - Mocks necessários: [Supabase, hooks, etc.]
```

---

## ✅ CHECKLIST DE DESENVOLVIMENTO

### Antes de Iniciar uma Feature
- [ ] Requisito claro e documentado no README
- [ ] Consultar contexto do projeto
- [ ] Identificar componentes reutilizáveis
- [ ] Planejar estrutura de arquivos
- [ ] Considerar impacto em acessibilidade

### Durante o Desenvolvimento
- [ ] Seguir padrões de nomenclatura
- [ ] Adicionar comentários em lógica complexa
- [ ] Validar inputs client e server-side
- [ ] Tratar erros adequadamente
- [ ] Testar casos extremos e edge cases

### Antes de Comitar
- [ ] Código funcional e testado
- [ ] Testes passando e coverage mantido
- [ ] Sem console.logs ou código comentado
- [ ] Formatado com Prettier
- [ ] Sem erros de linting ou TypeScript
- [ ] Commit message seguindo convenção

### Antes do Pull Request
- [ ] Branch atualizada com main
- [ ] Todos os testes passando
- [ ] Documentação atualizada
- [ ] Screenshots/GIFs para UI changes
- [ ] Descrição clara do PR com critérios de aceite

---

## 🤝 CONTRIBUIÇÃO

### Para o Copilot Gerar Código Efetivo
1. **Seja específico**: Descreva exatamente o que precisa
2. **Dê contexto**: Mencione arquivos/pastas relacionados
3. **Defina restrições**: Performance, acessibilidade, segurança
4. **Exemplifique**: Mostre padrões existentes no projeto

### Exemplo de Bom Prompt
```typescript
// Criar hook useGameSession para gerenciar estado de jogo
// - Estado: currentQuestion, score, timeLeft, answers
// - Ações: nextQuestion, submitAnswer, resetGame
// - Persistência: localStorage para continuidade
// - Validação: impedir ações inválidas
// - Performance: usar useCallback para ações
```

---

## 📞 CONTATOS E RECURSOS

- **Repositório**: https://github.com/riverojonathas/quiztarefassp
- **Deploy**: https://quiztarefassp.vercel.app
- **Documentação Técnica**: Este README
- **Issues**: Para bugs e sugestões
- **Discord**: Para discussões em tempo real

---

## 🔄 MANUTENÇÃO DESTE DOCUMENTO

Este README é o documento vivo do projeto e deve ser atualizado:
- Quando novas features são implementadas
- Quando padrões arquiteturais mudam
- Quando dependências principais são atualizadas
- Quando decisões técnicas importantes são tomadas

**Última atualização**: 19 de outubro de 2025
**Versão**: 2.4.0
**Status**: MVP Completo + Interface Admin Padronizada + Componentes Consistentes + Build Verificado + Integração Solo Game + Schema Onboarding Corrigido + Feature 5 Planejada

---

## � MELHORIAS RECENTES (v2.3.0)

### Sistema de Autenticação Aprimorado
- **Tratamento de Erros Robusto**: Implementação de `safeSupabaseAuth` e `safeSupabaseDb` wrappers
- **Session Management**: Correção de "Auth session missing!" e "Invalid Refresh Token" errors
- **Auth State Synchronization**: Zustand store sincronizado com Supabase auth state changes
- **Loading States**: Estados de carregamento adequados durante inicialização de sessão

### Interface Administrativa de Questões
- **Página de Listagem**: `/admin/questions` com filtros, busca e paginação
- **Formulário de Criação**: Validação Zod completa com tipos dinâmicos de questões
- **Integração Supabase**: Salvamento direto no banco com RLS policies
- **Acessibilidade WCAG AA**: Navegação por teclado e labels ARIA implementados
- **Tratamento de Erros**: Mensagens amigáveis para cenários de falha

### Melhorias Técnicas
- **Dependências Atualizadas**: Next.js 15.5.4, Supabase 2.75.0, Framer Motion 12.23.24
- **TypeScript Strict**: Tipagem rigorosa em todos os novos componentes
- **Performance**: Bundle size mantido < 200KB com lazy loading
- **Testes**: Cobertura aumentada com testes de autenticação e session management
- **Scripts de Utilitários**: Scripts para diagnóstico de schema, população de dados e correções manuais

---

## � NOTAS FINAIS PARA COPILOT

Ao trabalhar neste projeto:
1. **Sempre consulte este README primeiro** para contexto completo
2. **Priorize consistência** com código e padrões existentes
3. **Pense em escalabilidade** - decisões técnicas impactam 2M+ usuários
4. **Considere o contexto educacional** - acessibilidade e motivação são críticos
5. **Documente decisões** - atualize este README quando necessário
6. **Use chamadas diretas do Supabase** - evite criar novos wrappers complexos
7. **Server Components por default** - só use 'use client' quando necessário
8. **Teste hydration** - certifique-se de que componentes server/client estão corretos

**Estado Atual da Arquitetura**:
- ✅ Supabase simplificado (sem safe wrappers)
- ✅ Layout como Server Component (sem hydration errors)
- ✅ Autenticação direta e funcional
- ✅ App buildando e rodando sem erros
- ✅ Interface admin completamente padronizada
- ✅ Componentes com cores consistentes
- ✅ LoadingSpinner universal implementado
- ✅ Logs de desenvolvimento limpos (sem spam 404)
- ✅ Código limpo e otimizado
- ✅ Solo game integrado com Supabase (questões reais do banco)
- ✅ Sistema de fallback robusto para schema inconsistente
- � Feature 5 - Jogos Configuráveis: Planejamento completo ([📋 FEATURE_SOLO_GAME_CONFIG.md](FEATURE_SOLO_GAME_CONFIG.md))
- �🔄 Feature 4 (95% completa) - próximo foco

**Lembre-se**: Este é um projeto educacional que pode impactar milhares de estudantes. Cada linha de código deve contribuir para uma experiência de aprendizado excepcional.

---

*Este documento serve como fonte de verdade para todo o desenvolvimento do QuizTarefas. Mantenha-o atualizado e consulte-o frequentemente para decisões consistentes.*

---

*Este documento serve como fonte de verdade para todo o desenvolvimento do QuizTarefas. Mantenha-o atualizado e consulte-o frequentemente para decisões consistentes.*
