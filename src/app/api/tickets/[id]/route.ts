import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@backend/lib/mongodb';
import { User } from '@backend/models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Use the same Ticket schema
const TicketSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    eventId: { type: String, required: true },
    eventName: { type: String, required: true },
    eventDate: { type: String, required: false },
    eventTime: { type: String, required: false },
    venue: { type: String, required: false },
    city: { type: String, required: false },
    reservedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['reserved', 'cancelled'], default: 'reserved' },
});

const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
            return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
        }

        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
        
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: 'Current and new passwords are required' }, { status: 400 });
        }

        await connectToDatabase();

        // Find user and verify current password
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
        }

        // Hash new password and update
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(decoded.userId, { password: hashedNewPassword });

        return NextResponse.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Error changing password:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}