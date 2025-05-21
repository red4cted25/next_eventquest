// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        // Clear the auth token cookie using response headers instead
        return new NextResponse(JSON.stringify({ message: 'Logged out successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': 'auth=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax',
            },
        });
    } catch (error) {
        console.error('Error in logout API route:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500 }
        );
    }
}