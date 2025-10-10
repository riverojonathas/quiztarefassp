import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { InMemoryRepository } from '../adapters/InMemoryRepository';
import { Match, PlayerState, UserId, RoomId } from '../../domain/models';

export type NextApiResponseServerIo = NextApiResponse & {
  socket: any & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export const initSocketServer = (httpServer: NetServer) => {
  const io = new ServerIO(httpServer, {
    path: '/api/socket',
    addTrailingSlash: false,
  });

  const repo = new InMemoryRepository();

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('room:create', async ({ hostId }: { hostId: UserId }) => {
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
      socket.emit('room:created', { roomId });
    });

    socket.on('room:join', async ({ roomId, user }: { roomId: RoomId; user: any }) => {
      socket.join(roomId);
      const match = await repo.getMatch(roomId);
      if (match) {
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
        io.to(roomId).emit('room:updated', match);
      }
    });

    socket.on('room:start', async ({ roomId, totalRounds, mode }: { roomId: RoomId; totalRounds: number; mode: string }) => {
      const match = await repo.getMatch(roomId);
      if (match) {
        match.totalRounds = totalRounds;
        match.mode = mode as any;
        match.round = 1;
        await repo.updateMatch(match);
        io.to(roomId).emit('room:started', match);
        // Emit first question
        // TODO: Get question based on difficulty
      }
    });

    // Add more events: question:next, answer:submit, etc.

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};