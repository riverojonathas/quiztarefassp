# Quiz App - MVP Demo

Um app de perguntas e respostas competitivo, estilo "Perguntados", construído com Next.js + TypeScript.

## Funcionalidades do MVP

- **Login de demonstração**: Usuários `usuario1`, `usuario2`, `usuario3` (senha: `123`).
- **Salas de jogo**: Criação/entrada por código curto.
- **Modos**: Solo, dupla, sala inteira.
- **Rodadas cronometradas**: Perguntas objetivas com feedback instantâneo.
- **Placar e ranking**: Da sala e geral (dados fake).
- **Adaptação de dificuldade**: Baseada em desempenho.
- **Painel do Host**: Controle de rounds.
- **Analytics**: Acerto por habilidade, tempo médio, streak.

## Stack Tecnológica

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** + **Framer Motion**
- **Socket.IO** para realtime (in-memory)
- **Zustand** para estado cliente
- **ESLint + Prettier**

## Instalação e Execução

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar o servidor**:
   ```bash
   npm run dev
   ```

3. **Abrir no navegador**:
   - Acesse [http://localhost:3000](http://localhost:3000)
   - Faça login com `usuario1` / `123`
   - Navegue pelo app

## Estrutura do Projeto

```
/src
  /app
    /login
    /lobby
    /room/[roomId]
    /ranking
    /analytics
  /components
    QuestionCard.tsx, Timer.tsx, Scoreboard.tsx, etc.
  /domain
    models.ts, repositories.ts
  /infra
    adapters/InMemoryRepository.ts
    realtime/socketServer.ts
  /state
    useSessionStore.ts, useRoomStore.ts
/data
  questions.math.json, questions.port.json, leaderboard.seed.json
```

## Demonstração

1. **Login**: Use `usuario1`, `usuario2` ou `usuario3` com senha `123`.
2. **Lobby**: Crie uma sala ou entre com código (ex.: `AB12`).
3. **Sala**: Jogue perguntas, veja timer e placar.
4. **Fim**: Veja pódio, ranking e analytics.

## Notas Técnicas

- **Dados mocados**: Tudo em `/data/*.json` e in-memory.
- **Realtime**: Socket.IO com store in-memory (não persiste após restart).
- **Adaptação**: Heurística simples (acerto rápido → +dificuldade).
- **Pontuação**: Base 100pts + velocidade + streak.

## Conexão com Supabase

O app está configurado para usar Supabase para persistência de dados. As credenciais estão em `.env.local`.

### Configuração Inicial

1. **Certifique-se de que seu projeto Supabase está ativo**: No dashboard do Supabase, verifique se o projeto não está pausado.

2. **Faça login no Supabase CLI**:
   ```bash
   supabase login
   ```
   Isso abrirá o navegador para autenticação.

3. **Link o projeto local ao remoto**:
   ```bash
   supabase link --project-ref ntiadxsvduowjvxuahzy
   ```

4. **Aplique as migrações**:
   ```bash
   supabase db push
   ```
   Isso criará as tabelas no seu banco Supabase.

### Migração de Dados Mockados

Para usar dados reais do Supabase em vez de mockados:

1. No arquivo `/src/infra/adapters/InMemoryRepository.ts`, substitua as implementações por chamadas ao `SupabaseRepository`.

2. Ou crie um novo adapter que combine ambos (mock fallback).

### Teste da Conexão

Execute o script de teste:
```bash
node test-connection.js
```

Se conectar, verá "Connected to Supabase successfully". Se falhar, verifique se o projeto está ativo e as credenciais corretas.

### Tabelas Criadas

- `users`: id (TEXT), username (TEXT), email (TEXT), created_at (TIMESTAMP)
- `questions`: id (UUID), statement (TEXT), choices (JSONB), difficulty (INTEGER), tags (JSONB), skill (TEXT), time_suggested_sec (INTEGER), image_url (TEXT), created_at (TIMESTAMP)
- `matches`: id (UUID), room_id (TEXT), players (JSONB), scores (JSONB), started_at (TIMESTAMP), ended_at (TIMESTAMP), status (TEXT)
- `leaderboard`: id (UUID), scope (TEXT), scope_id (TEXT), user_id (UUID), score (INTEGER), created_at (TIMESTAMP)

> Nota: Para demo, os dados permanecem mockados. Configure Supabase apenas para produção.

## Scripts

- `npm run dev`: Executa o app com Socket.IO
- `npm run build`: Build para produção
- `npm run lint`: Verifica código

## Licença

Este é um projeto de demonstração.
