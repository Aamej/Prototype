import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Only protect API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Skip auth routes
    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
      return NextResponse.next();
    }

    // Get the auth token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      // Verify the token
      verify(token, process.env.JWT_SECRET || 'your-secret-key');
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
} 