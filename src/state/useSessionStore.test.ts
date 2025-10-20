import { renderHook, act } from '@testing-library/react'
import { useSessionStore } from './useSessionStore'

describe('useSessionStore', () => {
  beforeEach(() => {
    // Clear localStorage and reset store state before each test
    localStorage.removeItem('quiz-session-storage')
    const { result } = renderHook(() => useSessionStore())
    act(() => {
      result.current.logout()
    })
  })

  it('should initialize with null user', () => {
    const { result } = renderHook(() => useSessionStore())
    expect(result.current.user).toBeNull()
  })

  it('should set user correctly', () => {
    const { result } = renderHook(() => useSessionStore())
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }

    act(() => {
      result.current.setUser(mockUser)
    })

    expect(result.current.user).toEqual(mockUser)
  })

  it('should logout correctly', async () => {
    const { result } = renderHook(() => useSessionStore())
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }

    act(() => {
      result.current.setUser(mockUser)
    })
    expect(result.current.user).toEqual(mockUser)

    await act(async () => {
      await result.current.logout()
    })
    expect(result.current.user).toBeNull()
  })
})