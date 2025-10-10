import { create } from 'zustand';
import { Match, RoomId } from '../domain/models';

interface RoomState {
  currentRoomId: RoomId | null;
  currentMatch: Match | null;
  setRoom: (roomId: RoomId, match: Match) => void;
  updateMatch: (match: Match) => void;
  leaveRoom: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoomId: null,
  currentMatch: null,
  setRoom: (roomId, match) => set({ currentRoomId: roomId, currentMatch: match }),
  updateMatch: (match) => set({ currentMatch: match }),
  leaveRoom: () => set({ currentRoomId: null, currentMatch: null }),
}));