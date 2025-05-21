import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">
                {/* Logo and Social Links */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">EventQuest®</h2>
                    <div className="mb-4">
                        <p className="mb-2">LET'S CONNECT</p>
                        <div className="flex gap-4">
                            <div className="w-6 h-6 border border-white flex items-center justify-center">
                                <FaFacebookF size={12} />
                            </div>
                            <div className="w-6 h-6 border border-white flex items-center justify-center">
                                <FaTwitter size={12} />
                            </div>
                            <div className="w-6 h-6 border border-white flex items-center justify-center">
                                <FaInstagram size={12} />
                            </div>
                            <div className="w-6 h-6 border border-white flex items-center justify-center">
                                <FaYoutube size={12} />
                            </div>
                            <div className="w-6 h-6 border border-white flex items-center justify-center">
                                <FaTiktok size={12} />
                            </div>
                        </div>
                    </div>
                    <p className="text-xs">By continuing past this page, you agree to our <span className="underline">Terms of Use</span>.</p>
                </div>

                {/* Links Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <h3 className="text-sm font-bold mb-3">HELPFUL LINKS</h3>
                    <ul className="space-y-2 text-sm">
                        <li>My Events</li>
                        <li>RSVP</li>
                        <li>Events</li>
                        <li>Reviews</li>
                        <li>My Account</li>
                    </ul>
                </div>
                </div>

                {/* Copyright */}
                <div className="text-xs border-t border-gray-700 pt-4">
                <p>© 2025 EventQuest. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;