// Note: Socket.IO in Next.js App Router requires custom server setup.
// For MVP, this is a placeholder. In production, use pages/api/socket.ts or custom server.
// See socketServer.ts for logic.

import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return new Response('Socket endpoint', { status: 200 });
}