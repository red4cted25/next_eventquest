import { connectToDatabase } from '../../../../../Backend/lib/mongodb';
import ReviewModel from '../../../../../Backend/models/review';
import { NextResponse } from 'next/server';

export async function GET(
request: Request,
{ params }: { params: { _id: string } }
) {
const eventId = params._id;

if (!eventId) {
    return NextResponse.json(
    { error: 'Event ID is required' },
    { status: 400 }
    );
}

try {
    await connectToDatabase();
    
    // Find all reviews for this event, sort by newest first
    const reviews = await ReviewModel.find({ eventId })
    .sort({ createdAt: -1 })
    .lean();
    
    return NextResponse.json(reviews);
} catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
    { error: 'Failed to fetch reviews' },
    { status: 500 }
    );
}
}