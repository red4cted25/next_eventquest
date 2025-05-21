import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Review document
export interface IReview extends Document {
title: string;
body: string;
reviewer: string;
rating: number;
eventId: string;
createdAt: Date;
updatedAt: Date;
}

// Define the schema
const ReviewSchema: Schema = new Schema(
{
    title: { type: String, required: true },
    body: { type: String, required: true },
    reviewer: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
},
{ timestamps: true }
);

// Create or retrieve the model
export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);