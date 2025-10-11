import { supabase } from '../../../lib/supabase';
import { createSuccessResponse, withErrorHandler } from '../../../lib/errors';

async function handler() {
  const { data: _data, error } = await supabase.from('users').select('count').limit(1);
  if (error) {
    throw new Error(`Database connection failed: ${error.message}`);
  }
  return createSuccessResponse({ message: 'Connected to Supabase successfully' });
}

export const GET = withErrorHandler(handler);