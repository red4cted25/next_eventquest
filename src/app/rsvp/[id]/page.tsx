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
    <div className="flex flex-col w-full max-w-md mx-auto bg-white lg:max-w-6xl lg:flex-row lg:flex-wrap lg:px-6 lg:pt-4">
    {/* Breadcrumbs */}
    <div className="p-2 text-xs lg:w-full lg:p-4 lg:text-sm">
        <Link href="/classification" className="text-accent-gray hover:underline">Concerts</Link> &gt; <Link href="/concerts/rock" className="text-accent-gray hover:underline">Rock</Link> &gt; <span>{event.name}</span>
    </div>
    
    {/* Left column on desktop */}
    <div className="lg:w-1/2 lg:pr-8">
        {/* Event Header */}
        <div className="px-4 pt-2 lg:px-0 lg:pt-0">
        <h1 className="text-3xl font-bold lg:text-4xl">{event.name}</h1>
        </div>
        
        {/* Event Image */}
        <div className="p-4 lg:px-0 lg:py-6">
        {event.src && (
            <div className="w-full relative">
            <Image 
                src={event.src} 
                alt={event.name} 
                width={500}
                height={700}
                className="w-full h-auto rounded-lg shadow-md"
            />
            </div>
        )}
        </div>
    </div>
    
    {/* Right column on desktop */}
    <div className="lg:w-1/2">
        {/* Event Details - Styled as a card on desktop */}
        <div className="px-4 lg:bg-gray-50 lg:p-6 lg:rounded-lg lg:shadow-sm lg:mt-32">
        <div className="mb-4">
            <h2 className="font-bold text-lg lg:text-xl">When</h2>
            <p className="text-accent-gray lg:text-lg">{event.date || "Date TBA"}</p>
            <p className="text-accent-gray lg:text-lg">{event.time || "Time TBA"}</p>
        </div>
        
        <div className="mb-4">
            <h2 className="font-bold text-lg lg:text-xl">Where</h2>
            <p className="text-accent-gray lg:text-lg">{event.city || "City TBA"}</p>
            <p className="text-accent-gray lg:text-lg">{event.venue || "Venue TBA"}</p>
        </div>
        
        {/* Buy Tickets Button */}
        <div className="my-4 flex justify-center">
            <button 
            className="bg-blue-500 text-white px-8 py-2 rounded-full font-medium hover:bg-blue-600 transition-colors lg:px-12 lg:py-3 lg:text-lg"
            >
            Buy Tickets
            </button>
        </div>
        </div>
    </div>
    
    {/* Reviews Section - Full width on desktop */}
    <div className="w-full">
        {/* Reviews Section - Horizontal line separator */}
        <div className="border-t border-gray-200 mt-2 lg:my-8"></div>
        
        {/* Reviews Section */}
        <div className="p-4 lg:p-0">
        <h2 className="font-bold text-lg mb-2 lg:text-2xl lg:mb-6">Reviews</h2>
        
        <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            {reviews.map((review, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 lg:border lg:p-4 lg:rounded-lg lg:shadow-sm">
                <div className="flex mb-1">
                {renderStars(review.rating)}
                </div>
                <h3 className="font-semibold lg:text-lg">{review.title}</h3>
                <p className="text-sm text-accent-gray lg:text-base">{review.body}</p>
                <div className="flex items-center mt-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                    <FaUser className="text-gray-500 text-xs" />
                </div>
                <span className="text-xs lg:text-sm">{review.reviewer}</span>
                </div>
            </div>
            ))}
        </div>
        </div>
    </div>
    </div>
);
}