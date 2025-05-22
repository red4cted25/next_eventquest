"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

interface Ticket {
    _id: string;
    eventId: string;
    eventName: string;
    eventDate?: string;
    eventTime?: string;
    venue?: string;
    city?: string;
    reservedAt: string;
    status: 'reserved' | 'cancelled';
}

export default function MyTicketsPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [cancellingTicket, setCancellingTicket] = useState<string | null>(null);

    useEffect(() => {
        const checkAuthAndFetchTickets = async () => {
            try {
                // Check if user is authenticated
                const userResponse = await fetch('/api/auth/user');
                if (!userResponse.ok) {
                router.push('/login');
                return;
                }
                const userData = await userResponse.json();
                setUser(userData);

                // Fetch tickets
                const ticketsResponse = await fetch('/api/tickets');
                if (ticketsResponse.ok) {
                const ticketsData = await ticketsResponse.json();
                setTickets(ticketsData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetchTickets();
    }, [router]);

    const handleCancelTicket = async (ticketId: string) => {
        setCancellingTicket(ticketId);
        try {
            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Remove the ticket from the list
                setTickets(tickets.filter(ticket => ticket._id !== ticketId));
            } else {
                console.error('Failed to cancel ticket');
            }
        } catch (error) {
            console.error('Error cancelling ticket:', error);
        } finally {
            setCancellingTicket(null);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Date TBA';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatReservedDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-6">
                    <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">My Tickets</h1>
                        <p className="mt-1 text-sm text-gray-500">
                        Manage your event reservations
                        </p>
                    </div>
                    <div className="flex items-center">
                        <FaTicketAlt className="text-blue-500 mr-2" size={24} />
                        <span className="text-sm text-gray-500">
                        {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}
                        </span>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {tickets.length === 0 ? (
                <div className="text-center py-12">
                    <FaTicketAlt className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                    You haven't reserved any tickets yet. Start exploring events!
                    </p>
                    <div className="mt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Browse Events
                    </Link>
                    </div>
                </div>
                ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tickets.map((ticket) => (
                    <div key={ticket._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                {ticket.eventName}
                            </h3>
                            
                            <div className="space-y-2 mb-4">
                                {ticket.eventDate && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaCalendarAlt className="mr-2 text-blue-500" size={14} />
                                    <span>{formatDate(ticket.eventDate)}</span>
                                </div>
                                )}
                                
                                {ticket.eventTime && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaClock className="mr-2 text-blue-500" size={14} />
                                    <span>{ticket.eventTime}</span>
                                </div>
                                )}
                                
                                {(ticket.venue || ticket.city) && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaMapMarkerAlt className="mr-2 text-blue-500" size={14} />
                                    <span>
                                    {ticket.venue && ticket.city 
                                        ? `${ticket.venue}, ${ticket.city}`
                                        : ticket.venue || ticket.city}
                                    </span>
                                </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                Reserved {formatReservedDate(ticket.reservedAt)}
                                </div>
                                <div className="flex items-center space-x-2">
                                <Link
                                    href={`/event/${ticket.eventId}`}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    View Event
                                </Link>
                                <button
                                    onClick={() => handleCancelTicket(ticket._id)}
                                    disabled={cancellingTicket === ticket._id}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                                >
                                    {cancellingTicket === ticket._id ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-red-600 mr-1"></div>
                                        Cancelling...
                                    </div>
                                    ) : (
                                    <div className="flex items-center">
                                        <FaTrash className="mr-1" size={12} />
                                        Cancel
                                    </div>
                                    )}
                                </button>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        
                        {/* Ticket-like bottom section */}
                        <div className="bg-gray-50 px-6 py-3 border-t border-dashed border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Ticket ID
                            </span>
                            <span className="text-xs font-mono text-gray-700">
                            {ticket._id.slice(-8).toUpperCase()}
                            </span>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    );
}