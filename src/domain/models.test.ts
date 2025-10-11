import { User, Question, Choice, PlayerState, Match } from './models'

describe('Domain Models', () => {
  describe('User', () => {
    it('should create a valid user object', () => {
      const user: User = {
        id: 'user-123',
        name: 'João Silva'
      }

      expect(user.id).toBe('user-123')
      expect(user.name).toBe('João Silva')
    })
  })

  describe('Question', () => {
    it('should create a valid question with choices', () => {
      const choices: Choice[] = [
        { id: 'a', text: 'Resposta A', isCorrect: false },
        { id: 'b', text: 'Resposta B', isCorrect: true },
        { id: 'c', text: 'Resposta C', isCorrect: false }
      ]

      const question: Question = {
        id: 'q1',
        statement: 'Qual é a capital do Brasil?',
        choices,
        difficulty: 1,
        tags: ['Geografia', 'BNCC-H1']
      }

      expect(question.id).toBe('q1')
      expect(question.statement).toBe('Qual é a capital do Brasil?')
      expect(question.choices).toHaveLength(3)
      expect(question.difficulty).toBe(1)
      expect(question.tags).toEqual(['Geografia', 'BNCC-H1'])
    })

    it('should create a question with optional fields', () => {
      const question: Question = {
        id: 'q2',
        statement: 'Quanto é 2 + 2?',
        choices: [{ id: 'a', text: '4', isCorrect: true }],
        difficulty: 2,
        tags: ['Matemática'],
        skill: 'aritmética básica',
        timeSuggestedSec: 30,
        imageUrl: 'https://example.com/image.png'
      }

      expect(question.skill).toBe('aritmética básica')
      expect(question.timeSuggestedSec).toBe(30)
      expect(question.imageUrl).toBe('https://example.com/image.png')
    })
  })

  describe('PlayerState', () => {
    it('should create a valid player state', () => {
      const playerState: PlayerState = {
        userId: 'user-123',
        score: 150,
        streak: 3,
        currentDifficulty: 2
      }

      expect(playerState.userId).toBe('user-123')
      expect(playerState.score).toBe(150)
      expect(playerState.streak).toBe(3)
      expect(playerState.currentDifficulty).toBe(2)
    })
  })

  describe('Match', () => {
    it('should create a valid match', () => {
      const players: PlayerState[] = [
        {
          userId: 'user-1',
          score: 100,
          streak: 2,
          currentDifficulty: 1
        },
        {
          userId: 'user-2',
          score: 80,
          streak: 1,
          currentDifficulty: 1
        }
      ]

      const match: Match = {
        id: 'match-123',
        roomId: 'room-456',
        mode: 'dupla',
        round: 2,
        totalRounds: 5,
        players
      }

      expect(match.id).toBe('match-123')
      expect(match.roomId).toBe('room-456')
      expect(match.mode).toBe('dupla')
      expect(match.round).toBe(2)
      expect(match.totalRounds).toBe(5)
      expect(match.players).toHaveLength(2)
    })
  })
})