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
- **👥 Salas**: Criar/acessar salas de jogo multiplayer
- **⚙️ Configurações**: Personalizar app com 4 seções (Perfil, Segurança, Notificações, Tema)

### 🎮 Modos de Jogo
- **🎯 Jogar Sozinho**: Prática individual com 3 perguntas cronometradas e som animador de início
  - **Tentativas Múltiplas**: Quando erra uma resposta, ela fica destacada em vermelho mas permite tentar novamente até acertar ou o tempo acabar
  - **Confetti Especial**: Celebração com confetti aparece apenas na tela de parabéns ao completar o modo treino
- **📚 Trilha de Tarefas**: Sistema de progressão com fases educacionais (6 fases disponíveis)
- **👥 Tarefas em Grupo**: Aprendizado colaborativo em sala de aula (em desenvolvimento)
- **👥 Jogar contra outro**: Multiplayer em tempo real via salas
- **🏠 Sistema de Salas**: Criação/entrada por código curto
- **⏱️ Quiz Cronometrado**: Perguntas objetivas com feedback instantâneo
- **📊 Ranking Global**: Placar da sala e ranking geral

### 🔐 Autenticação Completa
- Login/cadastro com email e senha
- Google OAuth integration
- Gerenciamento de sessão seguro
- **Nova seção Segurança**: Alteração de senha dedicada
- **Perfil otimizado**: Avatar clicável ao lado do apelido
- **Interface limpa**: Remoção de elementos desnecessários
- **Seção Matrícula**: Campos educacionais (Diretoria, Escola, Nível, Série, Turma)

### 🎵 Sistema de Áudio Imersivo
- **Web Audio API**: Sons gerados proceduralmente para melhor performance
- **Feedback Sonoro**: Áudio contextual para ações do usuário
- **Som de Início**: Sequência musical empolgante ao começar jogo solo
- **Avisos de Tempo**: Beeps urgentes nos últimos 5 segundos
- **Feedback de Respostas**: Sons distintos para acertos e erros
- **Compatibilidade**: Suporte cross-browser com fallbacks

## ✨ Melhorias Recentes

### 🎯 Jogar Sozinho Aprimorado
- **Tentativas Múltiplas Educativas**: Quando o jogador erra uma resposta, ela fica visualmente destacada em vermelho com animação de pulso, mas permite continuar tentando até acertar ou o tempo acabar - tornando o aprendizado mais efetivo
- **Confetti Estratégico**: Removido o confetti de cada resposta correta para evitar cansaço visual, mantendo apenas a celebração especial na tela de parabéns ao completar o modo treino
- **Feedback Visual Inteligente**: Respostas erradas são marcadas mas não bloqueiam novas tentativas, incentivando o aprendizado ativo

## 📋 Visão Geral dos Sprints

### Sprint 1 ✅ - MVP Funcional
**Status**: Completo | **Objetivo**: Produto mínimo viável funcional
- ✅ Autenticação completa (login/cadastro)
- ✅ Sistema de salas multiplayer
- ✅ Quiz em tempo real com Socket.IO
- ✅ Sistema de pontuação e ranking
- ✅ Testes automatizados (35 testes)
- ✅ Tratamento de erros e validações

### Sprint 2 ✅ - Acessibilidade & Performance
**Status**: Completo | **Objetivo**: WCAG 2.1 AA e otimização de performance
- ✅ **Acessibilidade WCAG 2.1 AA**: Todos os componentes acessíveis
- ✅ **Performance**: Bundle de 133KB, lazy loading, Next.js Image
- ✅ **Chat em tempo real**: Sistema completo de mensagens
- ✅ **Screen readers**: Suporte total com ARIA labels
- ✅ **Navegação por teclado**: Full keyboard navigation

### Sprint 3 ✅ - Infraestrutura de Produção
**Status**: Completo | **Objetivo**: CI/CD, monitoramento e notificações
- ✅ **CI/CD Pipeline**: GitHub Actions + Vercel
- ✅ **Monitoramento**: Sentry para erros e performance
- ✅ **Push Notifications**: Web Push API para engajamento
- ✅ **Deploy Automático**: Zero-downtime deployments

### Próximas Expansões (Roadmap Detalhado)
Para evoluir o app para um sistema educacional completo, consulte o [`roadmap.md`](roadmap.md) para detalhes sobre:
- Módulo Professor
- Sistema de Fases Configuráveis
- Relacionamentos Educacionais (série, escola, turma, diretoria) - **✅ Campos básicos implementados**
- Metas e Progresso para Alunos
- Tematização Dinâmica (temas comemorativos)
- Front-end para Cadastro de Questões
- Jogos Configuráveis e Múltiplas Modalidades
- **✅ Interface de Configurações Otimizada**: Avatar interativo, seção Segurança dedicada, layout responsivo aprimorado

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** + **Framer Motion**
- **Web Audio API** para sons imersivos e feedback auditivo
- **React Query** para estado servidor
- **Zustand** para estado cliente

### Backend & Infra
- **Socket.IO** para realtime (in-memory)
- **Supabase** para persistência (configurado)
- **Vercel** para hosting e edge functions
- **Sentry** para monitoramento
- **ESLint + Prettier**

### Qualidade & DX
- **Jest** + **React Testing Library** (35 testes)
- **ESLint** + **Prettier** para qualidade
- **TypeScript** com strict mode
- **GitHub Actions** para CI/CD

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ e npm
- Git

### Instalação Rápida
```bash
# Clone o repositório
git clone <repository-url>
cd quiztarefassp

# Instale dependências
npm install

# Execute em desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

### Demonstração
1. **📝 Cadastro/Login**: Acesse `/signin` ou `/signup`
2. **🏠 Home**: Veja seu ranking e estatísticas pessoais
3. **🏆 Ranking**: Ver classificações globais
4. **▶️ Jogar**: Escolha entre "Jogar sozinho" ou "Jogar contra outro"
5. **🎯 Solo Game**: Clique em START para ouvir som animador e começar o quiz
6. **👥 Salas**: Crie uma sala ou entre com código (ex.: `AB12`)
7. **🎯 Sala**: Jogue perguntas, veja timer e placar

## 📁 Estrutura do Projeto

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── notifications/        # Push notifications API
│   │   ├── socket/              # WebSocket server
│   │   └── test-connection/     # Supabase connection test
│   ├── home/                    # Home page with consolidated ranking
│   ├── ranking/                 # Global ranking page
│   ├── play/                    # Seleção de modos de jogo (layout mobile otimizado)
│   ├── solo-game/               # Solo practice game page
│   ├── trilha-tarefas/          # Sistema de progressão educacional
│   ├── tarefas-grupo/           # Aprendizado colaborativo (em desenvolvimento)
│   ├── settings/                # User settings page
│   ├── signin|signup/           # Auth pages
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   ├── ErrorBoundary.tsx        # Error handling
│   ├── NotificationSettings.tsx # Push notification UI
│   ├── QuestionCard.tsx         # Quiz question component
│   ├── Timer.tsx                # Quiz timer with accessibility
│   ├── Scoreboard.tsx           # Ranking table
│   ├── Podium.tsx               # Results podium
│   ├── Chat.tsx                 # Real-time chat
│   └── Header.tsx               # Navigation header
├── domain/                      # Business logic
│   ├── models.ts                # TypeScript interfaces
│   └── repositories.ts          # Data access contracts
├── hooks/                       # Custom React hooks
│   ├── useQuizNotifications.ts  # Notification triggers
│   └── useScreenReaderAnnouncement.ts # Accessibility
├── infra/                       # Infrastructure layer
│   ├── adapters/                # Repository implementations
│   │   ├── InMemoryRepository.ts # Mock data adapter
│   │   └── SupabaseRepository.ts # Real database adapter
│   └── realtime/                # WebSocket server
│       └── socketServer.ts      # Socket.IO server
├── lib/                         # Utilities
│   ├── pushNotifications.ts     # Push notification manager
│   └── auth.ts                  # Authentication helpers
├── state/                       # Global state (Zustand)
│   ├── useSessionStore.ts       # User session state
│   └── useRoomStore.ts          # Room/game state
└── instrumentation.ts           # Sentry initialization
```

## 🧪 Testes e Qualidade

### Executando Testes
```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes específicos
npm test -- --testPathPatterns=Button.test.tsx

# Cobertura de testes
npm test -- --coverage
```

### Métricas Atuais
- ✅ **35 testes** passando
- ✅ **Build successful** em produção
- ✅ **Bundle otimizado**: 133KB shared JS
- ✅ **WCAG 2.1 AA** compliance
- ✅ **Performance**: Core Web Vitals verdes

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Executa o app com Socket.IO
npm run build        # Build para produção
npm run start        # Executa o app em produção
npm run lint         # Verifica código com ESLint
npm run test         # Executa todos os testes
npm run test:watch   # Executa testes em modo watch
npm run build:analyze # Bundle analyzer
```

## 🔧 Configurações de Produção

### 1. **Variáveis de Ambiente**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://ntiadxsvduowjvxuahzy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SENTRY_DSN=https://your-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VAPID_PRIVATE_KEY=your_vapid_private_key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
```

### 2. **Supabase Setup**
1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Configure autenticação e tabelas

### 3. **Sentry Setup**
```bash
npm install @sentry/nextjs
# Configure variáveis de ambiente
```

### 4. **Push Notifications Setup**
```bash
npm install web-push
npx web-push generate-vapid-keys
# Configure VAPID keys
```

### 5. **Vercel Deploy**
1. Conecte o repositório no Vercel
2. Configure variáveis de ambiente
3. Deploy automático via GitHub Actions

## 📈 Métricas de Qualidade

### Performance
- **Bundle Size**: 133KB shared JS (excelente!)
- **First Load**: 126-183KB por página
- **Lighthouse Score**: 95+ em performance
- **Core Web Vitals**: Todas verdes

### Acessibilidade
- **WCAG Compliance**: 2.1 AA completo
- **Screen Reader**: 100% compatível
- **Keyboard Navigation**: Full support
- **Color Contrast**: WCAG AA compliant

### CI/CD
- **Build Time**: ~6 segundos
- **Test Execution**: ~1.5 segundos
- **Deploy Success**: 100% automated
- **Multi-Node**: Node 18.x e 20.x

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é uma demonstração técnica completa de uma aplicação moderna React/Next.js. **Não é open source** para uso comercial sem autorização.

## 🙏 Agradecimentos

- **Next.js Team** pela incrível framework
- **Vercel** pelo hosting excepcional
- **Supabase** pelo backend as a service
- **Sentry** pelo monitoramento
- **shadcn/ui** pelos componentes acessíveis

---

**🎉 Projeto Showcase**: Esta aplicação demonstra expertise completa em React/Next.js, incluindo arquitetura moderna, acessibilidade, performance, CI/CD, monitoramento e deploy em produção.

*Última atualização: 12 de outubro de 2025*
