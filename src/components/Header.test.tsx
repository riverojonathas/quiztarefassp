import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'

// Mock Next.js router and pathname
const mockPush = jest.fn()
const mockPathname = '/home'
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
}))

// Mock useSessionStore at the module level
jest.mock('../state/useSessionStore', () => ({
  useSessionStore: jest.fn(),
}))

import { useSessionStore } from '../state/useSessionStore'

const mockUseSessionStore = useSessionStore as jest.MockedFunction<typeof useSessionStore>

describe('Header', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockUseSessionStore.mockClear()
  })

  it('renders bottom navigation items', () => {
    mockUseSessionStore.mockImplementation((selector) => {
      if (selector && typeof selector === 'function') {
        return selector({ user: null, setUser: jest.fn(), logout: jest.fn(), lastScore: 0, setLastScore: jest.fn() })
      }
      return { user: null, setUser: jest.fn(), logout: jest.fn(), lastScore: 0, setLastScore: jest.fn() }
    })

    render(<Header />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Lobby')).toBeInTheDocument()
    expect(screen.getByText('Ranking')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('shows active state for current page', () => {
    mockUseSessionStore.mockImplementation((selector) => {
      if (selector && typeof selector === 'function') {
        return selector({ user: null, setUser: jest.fn(), logout: jest.fn(), lastScore: 0, setLastScore: jest.fn() })
      }
      return { user: null, setUser: jest.fn(), logout: jest.fn(), lastScore: 0, setLastScore: jest.fn() }
    })

    render(<Header />)

    // Home should be active since mockPathname is '/home'
    // Check if the active class is applied to the container
    const activeItem = screen.getByText('Home').closest('.nav-item')
    expect(activeItem).toHaveClass('text-indigo-600', 'bg-indigo-50')
  })

  it('does not show user info or logout when not logged in', () => {
    mockUseSessionStore.mockImplementation((selector) => {
      if (selector && typeof selector === 'function') {
        return selector({ user: null, setUser: jest.fn(), logout: jest.fn(), lastScore: 0, setLastScore: jest.fn() })
      }
      return { user: null, setUser: jest.fn(), logout: jest.fn(), lastScore: 0, setLastScore: jest.fn() }
    })

    render(<Header />)
    // The new header doesn't show user info or logout button
    expect(screen.queryByText('Sair')).not.toBeInTheDocument()
  })
})