import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = await fetch(`${req.nextUrl.origin}/api/blacklist`);
  const data = await res.json();

  if (data.isBlacklisted) {
    const response = NextResponse.json({
      isBlacklisted: true,
      reason: data.reason,
    });
    response.headers.set('x-is-blacklisted', 'true');

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/log/visit',
};