"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RxHamburgerMenu, RxCross1 } from 'react-icons/rx'
import { FaUser, FaSignOutAlt, FaSistrix, } from 'react-icons/fa';
import { BiNavigation, BiCalendarAlt } from "react-icons/bi";


const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        if (accountMenuOpen) setAccountMenuOpen(false);
    };
    
    const toggleAccountMenu = () => {
        setAccountMenuOpen(!accountMenuOpen);
        if (mobileMenuOpen) setMobileMenuOpen(false);
    };

    return (
        <div className="w-full">
            {/* Mobile Navbar */}
            <div className="lg:hidden w-full bg-jet text-white flex justify-between items-center p-4">
                <div className="flex items-center">
                    <button onClick={toggleMobileMenu} className="mr-2">
                        <RxHamburgerMenu size={24} />
                    </button>
                    <h1 className="text-2xl">EventQuest<sup>®</sup></h1>
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
                    <h1 className="text-2xl font-bold">EventQuest<sup>®</sup></h1>
                    <nav className="flex items-center">
                        <a href="#" className="text-azure hover:text-sapphire px-4">Concerts</a>
                        <span className="text-azure">|</span>
                        <a href="#" className="text-white hover:text-gray-300 px-4">Sports</a>
                        <span className="text-azure">|</span>
                        <a href="#" className="text-white hover:text-gray-300 px-4">Arts, Theater & Comedy</a>
                        <span className="text-azure">|</span>
                        <a href="#" className="text-white hover:text-gray-300 px-4">Family</a>
                    </nav>
                </div>
                
                <div className="flex items-center space-x-6">
                    <button onClick={toggleAccountMenu} className="hover:text-gray-300">
                        <FaUser size={24} />
                    </button>
                    <span className="font-medium">My Account</span>
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
                <a href="#" className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                    <span className="font-medium">CONCERTS</span>
                    <span className="text-lg">&rsaquo;</span>
                </a>
                <a href="#" className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                    <span className="font-medium">SPORTS</span>
                    <span className="text-lg">&rsaquo;</span>
                </a>
                <a href="#" className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                    <span className="font-medium">ARTS, THEATER & COMEDY</span>
                    <span className="text-lg">&rsaquo;</span>
                </a>
                <a href="#" className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                    <span className="font-medium">FAMILY</span>
                    <span className="text-lg">&rsaquo;</span>
                </a>
                </nav>
                <div className="mt-8">
                <div className="px-4 py-2 text-sm font-medium text-gray-400">My Events</div>
                <a href="#" className="block px-4 py-2 border-b border-gray-800">RSVP</a>
                <a href="#" className="block px-4 py-2 border-b border-gray-800">Events</a>
                <a href="#" className="block px-4 py-2 border-b border-gray-800">Reviews</a>
                <a href="#" className="block px-4 py-2 border-b border-gray-800">My Account</a>
                </div>
            </div>
            
            {/* Right side menu - sliding from right */}
            <div className={`fixed inset-y-0 right-0 w-3/4 lg:w-1/3 max-w-sm bg-white text-gray-800 transform ${accountMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold">Welcome back!</h2>
                    <button onClick={toggleAccountMenu}>
                        <RxCross1 size={24} className="text-blue-500" />
                    </button>
                </div>
                <div className="px-4 py-2">
                    <div className="text-sm font-medium text-gray-500">Name</div>
                </div>
                <nav className="py-4">
                    <div className="border-b border-gray-200">
                        <div className="px-4 py-3 flex justify-between items-center">
                            <span className="font-medium">My Tickets</span>
                            <span className="text-lg">&darr;</span>
                        </div>
                    </div>
                    <div className="border-b border-gray-200">
                        <div className="px-4 py-3 flex justify-between items-center">
                            <span className="font-medium">My Profile</span>
                            <span className="text-lg">&darr;</span>
                        </div>
                    </div>
                    <div className="border-b border-gray-200">
                        <div className="px-4 py-3 flex justify-between items-center">
                            <span className="font-medium">My Settings</span>
                            <span className="text-lg">&darr;</span>
                        </div>
                    </div>
                    <div className="px-4 py-3">
                        <span className="font-medium">Sign Out</span>
                    </div>
                </nav>
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