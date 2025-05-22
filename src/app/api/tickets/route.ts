import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@backend/lib/mongodb';
import mongoose from 'mongoose';

// Define Ticket schema (same as in reserve route)
const TicketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    eventId: {
        type: String,
        required: true,
    },
    eventName: {
        type: String,
        required: true,
    },
    eventDate: {
        type: String,
        required: false,
    },
    eventTime: {
        type: String,
        required: false,
    },
    venue: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    reservedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['reserved', 'cancelled'],
        default: 'reserved',
    },
});

// Get Ticket model
const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);

export async function GET(request: NextRequest) {
    try {
        // Get user ID from cookie
        const cookieHeader = request.headers.get('cookie') || '';
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            if (key) acc[key] = value;
            return acc;
        }, {} as Record<string, string>);
        
        const token = cookies['auth'];

        if (!token) {
            return NextResponse.json(
                { message: 'Authentication required' },
                { status: 401 }
            );
        }

        // Verify token and get user ID
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET;
        
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return NextResponse.json(
                { message: 'Invalid token' },
                { status: 401 }
            );
        }

        if (typeof decoded !== 'object' || !decoded.userId) {
            return NextResponse.json(
                { message: 'Invalid token format' },
                { status: 401 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Get user's tickets
        const tickets = await Ticket.find({
            userId: decoded.userId,
            status: 'reserved'
        }).sort({ reservedAt: -1 });

        return NextResponse.json(tickets);

    } catch (error) {
        console.error('Error fetching tickets:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}