import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@backend/lib/mongodb';
import mongoose from 'mongoose';

// Define Ticket schema
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

// Get Ticket model (creates one if it doesn't exist)
const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);

export async function POST(request: NextRequest) {
    try {
        // Get user ID from cookie (similar to user route)
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

        // Get request body
        const { eventId, eventName, eventDate, eventTime, venue, city } = await request.json();

        if (!eventId || !eventName) {
            return NextResponse.json(
                { message: 'Event ID and name are required' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Check if user already has a ticket for this event
        const existingTicket = await Ticket.findOne({
            userId: decoded.userId,
            eventId: eventId,
            status: 'reserved'
        });

        if (existingTicket) {
            return NextResponse.json(
                { message: 'You already have a reservation for this event' },
                { status: 409 }
            );
        }

        // Create new ticket reservation
        const ticket = await Ticket.create({
            userId: decoded.userId,
            eventId,
            eventName,
            eventDate,
            eventTime,
            venue,
            city,
        });

        return NextResponse.json(
            { 
                message: 'Ticket reserved successfully',
                ticketId: ticket._id,
                ticket: {
                eventName: ticket.eventName,
                eventDate: ticket.eventDate,
                eventTime: ticket.eventTime,
                venue: ticket.venue,
                city: ticket.city,
                reservedAt: ticket.reservedAt,
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error reserving ticket:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}