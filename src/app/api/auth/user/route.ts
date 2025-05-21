// app/api/auth/user/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@backend/lib/mongodb';
import mongoose from 'mongoose';

// Define User schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Get User model (creates one if it doesn't exist)
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export async function GET(request: Request) {
    try {
        // Alternative approach to get cookies that works in all Next.js versions
        const cookieHeader = request.headers.get('cookie') || '';
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            if (key) acc[key] = value;
            return acc;
        }, {} as Record<string, string>);
        
        const token = cookies['auth'];

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Verify token
        const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (typeof decoded !== 'object' || !decoded.userId) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Connect to the database
        await connectToDatabase();

        // Find user by ID
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Return user data
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error in user API route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}