"use client"
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaStar, FaUser } from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';
import { fetchEventById, EventDetailData } from '../../../../Backend/lib/ticketmaster';

interface User {
    _id: string;
    name: string;
    email: string;
}

export default function EventPage() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<EventDetailData | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState(true);
    const [ticketLoading, setTicketLoading] = useState(false);
    const [reservationStatus, setReservationStatus] = useState<string>('');

    // Check if user is authenticated
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/user');
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            } finally {
                setUserLoading(false);
            }
        };

        checkAuth();
    }, []);

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

    useEffect(() => {
        const fetchReviews = async () => {
            if (!params.id) return;
            
            try {
                setReviewsLoading(true);
                const response = await fetch(`/api/reviews/${params.id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch reviews');
                }
                
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setReviews([]);
            } finally {
                setReviewsLoading(false);
            }
        };

        fetchReviews();
    }, [params.id]);

    const handleBuyTickets = async () => {
        if (!user) {
            // Redirect to login if not authenticated
            router.push('/login');
            return;
        }

        if (!event || !params.id) return;

        try {
            setTicketLoading(true);
            setReservationStatus('');

            const response = await fetch('/api/tickets/reserve', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                eventId: params.id,
                eventName: event.name,
                eventDate: event.date,
                eventTime: event.time,
                venue: event.venue,
                city: event.city,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setReservationStatus('success');
                // Optionally redirect to a tickets page after a delay
                setTimeout(() => {
                router.push('/tickets');
                }, 2000);
            } else {
                setReservationStatus('error');
                console.error('Reservation failed:', data.message);
            }
        } catch (error) {
            console.error('Error reserving ticket:', error);
            setReservationStatus('error');
        } finally {
            setTicketLoading(false);
        }
    };

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

    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, i) => (
            <FaStar 
                key={i} 
                className={i < rating ? "text-yellow-500" : "text-gray-300"} 
            />
        ));
    };

    const renderTicketButton = () => {
        if (userLoading) {
            return (
                <div className="my-4 flex justify-center">
                    <div className="bg-gray-300 text-gray-500 px-8 py-2 rounded-full font-medium lg:px-12 lg:py-3 lg:text-lg">
                        Loading...
                    </div>
                </div>
            );
        }

        if (!user) {
            return (
                <div className="my-4 flex flex-col items-center">
                    <button 
                        onClick={handleBuyTickets}
                        className="bg-blue-500 text-white px-8 py-2 rounded-full font-medium hover:bg-blue-600 transition-colors lg:px-12 lg:py-3 lg:text-lg"
                    >
                        Reserve Tickets
                    </button>
                    <p className="text-sm text-gray-500 mt-2">Login required to reserve tickets</p>
                </div>
            );
        }

        if (ticketLoading) {
            return (
                <div className="my-4 flex justify-center">
                    <div className="bg-gray-400 text-white px-8 py-2 rounded-full font-medium lg:px-12 lg:py-3 lg:text-lg flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Reserving...
                    </div>
                </div>
            );
        }

        if (reservationStatus === 'success') {
            return (
                <div className="my-4 flex flex-col items-center">
                    <div className="bg-green-500 text-white px-8 py-2 rounded-full font-medium lg:px-12 lg:py-3 lg:text-lg">
                        ✓ Ticket Reserved!
                    </div>
                    <p className="text-sm text-green-600 mt-2">Redirecting to your tickets...</p>
                </div>
            );
        }

        if (reservationStatus === 'error') {
            return (
                <div className="my-4 flex flex-col items-center">
                    <button 
                        onClick={handleBuyTickets}
                        className="bg-red-500 text-white px-8 py-2 rounded-full font-medium hover:bg-red-600 transition-colors lg:px-12 lg:py-3 lg:text-lg"
                    >
                        Try Again
                    </button>
                    <p className="text-sm text-red-600 mt-2">Reservation failed. Please try again.</p>
                </div>
            );
        }

        return (
            <div className="my-4 flex justify-center">
                <button 
                    onClick={handleBuyTickets}
                    className="bg-blue-500 text-white px-8 py-2 rounded-full font-medium hover:bg-blue-600 transition-colors lg:px-12 lg:py-3 lg:text-lg"
                >
                    Reserve Tickets
                </button>
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full max-w-md mx-auto bg-white lg:max-w-6xl lg:flex-row lg:flex-wrap lg:px-6 lg:pt-4 lg:mb-12">
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
                    
                    {/* Dynamic Ticket Button */}
                    {renderTicketButton()}
                </div>
            </div>
            
            {/* Reviews Section - Full width on desktop */}
            <div className="w-full">
                {/* Reviews Section - Horizontal line separator */}
                <div className="border-t border-gray-200 mt-2 lg:my-8"></div>
                
                {/* Reviews Section */}
                <div className="p-4 lg:p-0">
                    <h2 className="font-bold text-lg mb-2 lg:text-2xl lg:mb-6">Reviews</h2>
                    
                    {reviewsLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
                            {reviews.map((review) => (
                                <div key={review._id} className="border-b border-gray-200 pb-4 lg:border lg:p-4 lg:rounded-lg lg:shadow-sm">
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
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No reviews yet for this event.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}