import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { retired } from '@/lib/retired';

/**
 * X Protocol Middleware
 *
 * Handles both legacy path401/path403 host routing AND
 * x401 subdomain tenant extraction.
 *
 * CNAME pattern: x401.npgx.website → path401.com
 * Host header will be: x401.npgx.website
 * Extracted domain: npgx.website
 */

// RETIRED 18 Nov 2026 (security): every /api route answers 410 except these read-only public GETs the pages call.
// Routes here trusted asserted handles, unsigned cookies, or secret checks that pass when the env var is unset, and
// several spent from the treasury key. Exact paths, GET only; anything else (other methods, encodings, trailing
// slashes, new routes) is refused. The per-route 410s stay as a second layer.
const OPEN_API_GETS = new Set([
  '/api/token/stats',
  '/api/token/onchain',
  '/api/token/cap-table',
  '/api/price/bsv',
  '/api/tokens',
]);

function isRetiredApiRequest(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;
  // Decide "is this /api?" on a decoded, lower-cased copy so /API/... or /%61pi/... can't slip past; the allowlist
  // itself matches the raw path exactly, so those variants are refused.
  let path: string;
  try {
    path = decodeURIComponent(pathname).toLowerCase();
  } catch {
    return true;
  }
  if (path !== '/api' && !path.startsWith('/api/')) return false;
  return !(request.method === 'GET' && OPEN_API_GETS.has(pathname));
}

export function proxy(request: NextRequest) {
  if (isRetiredApiRequest(request)) return retired();
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''

  // Extract tenant domain from x-protocol subdomains
  const xMatch = host.match(/^x40[123]\.(.+)$/)
  if (xMatch) {
    const response = pathname === '/'
      ? NextResponse.rewrite(new URL('/401', request.url))
      : NextResponse.next()

    response.headers.set('x-tenant-domain', xMatch[1])
    response.headers.set('x-protocol-layer', host.startsWith('x401') ? 'x401' : host.startsWith('x402') ? 'x402' : 'x403')
    return response
  }

  // Legacy host-based routing (root path only)
  if (pathname === '/') {
    if (host.includes('path401')) {
      return NextResponse.rewrite(new URL('/401', request.url))
    }
    if (host.includes('path403')) {
      return NextResponse.rewrite(new URL('/403', request.url))
    }
    return NextResponse.rewrite(new URL('/401', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
