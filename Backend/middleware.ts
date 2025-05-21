// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Paths that require authentication
const PROTECTED_PATHS = [
    '/tickets',
    '/profile',
    '/settings',
    '/rsvp',
];

// Paths that should redirect to home if already logged in
const AUTH_PATHS = [
    '/login',
    '/signup',
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Get token from cookies
    const token = request.cookies.get('auth')?.value;
    
    // Check if user is authenticated
    const isAuthenticated = token ? await verifyToken(token) : false;
    
    // Redirect authenticated users away from login/signup pages
    if (isAuthenticated && AUTH_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Redirect unauthenticated users to login for protected routes
    if (!isAuthenticated && PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    return NextResponse.next();
}

// Verify JWT token
async function verifyToken(token: string): Promise<boolean> {
    try {
        const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
        await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        return true;
    } catch (error) {
        return false;
    }
}

// Configure which paths this middleware applies to
export const config = {
  matcher: [
    '/tickets/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/rsvp/:path*',
    '/login/:path*',
    '/signup/:path*',
  ],
};