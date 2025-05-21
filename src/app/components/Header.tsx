"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RxHamburgerMenu, RxCross1 } from 'react-icons/rx'
import { FaUser, FaSignOutAlt, FaSistrix, FaTicketAlt } from 'react-icons/fa';
import { BiNavigation, BiCalendarAlt, BiUserCircle, BiCog } from "react-icons/bi";

// Define user type
type User = {
    _id: string;
    name: string;
    email: string;
};

const Header = () => {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Fetch user data on component mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth/user');
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUser();
    }, []);
    
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        if (accountMenuOpen) setAccountMenuOpen(false);
    };
    
    const toggleAccountMenu = () => {
        setAccountMenuOpen(!accountMenuOpen);
        if (mobileMenuOpen) setMobileMenuOpen(false);
    };
    
    const handleSignOut = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                setUser(null);
                setAccountMenuOpen(false);
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };
    
    const navigateTo = (path: string) => {
        router.push(path);
        setAccountMenuOpen(false);
    };

    return (
        <div className="w-full">
            {/* Mobile Navbar */}
            <div className="lg:hidden w-full bg-jet text-white flex justify-between items-center p-4">
                <div className="flex items-center">
                    <button onClick={toggleMobileMenu} className="mr-2">
                        <RxHamburgerMenu size={24} />
                    </button>
                    <Link href='/' className="m-1 text-2xl">EventQuest<sup>®</sup></Link>
                </div>
                
                <div className="flex items-center">
                    <button onClick={toggleAccountMenu}>
                        <FaUser size={24} />
                    </button>
                </div>
            </div>
            
            {/* Desktop Navbar */}
            <div className="hidden lg:flex w-full bg-jet text-white justify-between items-center p-4">
                <div className="flex items-center space-x-8">
                    <Link href='/' className="m-1 text-2xl font-bold">EventQuest<sup>®</sup></Link>
                    <nav className="flex items-center">
                        <Link href="#" className="text-azure hover:text-sapphire px-4">Concerts</Link>
                        <span className="text-azure">|</span>
                        <Link href="#" className="text-white hover:text-gray-300 px-4">Sports</Link>
                        <span className="text-azure">|</span>
                        <Link href="#" className="text-white hover:text-gray-300 px-4">Arts, Theater & Comedy</Link>
                        <span className="text-azure">|</span>
                        <Link href="#" className="text-white hover:text-gray-300 px-4">Family</Link>
                    </nav>
                </div>
                
                <div className="flex items-center space-x-6">
                    <button onClick={toggleAccountMenu} className="hover:text-gray-300">
                        <FaUser size={24} />
                    </button>
                    <span className="font-medium">
                        {loading ? 'Loading...' : user ? `${user.name}` : 'Sign In'}
                    </span>
                </div>
            </div>
            
            {/* Search Bar */}
            <div className="w-full bg-white p-4 flex items-center justify-center text-black lg:bg-jet lg:py-8">
                <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row lg:shadow-2xl">
                    {/* Location and Date Filters */}
                    <div className="w-full flex justify-center mb-4 pb-4 border-b border-accent-gray lg:border-b-0 lg:mb-0 lg:w-2/5 lg:bg-white lg:py-4">
                        {/* Location Filter */}
                        <div className="flex items-center w-1/2 px-2 border-r border-accent-gray">
                            <BiNavigation size={22} className="text-azure mr-2 flex-shrink-0" />
                            <input 
                                type="text" 
                                placeholder="City or Zip Code" 
                                className="bg-transparent outline-none w-full"
                            />
                        </div>
                        
                        {/* Date Filter */}
                        <div className="flex items-center w-1/2 pl-2 lg:border-r lg:border-accent-gray">
                            <BiCalendarAlt size={22} className="text-azure mr-2 flex-shrink-0" />
                            <select className="bg-transparent outline-none w-full appearance-none cursor-pointer">
                                <option>All Dates</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Search Input */}
                    <div className="w-full flex items-center px-4 py-3 border border-accent-gray rounded-md lg:border-none lg:w-3/5 lg:bg-white lg:rounded-none">
                        <input 
                            type="text" 
                            placeholder="Search by Artist, Event, or Venue" 
                            className="bg-transparent outline-none flex-grow"
                        />
                        <FaSistrix size={22} className="text-azure flex-shrink-0 cursor-pointer" />
                    </div>
                </div>
            </div>
            
            {/* Left side menu - sliding from left */}
            <div className={`fixed inset-y-0 left-0 w-3/4 max-w-xs bg-black text-white transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">EventQuest<sup>®</sup></h2>
                    <button onClick={toggleMobileMenu}>
                        <RxCross1 size={24} />
                    </button>
                </div>
                <nav className="py-4">
                    <Link href="#" className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                        <span className="font-medium">CONCERTS</span>
                        <span className="text-lg">&rsaquo;</span>
                    </Link>
                    <Link href="#" className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                        <span className="font-medium">SPORTS</span>
                        <span className="text-lg">&rsaquo;</span>
                    </Link>
                    <Link href="#" className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                        <span className="font-medium">ARTS, THEATER & COMEDY</span>
                        <span className="text-lg">&rsaquo;</span>
                    </Link>
                    <Link href="#" className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                        <span className="font-medium">FAMILY</span>
                        <span className="text-lg">&rsaquo;</span>
                    </Link>
                </nav>
                <div className="mt-8">
                    <div className="px-4 py-2 text-sm font-medium text-gray-400">My Events</div>
                    <Link href="#" className="block px-4 py-2 border-b border-gray-800">RSVP</Link>
                    <Link href="#" className="block px-4 py-2 border-b border-gray-800">Events</Link>
                    <Link href="#" className="block px-4 py-2 border-b border-gray-800">Reviews</Link>
                    {user ? (
                        <Link href="#" className="block px-4 py-2 border-b border-gray-800">My Account</Link>
                    ) : (
                        <button 
                            onClick={() => navigateTo('/login')}
                            className="block w-full text-left px-4 py-2 border-b border-gray-800"
                        >
                            Login / Sign Up
                        </button>
                    )}
                </div>
            </div>
            
            {/* Right side menu - sliding from right */}
            <div className={`fixed inset-y-0 right-0 w-3/4 lg:w-1/3 max-w-sm bg-white text-gray-800 transform ${accountMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold">
                        {loading ? 'Loading...' : user ? `Welcome back, ${user.name}!` : 'Welcome to EventQuest'}
                    </h2>
                    <button onClick={toggleAccountMenu}>
                        <RxCross1 size={24} className="text-blue-500" />
                    </button>
                </div>
                
                {loading ? (
                    <div className="p-8 flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-azure"></div>
                    </div>
                ) : user ? (
                    /* Logged in user content */
                    <nav className="py-4">
                        <button 
                            onClick={() => navigateTo('/tickets')}
                            className="w-full border-b border-gray-200"
                        >
                            <div className="px-4 py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                    <FaTicketAlt className="text-azure mr-3" size={20} />
                                    <span className="font-medium">My Tickets</span>
                                </div>
                                <span className="text-lg">&rsaquo;</span>
                            </div>
                        </button>
                        
                        <button 
                            onClick={() => navigateTo('/profile')}
                            className="w-full border-b border-gray-200"
                        >
                            <div className="px-4 py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                    <BiUserCircle className="text-azure mr-3" size={20} />
                                    <span className="font-medium">My Profile</span>
                                </div>
                                <span className="text-lg">&rsaquo;</span>
                            </div>
                        </button>
                        
                        <button 
                            onClick={() => navigateTo('/settings')}
                            className="w-full border-b border-gray-200"
                        >
                            <div className="px-4 py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                    <BiCog className="text-azure mr-3" size={20} />
                                    <span className="font-medium">Account Settings</span>
                                </div>
                                <span className="text-lg">&rsaquo;</span>
                            </div>
                        </button>
                        
                        <button 
                            onClick={() => navigateTo('/rsvp')}
                            className="w-full border-b border-gray-200"
                        >
                            <div className="px-4 py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                    <BiCalendarAlt className="text-azure mr-3" size={20} />
                                    <span className="font-medium">My RSVPs</span>
                                </div>
                                <span className="text-lg">&rsaquo;</span>
                            </div>
                        </button>
                        
                        <button 
                            onClick={handleSignOut}
                            className="w-full px-4 py-3 flex items-center text-red-500"
                        >
                            <FaSignOutAlt className="mr-3" size={20} />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </nav>
                ) : (
                    /* Guest user content */
                    <div className="p-4">
                        <p className="text-gray-600 mb-6">Log in to access your tickets, save events, and get personalized recommendations.</p>
                        
                        <button 
                            onClick={() => navigateTo('/login')}
                            className="w-full bg-azure text-white py-3 rounded-md font-medium mb-3"
                        >
                            Log In
                        </button>
                        
                        <button 
                            onClick={() => navigateTo('/signup')}
                            className="w-full border border-azure text-azure py-3 rounded-md font-medium"
                        >
                            Create Account
                        </button>
                        
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="font-medium mb-2">Popular in EventQuest</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <Link href="#" className="block hover:text-azure">Concerts Near Me</Link>
                                <Link href="#" className="block hover:text-azure">Sports Events</Link>
                                <Link href="#" className="block hover:text-azure">Theater Performances</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Overlay when menu is open */}
            {(mobileMenuOpen || accountMenuOpen) && (
                <div 
                    className="fixed inset-0 bg-black/75 z-40"
                    onClick={() => {
                        setMobileMenuOpen(false);
                        setAccountMenuOpen(false);
                    }}
                />
            )}
            </div>
        );
};

export default Header;