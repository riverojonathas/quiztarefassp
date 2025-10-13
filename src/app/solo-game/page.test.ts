import { gameReducer, initialState } from './page';

describe('gameReducer', () => {
  it('should return initial state for unknown action', () => {
    expect(gameReducer(initialState, { type: 'UNKNOWN' } as unknown as Parameters<typeof gameReducer>[1])).toEqual(initialState);
  });

  it('should handle START_GAME', () => {
    const action = { type: 'START_GAME' as const };
    const result = gameReducer(initialState, action);
    expect(result.gameStarted).toBe(true);
  });

  it('should handle LOAD_QUESTION', () => {
    const mockQuestion = {
      id: '1',
      statement: 'Test question?',
      choices: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      skill: 'Test',
      timeLimit: 30
    };
    const action = { type: 'LOAD_QUESTION' as const, payload: mockQuestion };
    const result = gameReducer(initialState, action);
    expect(result.currentQuestion).toEqual(mockQuestion);
    expect(result.timeLeft).toBe(30);
    expect(result.selectedAnswer).toBe(null);
    expect(result.showResult).toBe(false);
  });

  it('should handle SELECT_ANSWER', () => {
    const action = { type: 'SELECT_ANSWER' as const, payload: 1 };
    const result = gameReducer(initialState, action);
    expect(result.selectedAnswer).toBe(1);
  });

  it('should handle SUBMIT_ANSWER correctly', () => {
    const action = {
      type: 'SUBMIT_ANSWER' as const,
      payload: { answerIndex: 0, isCorrect: true, timeBonus: 50 }
    };
    const result = gameReducer({ ...initialState, score: 0 }, action);
    expect(result.selectedAnswer).toBe(0);
    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(150); // 100 + 50
    expect(result.showResult).toBe(true);
    expect(result.shakeAnimation).toBe('correct');
  });

  it('should handle SUBMIT_ANSWER incorrectly', () => {
    const action = {
      type: 'SUBMIT_ANSWER' as const,
      payload: { answerIndex: 1, isCorrect: false, timeBonus: 0 }
    };
    const result = gameReducer({ ...initialState, score: 100 }, action);
    expect(result.selectedAnswer).toBe(1);
    expect(result.isCorrect).toBe(false);
    expect(result.score).toBe(100); // No points for wrong answer
    expect(result.showResult).toBe(true);
    expect(result.shakeAnimation).toBe('wrong');
  });

  it('should handle UPDATE_TIME', () => {
    const action = { type: 'UPDATE_TIME' as const, payload: 25 };
    const result = gameReducer({ ...initialState, timeLeft: 30 }, action);
    expect(result.timeLeft).toBe(25);
  });

  it('should handle SET_WARNING_INTERVAL', () => {
    const mockInterval = setInterval(() => {}, 1000);
    const action = { type: 'SET_WARNING_INTERVAL' as const, payload: mockInterval };
    const result = gameReducer(initialState, action);
    expect(result.warningInterval).toBe(mockInterval);
  });

  it('should handle SET_SHAKE_ANIMATION', () => {
    const action = { type: 'SET_SHAKE_ANIMATION' as const, payload: 'correct' as const };
    const result = gameReducer(initialState, action);
    expect(result.shakeAnimation).toBe('correct');
  });

  it('should handle TOGGLE_TIMER', () => {
    const action = { type: 'TOGGLE_TIMER' as const };
    const result = gameReducer({ ...initialState, showTimer: true }, action);
    expect(result.showTimer).toBe(false);
  });

  it('should handle FINISH_GAME', () => {
    const action = { type: 'FINISH_GAME' as const };
    const result = gameReducer(initialState, action);
    expect(result.gameFinished).toBe(true);
  });

  it('should handle RESET_GAME', () => {
    const mockInterval = setInterval(() => {}, 1000);
    const modifiedState = {
      ...initialState,
      gameStarted: true,
      gameFinished: true,
      score: 500,
      questionNumber: 2,
      warningInterval: mockInterval
    };
    const action = { type: 'RESET_GAME' as const };
    const result = gameReducer(modifiedState, action);
    expect(result).toEqual(initialState);
  });

  it('should handle NEXT_QUESTION', () => {
    const action = { type: 'NEXT_QUESTION' as const };
    const result = gameReducer({ ...initialState, questionNumber: 1 }, action);
    expect(result.questionNumber).toBe(2);
  });
});