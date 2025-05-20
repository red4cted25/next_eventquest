"use client"
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaStar, FaUser } from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';
import { fetchEventById, EventDetailData } from '../../../../Backend/lib/ticketmaster';

export default function EventPage() {
const params = useParams();
const router = useRouter();
const [event, setEvent] = useState<EventDetailData | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const getEventDetails = async () => {
    if (!params.id || typeof params.id !== 'string') {
        setLoading(false);
        return;
    }

    try {
        setLoading(true);
        const eventData = await fetchEventById(params.id);
        setEvent(eventData);
    } catch (error) {
        console.error("Error fetching event:", error);
    } finally {
        setLoading(false);
    }
    };

    getEventDetails();
}, [params.id]);

if (loading) {
    return (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    );
}

if (!event) {
    return (
    <div className="p-4 text-center">
        <h2 className="text-xl font-semibold">Event not found</h2>
        <p className="mt-2">Sorry, we couldn't find details for this event.</p>
        <button 
        onClick={() => router.push('/')}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
        Return to Home
        </button>
    </div>
    );
}

//NEED TO CONNECT TO DATA
const reviews = [
    {
    title: "Amazing show!",
    body: "One of the best concerts I've been to this year.",
    reviewer: "Concert Fan",
    rating: 5
    },
    {
    title: "Great energy",
    body: "The band was incredible. Venue could be better though.",
    reviewer: "Music Lover",
    rating: 4
    }
];


const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
    <FaStar 
        key={i} 
        className={i < rating ? "text-yellow-500" : "text-gray-300"} 
    />
    ));
};

return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-white">
    {/* Breadcrumbs */}
    <div className="p-2 text-xs">
        <Link href="/concerts" className="text-accent-gray">Concerts</Link> &gt; <Link href="/concerts/rock" className="text-accent-gray">Rock</Link> &gt; <span>{event.name}</span>
    </div>
    
    {/* Event Header */}
    <div className="px-4 pt-2">
        <h1 className="text-3xl font-bold">{event.name}</h1>
    </div>
    
    {/* Event Image */}
    <div className="p-4">
        {event.src && (
        <div className="w-full relative">
            <Image 
            src={event.src} 
            alt={event.name} 
            width={500}
            height={700}
            className="w-full h-auto"
            />
        </div>
        )}
    </div>
    
    {/* Event Details */}
    <div className="px-4">
        <div className="mb-4">
        <h2 className="font-bold text-lg">When</h2>
        <p className="text-accent-gray">{event.date || "Date TBA"}</p>
        <p className="text-accent-gray">{event.time || "Time TBA"}</p>
        </div>
        
        <div className="mb-4">
        <h2 className="font-bold text-lg">Where</h2>
        <p className="text-accent-gray">{event.city || "City TBA"}</p>
        <p className="text-accent-gray">{event.venue || "Venue TBA"}</p>
        </div>
        
        {/* Buy Tickets Button */}
        <div className="my-4 flex justify-center">
        <button 
            className="bg-blue-500 text-white px-8 py-2 rounded-full font-medium"
        >
            Buy Tickets
        </button>
        </div>
    </div>
    
    {/* Reviews Section - Horizontal line separator */}
    <div className="border-t border-gray-200 mt-2"></div>
    
    {/* Reviews Section */}
    <div className="p-4">
        <h2 className="font-bold text-lg mb-2">Reviews</h2>
        
        <div className="space-y-6">
        {reviews.map((review, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
            <div className="flex mb-1">
                {renderStars(review.rating)}
            </div>
            <h3 className="font-semibold">{review.title}</h3>
            <p className="text-sm text-accent-gray">{review.body}</p>
            <div className="flex items-center mt-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                <FaUser className="text-gray-500 text-xs" />
                </div>
                <span className="text-xs">{review.reviewer}</span>
            </div>
            </div>
        ))}
        </div>
    </div>
    </div>
);
}