// Script to clear Zustand persisted state
console.log('Clearing Zustand persisted state...');

// Clear the quiz session storage
localStorage.removeItem('quiz-session-storage');

console.log('Zustand state cleared. Please refresh the page.');