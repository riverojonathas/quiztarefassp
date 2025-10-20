import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Apenas adiciona um header para identificar requests do VS Code
  // Sem interferir no cache ou comportamento normal
  const userAgent = request.headers.get('user-agent') || ''
  const url = request.url

  if (userAgent.includes('vscode') || url.includes('vscodeBrowserReqId')) {
    // Adiciona header de identificação, mas mantém comportamento normal
    const response = NextResponse.next()
    response.headers.set('X-VSCode-Browser', 'detected')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}