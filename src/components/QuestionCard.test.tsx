import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuestionCard } from './QuestionCard'
import { Question } from '../domain/models'

// Mock ResizeObserver for Radix UI
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

// Mock react-confetti
jest.mock('react-confetti', () => {
  return function MockConfetti() {
    return <div data-testid="confetti" />
  }
})

describe('QuestionCard', () => {
  const mockQuestion: Question = {
    id: 'q1',
    statement: 'Qual é a capital do Brasil?',
    choices: [
      { id: 'a', text: 'São Paulo', isCorrect: false },
      { id: 'b', text: 'Rio de Janeiro', isCorrect: false },
      { id: 'c', text: 'Brasília', isCorrect: true },
      { id: 'd', text: 'Salvador', isCorrect: false },
    ],
    difficulty: 1,
    tags: ['Geografia'],
  }

  const mockOnAnswer = jest.fn()

  beforeEach(() => {
    mockOnAnswer.mockClear()
  })

  it('renders question statement and choices', () => {
    render(<QuestionCard question={mockQuestion} onAnswer={mockOnAnswer} />)

    expect(screen.getByText('Qual é a capital do Brasil?')).toBeInTheDocument()
    expect(screen.getByText('São Paulo')).toBeInTheDocument()
    expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument()
    expect(screen.getByText('Brasília')).toBeInTheDocument()
    expect(screen.getByText('Salvador')).toBeInTheDocument()
  })

  it('calls onAnswer with correct choice ID when answer is selected', async () => {
    const user = userEvent.setup()
    render(<QuestionCard question={mockQuestion} onAnswer={mockOnAnswer} />)

    const correctButton = screen.getByText('Brasília')
    await user.click(correctButton)

    expect(mockOnAnswer).toHaveBeenCalledWith('c')
    expect(mockOnAnswer).toHaveBeenCalledTimes(1)
  })

  it('shows confetti when correct answer is selected', async () => {
    const user = userEvent.setup()
    render(<QuestionCard question={mockQuestion} onAnswer={mockOnAnswer} />)

    const correctButton = screen.getByText('Brasília')
    await user.click(correctButton)

    // Confetti should appear
    expect(screen.getByTestId('confetti')).toBeInTheDocument()
  })

  it('does not show confetti when incorrect answer is selected', async () => {
    const user = userEvent.setup()
    render(<QuestionCard question={mockQuestion} onAnswer={mockOnAnswer} />)

    const incorrectButton = screen.getByText('São Paulo')
    await user.click(incorrectButton)

    // Confetti should not appear
    expect(screen.queryByTestId('confetti')).not.toBeInTheDocument()
  })

  it('does not call onAnswer when disabled', async () => {
    const user = userEvent.setup()
    render(<QuestionCard question={mockQuestion} onAnswer={mockOnAnswer} disabled />)

    const button = screen.getByText('Brasília')
    await user.click(button)

    expect(mockOnAnswer).not.toHaveBeenCalled()
  })

  it('buttons are disabled when component is disabled', () => {
    render(<QuestionCard question={mockQuestion} onAnswer={mockOnAnswer} disabled />)

    const buttons = screen.getAllByRole('radio')
    buttons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })

  it('shows visual feedback for selected choice', async () => {
    const user = userEvent.setup()
    render(<QuestionCard question={mockQuestion} onAnswer={mockOnAnswer} />)

    const button = screen.getByText('Brasília')
    await user.click(button)

    // The button should have a ring class when selected
    expect(button).toHaveClass('ring-2')
    expect(button).toHaveClass('ring-blue-500')
  })

  it('renders question image when provided', () => {
    const questionWithImage: Question = {
      ...mockQuestion,
      imageUrl: 'https://example.com/image.png',
    }

    render(<QuestionCard question={questionWithImage} onAnswer={mockOnAnswer} />)

    const image = screen.getByAltText('Ilustração para a pergunta: Qual é a capital do Brasil?')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('alt', 'Ilustração para a pergunta: Qual é a capital do Brasil?')
  })

  it('does not render image when not provided', () => {
    render(<QuestionCard question={mockQuestion} onAnswer={mockOnAnswer} />)

    expect(screen.queryByAltText('Question illustration')).not.toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<QuestionCard question={mockQuestion} onAnswer={mockOnAnswer} />)

    const buttons = screen.getAllByRole('radio')
    expect(buttons[0]).toHaveAttribute('aria-label', 'Opção A: São Paulo')
    expect(buttons[1]).toHaveAttribute('aria-label', 'Opção B: Rio de Janeiro')
    expect(buttons[2]).toHaveAttribute('aria-label', 'Opção C: Brasília')
    expect(buttons[3]).toHaveAttribute('aria-label', 'Opção D: Salvador')
  })
})