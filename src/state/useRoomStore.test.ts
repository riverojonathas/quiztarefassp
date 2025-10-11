import { renderHook, act } from '@testing-library/react'
import { useRoomStore } from './useRoomStore'
import { Match } from '../domain/models'

describe('useRoomStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useRoomStore())
    act(() => {
      result.current.leaveRoom()
    })
  })

  it('should initialize with null room and match', () => {
    const { result } = renderHook(() => useRoomStore())
    expect(result.current.currentRoomId).toBeNull()
    expect(result.current.currentMatch).toBeNull()
  })

  it('should set room and match correctly', () => {
    const { result } = renderHook(() => useRoomStore())

    const mockMatch: Match = {
      id: 'match-123',
      roomId: 'room-456',
      mode: 'solo',
      round: 1,
      totalRounds: 5,
      players: [],
    }

    act(() => {
      result.current.setRoom('room-456', mockMatch)
    })

    expect(result.current.currentRoomId).toBe('room-456')
    expect(result.current.currentMatch).toEqual(mockMatch)
  })

  it('should update match correctly', () => {
    const { result } = renderHook(() => useRoomStore())

    const initialMatch: Match = {
      id: 'match-123',
      roomId: 'room-456',
      mode: 'solo',
      round: 1,
      totalRounds: 5,
      players: [],
    }

    const updatedMatch: Match = {
      ...initialMatch,
      round: 2,
      players: [
        {
          userId: 'user-1',
          score: 100,
          streak: 1,
          currentDifficulty: 1,
        },
      ],
    }

    act(() => {
      result.current.setRoom('room-456', initialMatch)
    })

    act(() => {
      result.current.updateMatch(updatedMatch)
    })

    expect(result.current.currentRoomId).toBe('room-456')
    expect(result.current.currentMatch).toEqual(updatedMatch)
    expect(result.current.currentMatch?.round).toBe(2)
    expect(result.current.currentMatch?.players).toHaveLength(1)
  })

  it('should leave room correctly', () => {
    const { result } = renderHook(() => useRoomStore())

    const mockMatch: Match = {
      id: 'match-123',
      roomId: 'room-456',
      mode: 'solo',
      round: 1,
      totalRounds: 5,
      players: [],
    }

    act(() => {
      result.current.setRoom('room-456', mockMatch)
    })

    expect(result.current.currentRoomId).toBe('room-456')
    expect(result.current.currentMatch).toEqual(mockMatch)

    act(() => {
      result.current.leaveRoom()
    })

    expect(result.current.currentRoomId).toBeNull()
    expect(result.current.currentMatch).toBeNull()
  })

  it('should maintain room ID when only updating match', () => {
    const { result } = renderHook(() => useRoomStore())

    const initialMatch: Match = {
      id: 'match-123',
      roomId: 'room-456',
      mode: 'solo',
      round: 1,
      totalRounds: 5,
      players: [],
    }

    const updatedMatch: Match = {
      ...initialMatch,
      round: 2,
    }

    act(() => {
      result.current.setRoom('room-456', initialMatch)
    })

    act(() => {
      result.current.updateMatch(updatedMatch)
    })

    expect(result.current.currentRoomId).toBe('room-456')
    expect(result.current.currentMatch?.id).toBe('match-123')
  })
})