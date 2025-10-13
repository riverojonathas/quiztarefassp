export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }

  // Add global error handlers for Supabase-related errors
  if (typeof window !== 'undefined') {
    // Client-side error handling
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message);
        if (message.includes('Failed to fetch') && event.reason?.stack?.includes('supabase')) {
          console.warn('🚨 Supabase network error caught globally:', error);
          event.preventDefault(); // Prevent the error from being logged as unhandled
        }
      }
    });

    window.addEventListener('error', (event) => {
      if (event.message?.includes('Failed to fetch') && event.filename?.includes('supabase')) {
        console.warn('🚨 Supabase network error caught globally:', event.error);
        event.preventDefault();
      }
    });
  }
}