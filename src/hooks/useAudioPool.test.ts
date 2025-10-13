import { renderHook, act } from '@testing-library/react';
import { useAudioPool } from '@/hooks/useAudioPool';

// Mock do AudioContext
const mockAudioContext = {
  state: 'running',
  currentTime: 0,
  createOscillator: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    frequency: { value: 0 },
    type: 'sine',
    start: jest.fn(),
    stop: jest.fn(),
  })),
  createGain: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    gain: {
      setValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
    },
  })),
  destination: {},
  resume: jest.fn(),
  close: jest.fn(),
};

const mockSuspendedAudioContext = {
  ...mockAudioContext,
  state: 'suspended',
};

const mockClosedAudioContext = {
  ...mockAudioContext,
  state: 'closed',
};

// Mock do window.AudioContext
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: jest.fn().mockImplementation(() => mockAudioContext),
});

Object.defineProperty(window, 'webkitAudioContext', {
  writable: true,
  value: jest.fn().mockImplementation(() => mockAudioContext),
});

describe('useAudioPool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default max contexts', () => {
    const { result } = renderHook(() => useAudioPool());
    expect(result.current.isInitialized).toBe(false);
  });

  it('should initialize with custom max contexts', () => {
    const { result } = renderHook(() => useAudioPool(5));
    expect(result.current.isInitialized).toBe(false);
  });

  it('should create AudioContext on first playSound call', async () => {
    const { result } = renderHook(() => useAudioPool());

    await act(async () => {
      await result.current.playSound(440, 0.5, 'sine');
    });

    expect(window.AudioContext).toHaveBeenCalledTimes(1);
    expect(result.current.isInitialized).toBe(true);
  });

  it('should reuse existing AudioContext', async () => {
    const { result } = renderHook(() => useAudioPool());

    await act(async () => {
      await result.current.playSound(440, 0.5, 'sine');
      await result.current.playSound(880, 0.3, 'square');
    });

    expect(window.AudioContext).toHaveBeenCalledTimes(1);
  });

  it('should resume suspended AudioContext', async () => {
    // Mock suspended context
    (window.AudioContext as jest.Mock).mockImplementationOnce(() => mockSuspendedAudioContext);

    const { result } = renderHook(() => useAudioPool());

    await act(async () => {
      await result.current.playSound(440, 0.5, 'sine');
    });

    expect(mockSuspendedAudioContext.resume).toHaveBeenCalledTimes(1);
  });

  it('should create AudioContext when needed', async () => {
    const { result } = renderHook(() => useAudioPool(2));

    await act(async () => {
      await result.current.playSound(440, 0.5, 'sine');
    });

    expect(window.AudioContext).toHaveBeenCalledTimes(1);
    expect(result.current.isInitialized).toBe(true);
  });

  it('should handle AudioContext creation errors gracefully', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    (window.AudioContext as jest.Mock).mockImplementationOnce(() => {
      throw new Error('AudioContext not supported');
    });

    const { result } = renderHook(() => useAudioPool());

    // Should not throw, should handle error gracefully
    await act(async () => {
      await result.current.playSound(440, 0.5, 'sine');
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to create AudioContext:', expect.any(Error));
    consoleWarnSpy.mockRestore();
  });

  it('should handle playSound errors gracefully', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    // Mock context that throws on createOscillator
    const failingContext = {
      ...mockAudioContext,
      createOscillator: jest.fn().mockImplementation(() => {
        throw new Error('Oscillator creation failed');
      }),
    };

    (window.AudioContext as jest.Mock).mockImplementationOnce(() => failingContext);

    const { result } = renderHook(() => useAudioPool());

    await act(async () => {
      await result.current.playSound(440, 0.5, 'sine');
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith('Web Audio API not supported or failed:', expect.any(Error));
    consoleWarnSpy.mockRestore();
  });

  it('should cleanup all AudioContexts', () => {
    const { result } = renderHook(() => useAudioPool());

    act(() => {
      result.current.cleanup();
    });

    // Since we haven't created any contexts yet, close shouldn't be called
    expect(mockAudioContext.close).not.toHaveBeenCalled();
  });

  it('should cleanup created AudioContexts', async () => {
    const { result } = renderHook(() => useAudioPool());

    await act(async () => {
      await result.current.playSound(440, 0.5, 'sine');
    });

    act(() => {
      result.current.cleanup();
    });

    expect(mockAudioContext.close).toHaveBeenCalledTimes(1);
  });
});