import { createSuccessResponse } from '../../../lib/errors';

export async function GET() {
  return createSuccessResponse({ message: 'API is working', timestamp: new Date().toISOString() });
}