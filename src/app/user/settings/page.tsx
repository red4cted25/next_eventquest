"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiCog, BiSave, BiTrash, BiShield, BiBell } from 'react-icons/bi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
}

export default function AccountSettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    
    // Password change form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    
    // Notification preferences
    const [notifications, setNotifications] = useState({
        emailUpdates: true,
        eventReminders: true,
        promotionalEmails: false
    });
    const [notificationError, setNotificationError] = useState('');
    const [notificationSuccess, setNotificationSuccess] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/auth/user');
                if (!response.ok) {
                    router.push('/login');
                    return;
                }
                
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters long');
            return;
        }

        setSaving(true);

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setPasswordSuccess('Password updated successfully');
                setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
                });
            } else {
                setPasswordError(data.message || 'Failed to update password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setPasswordError('An error occurred while updating your password');
        } finally {
            setSaving(false);
        }
    };

    const handleNotificationUpdate = async () => {
        setNotificationError('');
        setNotificationSuccess('');
        setSaving(true);

        try {
        const response = await fetch('/api/user/notifications', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(notifications),
        });

        if (response.ok) {
            setNotificationSuccess('Notification preferences updated');
        } else {
            setNotificationError('Failed to update notification preferences');
        }
        } catch (error) {
        console.error('Error updating notifications:', error);
        setNotificationError('An error occurred while updating preferences');
        } finally {
        setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);

        try {
        const response = await fetch('/api/auth/user', {
            method: 'DELETE',
        });

        if (response.ok) {
            // Redirect to home page after account deletion
            router.push('/?deleted=true');
        } else {
            alert('Failed to delete account. Please try again.');
        }
        } catch (error) {
        console.error('Error deleting account:', error);
        alert('An error occurred while deleting your account');
        } finally {
        setDeleting(false);
        setShowDeleteConfirm(false);
        }
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
                        <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Account Settings</h1>
                        <p className="mt-1 text-sm text-gray-500">
                        Manage your account security and preferences
                        </p>
                    </div>
                    <div className="flex items-center">
                        <BiCog className="text-blue-500 mr-2" size={24} />
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                {/* Password Security */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6">
                    <div className="flex items-center mb-6">
                        <BiShield className="text-blue-500 mr-3" size={24} />
                        <h2 className="text-lg font-semibold text-gray-900">Password & Security</h2>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        {passwordError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{passwordError}</p>
                        </div>
                        )}
                        
                        {passwordSuccess && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-600">{passwordSuccess}</p>
                        </div>
                        )}

                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            />
                            <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                            {showPasswords.current ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                            </button>
                        </div>
                        </div>

                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            />
                            <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                            {showPasswords.new ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                            </button>
                        </div>
                        </div>

                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            />
                            <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                            {showPasswords.confirm ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                            </button>
                        </div>
                        </div>

                        <div className="pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            <BiSave className="mr-2" size={16} />
                            {saving ? 'Updating...' : 'Update Password'}
                        </button>
                        </div>
                    </form>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6">
                    <div className="flex items-center mb-6">
                        <BiBell className="text-blue-500 mr-3" size={24} />
                        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                    </div>

                    {notificationError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{notificationError}</p>
                        </div>
                    )}
                    
                    {notificationSuccess && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-600">{notificationSuccess}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Email Updates</h3>
                            <p className="text-sm text-gray-500">Receive updates about your account and tickets</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                            type="checkbox"
                            checked={notifications.emailUpdates}
                            onChange={(e) => setNotifications({ ...notifications, emailUpdates: e.target.checked })}
                            className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        </div>

                        <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Event Reminders</h3>
                            <p className="text-sm text-gray-500">Get reminded about upcoming events you've registered for</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                            type="checkbox"
                            checked={notifications.eventReminders}
                            onChange={(e) => setNotifications({ ...notifications, eventReminders: e.target.checked })}
                            className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        </div>

                        <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Promotional Emails</h3>
                            <p className="text-sm text-gray-500">Receive information about new events and special offers</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                            type="checkbox"
                            checked={notifications.promotionalEmails}
                            onChange={(e) => setNotifications({ ...notifications, promotionalEmails: e.target.checked })}
                            className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                        onClick={handleNotificationUpdate}
                        disabled={saving}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                        <BiSave className="mr-2" size={16} />
                        {saving ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-lg shadow-md border-l-4 border-red-500">
                    <div className="p-6">
                    <div className="flex items-center mb-6">
                        <BiTrash className="text-red-500 mr-3" size={24} />
                        <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <h3 className="text-sm font-medium text-red-800 mb-2">Delete Account</h3>
                        <p className="text-sm text-red-700 mb-4">
                        Once you delete your account, there is no going back. This will permanently delete your 
                        account, all your tickets, and remove all associated data.
                        </p>
                        
                        {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                        >
                            <BiTrash className="mr-2" size={16} />
                            Delete Account
                        </button>
                        ) : (
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-red-800">
                            Are you absolutely sure? This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            </div>
                        </div>
                        )}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}