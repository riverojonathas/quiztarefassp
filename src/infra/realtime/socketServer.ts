import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { InMemoryRepository } from '../adapters/InMemoryRepository';
import { Match, UserId, RoomId, User, Question, PlayerState } from '../../domain/models';

export type NextApiResponseServerIo = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

// Store active games and their timers
const activeGames = new Map<RoomId, {
  timer?: NodeJS.Timeout;
  currentQuestion?: Question;
  answers: Map<UserId, { choiceId: string; timestamp: number }>;
  startTime?: number;
}>();

// Store chat messages per room
const roomChats = new Map<RoomId, Array<{
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}>>();

export const initSocketServer = (httpServer: NetServer) => {
  const io = new ServerIO(httpServer, {
    path: '/api/socket',
    addTrailingSlash: false,
  });

  const repo = new InMemoryRepository();

  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    socket.on('room:create', async ({ hostId }: { hostId: UserId }) => {
      try {
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Create initial match
        const match: Match = {
          id: roomId,
          roomId,
          mode: 'solo',
          round: 0,
          totalRounds: 5,
          players: [],
        };

        await repo.createMatch(match);

        // Initialize game state
        activeGames.set(roomId, {
          answers: new Map(),
        });

        socket.emit('room:created', { roomId, success: true });
      } catch (error) {
        console.error('Error creating room:', error);
        socket.emit('room:created', { success: false, error: 'Failed to create room' });
      }
    });

    socket.on('room:join', async ({ roomId, user }: { roomId: RoomId; user: User }) => {
      try {
        socket.join(roomId);
        const match = await repo.getMatch(roomId);

        if (!match) {
          socket.emit('room:joined', { success: false, error: 'Room not found' });
          return;
        }

        // Add player if not present
        if (!match.players.find(p => p.userId === user.id)) {
          match.players.push({
            userId: user.id,
            score: 0,
            streak: 0,
            currentDifficulty: 1,
          });
          await repo.updateMatch(match);
        }

        // Send current room state to the joining player
        socket.emit('room:joined', {
          success: true,
          match,
          players: match.players
        });

        // Notify all players in the room about the update
        io.to(roomId).emit('room:updated', {
          match,
          players: match.players
        });

      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('room:joined', { success: false, error: 'Failed to join room' });
      }
    });

    socket.on('room:start', async ({ roomId, totalRounds, mode }: { roomId: RoomId; totalRounds: number; mode: 'solo' | 'dupla' | 'sala' }) => {
      try {
        const match = await repo.getMatch(roomId);
        if (!match) return;

        match.totalRounds = totalRounds;
        match.mode = mode;
        match.round = 1;
        await repo.updateMatch(match);

        // Get first question
        const questions = await repo.getAllQuestions();
        const firstQuestion = questions[0]; // For demo, just use first question

        if (firstQuestion) {
          const gameState = activeGames.get(roomId);
          if (gameState) {
            gameState.currentQuestion = firstQuestion;
            gameState.startTime = Date.now();
            gameState.answers.clear();

            // Set timer for question
            gameState.timer = setTimeout(() => {
              handleQuestionTimeout(roomId, io, repo);
            }, (firstQuestion.timeSuggestedSec || 10) * 1000);
          }
        }

        io.to(roomId).emit('game:started', {
          match,
          question: firstQuestion,
          timeLimit: firstQuestion.timeSuggestedSec || 10
        });

      } catch (error) {
        console.error('Error starting game:', error);
        io.to(roomId).emit('game:error', { message: 'Failed to start game' });
      }
    });

    socket.on('answer:submit', async ({ roomId, userId, choiceId }: { roomId: RoomId; userId: UserId; choiceId: string }) => {
      try {
        const gameState = activeGames.get(roomId);
        if (!gameState || !gameState.currentQuestion) return;

        // Record answer if not already submitted
        if (!gameState.answers.has(userId)) {
          gameState.answers.set(userId, {
            choiceId,
            timestamp: Date.now()
          });

          const match = await repo.getMatch(roomId);
          if (match) {
            const player = match.players.find(p => p.userId === userId);
            if (player && gameState.currentQuestion) {
              const isCorrect = gameState.currentQuestion.choices.find(c => c.id === choiceId)?.isCorrect;

              if (isCorrect) {
                player.score += 100 + player.streak * 10;
                player.streak += 1;
              } else {
                player.streak = 0;
              }

              await repo.updateMatch(match);

              // Notify player of their result
              socket.emit('answer:result', {
                correct: isCorrect,
                newScore: player.score,
                newStreak: player.streak
              });
            }
          }
        }
      } catch (error) {
        console.error('Error submitting answer:', error);
        socket.emit('answer:error', { message: 'Failed to submit answer' });
      }
    });

    socket.on('chat:send', ({ roomId, userId, userName, message }: {
      roomId: RoomId;
      userId: UserId;
      userName: string;
      message: string;
    }) => {
      try {
        // Validate message
        if (!message.trim() || message.length > 200) {
          socket.emit('chat:error', { message: 'Mensagem inválida' });
          return;
        }

        // Initialize chat for room if not exists
        if (!roomChats.has(roomId)) {
          roomChats.set(roomId, []);
        }

        const chatMessages = roomChats.get(roomId)!;

        // Create new message
        const newMessage = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId,
          userName,
          message: message.trim(),
          timestamp: new Date(),
        };

        // Add to chat history (keep last 50 messages)
        chatMessages.push(newMessage);
        if (chatMessages.length > 50) {
          chatMessages.shift();
        }

        // Broadcast to all players in the room
        io.to(roomId).emit('chat:message', newMessage);

      } catch (error) {
        console.error('Error sending chat message:', error);
        socket.emit('chat:error', { message: 'Falha ao enviar mensagem' });
      }
    });

    socket.on('game:next', async ({ roomId }: { roomId: RoomId }) => {
      try {
        const match = await repo.getMatch(roomId);
        const gameState = activeGames.get(roomId);

        if (!match || !gameState) return;

        // Clear previous timer
        if (gameState.timer) {
          clearTimeout(gameState.timer);
        }

        match.round += 1;

        if (match.round > match.totalRounds) {
          // Game finished
          io.to(roomId).emit('game:finished', {
            match,
            finalScores: match.players.map(p => ({
              userId: p.userId,
              score: p.score,
              streak: p.streak
            }))
          });
          activeGames.delete(roomId);
          return;
        }

        await repo.updateMatch(match);

        // Get next question (for demo, cycle through questions)
        const questions = await repo.getAllQuestions();
        const nextQuestion = questions[match.round - 1] || questions[0];

        gameState.currentQuestion = nextQuestion;
        gameState.startTime = Date.now();
        gameState.answers.clear();

        // Set timer for next question
        gameState.timer = setTimeout(() => {
          handleQuestionTimeout(roomId, io, repo);
        }, (nextQuestion.timeSuggestedSec || 10) * 1000);

        io.to(roomId).emit('question:next', {
          question: nextQuestion,
          round: match.round,
          timeLimit: nextQuestion.timeSuggestedSec || 10
        });

      } catch (error) {
        console.error('Error advancing game:', error);
        io.to(roomId).emit('game:error', { message: 'Failed to advance game' });
      }
    });

    socket.on('chat:send', ({ roomId, userId, userName, message }: {
      roomId: RoomId;
      userId: UserId;
      userName: string;
      message: string;
    }) => {
      try {
        // Validate message
        if (!message.trim() || message.length > 200) {
          socket.emit('chat:error', { message: 'Mensagem inválida' });
          return;
        }

        // Initialize chat for room if not exists
        if (!roomChats.has(roomId)) {
          roomChats.set(roomId, []);
        }

        const chatMessages = roomChats.get(roomId)!;

        // Create new message
        const newMessage = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId,
          userName,
          message: message.trim(),
          timestamp: new Date(),
        };

        // Add to chat history (keep last 50 messages)
        chatMessages.push(newMessage);
        if (chatMessages.length > 50) {
          chatMessages.shift();
        }

        // Broadcast to all players in the room
        io.to(roomId).emit('chat:message', newMessage);

      } catch (error) {
        console.error('Error sending chat message:', error);
        socket.emit('chat:error', { message: 'Falha ao enviar mensagem' });
      }
    });

    socket.on('chat:history', ({ roomId }: { roomId: RoomId }) => {
      try {
        const chatMessages = roomChats.get(roomId) || [];
        socket.emit('chat:history', { messages: chatMessages });
      } catch (error) {
        console.error('Error getting chat history:', error);
        socket.emit('chat:error', { message: 'Falha ao carregar histórico' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id);

      // Clean up any timers for rooms this player was in
      for (const [roomId, gameState] of activeGames.entries()) {
        if (gameState.timer) {
          clearTimeout(gameState.timer);
        }
      }
    });
  });

  return io;
};

function handleQuestionTimeout(roomId: RoomId, io: ServerIO, repo: InMemoryRepository) {
  // Called when question timer expires
  const gameState = activeGames.get(roomId);
  if (!gameState) return;

  // Process any remaining answers and move to next question
  io.to(roomId).emit('question:timeout');

  // Auto-advance after a short delay
  setTimeout(() => {
    io.to(roomId).emit('game:next');
  }, 2000);
}