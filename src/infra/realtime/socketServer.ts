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

export const initSocketServer = (httpServer: NetServer) => {
  const io = new ServerIO(httpServer, {
    path: '/api/socket',
    addTrailingSlash: false,
  });

  const repo = new InMemoryRepository();

  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    // Temporarily disable all socket functionality due to type issues
    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id);
    });
  });

  return io;
};
