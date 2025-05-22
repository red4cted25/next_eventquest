"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiUserCircle, BiEdit, BiSave, BiX } from 'react-icons/bi';
import { FaUser, FaEnvelope, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';

interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
}

interface ProfileStats {
    totalTickets: number;
    upcomingEvents: number;
}

export default function MyProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<ProfileStats>({ totalTickets: 0, upcomingEvents: 0 });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        email: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const userResponse = await fetch('/api/auth/user');
            if (!userResponse.ok) {
                router.push('/login');
                return;
            }
            
            const userData = await userResponse.json();
            setUser(userData);
            setEditForm({
                name: userData.name,
                email: userData.email
            });

            // Fetch user stats
            const ticketsResponse = await fetch('/api/tickets');
            if (ticketsResponse.ok) {
                const tickets = await ticketsResponse.json();
                const now = new Date();
                const upcoming = tickets.filter((ticket: any) => {
                    if (!ticket.eventDate) return true; // If no date, assume upcoming
                    return new Date(ticket.eventDate) > now;
                });
                
                setStats({
                    totalTickets: tickets.length,
                    upcomingEvents: upcoming.length
                });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchUserData();
    }, [router]);

    const handleSave = async () => {
        if (!editForm.name.trim() || !editForm.email.trim()) {
            setError('Name and email are required');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const response = await fetch('/api/auth/user', {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setEditing(false);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('An error occurred while updating your profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditForm({
            name: user?.name || '',
            email: user?.email || ''
        });
        setEditing(false);
        setError('');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">My Profile</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                Manage your account information
                                </p>
                            </div>
                            <div className="flex items-center">
                                <BiUserCircle className="text-blue-500 mr-2" size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid gap-6 lg:grid-cols-3">
                {/* Profile Card */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                                {!editing && (
                                    <button
                                    onClick={() => setEditing(true)}
                                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                    <BiEdit className="mr-1" size={16} />
                                    Edit
                                    </button>
                                )}
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Profile Picture */}
                                <div className="flex items-center">
                                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FaUser className="text-blue-500" size={32} />
                                    </div>
                                    <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                                    <p className="text-sm text-gray-500">Member since {formatDate(user.createdAt)}</p>
                                    </div>
                                </div>

                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                    </label>
                                    {editing ? (
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    ) : (
                                    <div className="flex items-center">
                                        <FaUser className="text-gray-400 mr-3" size={16} />
                                        <span className="text-gray-900">{user.name}</span>
                                    </div>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                    </label>
                                    {editing ? (
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    ) : (
                                    <div className="flex items-center">
                                        <FaEnvelope className="text-gray-400 mr-3" size={16} />
                                        <span className="text-gray-900">{user.email}</span>
                                    </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                {editing && (
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            <BiSave className="mr-1" size={16} />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <BiX className="mr-1" size={16} />
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    {/* Account Stats */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Activity</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FaTicketAlt className="text-blue-500 mr-3" size={16} />
                                    <span className="text-sm text-gray-600">Total Tickets</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900">{stats.totalTickets}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FaCalendarAlt className="text-green-500 mr-3" size={16} />
                                    <span className="text-sm text-gray-600">Upcoming Events</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900">{stats.upcomingEvents}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push('/tickets')}
                                className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                            >
                                View My Tickets
                            </button>
                            <button
                                onClick={() => router.push('/settings')}
                                className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Account Settings
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Browse Events
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}