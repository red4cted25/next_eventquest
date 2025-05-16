import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RxHamburgerMenu, RxCross1 } from 'react-icons/rx'

const Header = () => {
    // State for mobile menu and dropdowns (including new user dropdown)
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    type Size = {
        width: number | undefined;
        height: number | undefined;
    }
    const [size, setSize] = useState<Size>({
        width: undefined,
        height: undefined
    });

    // Update window dimensions
    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        handleResize(); // Set initial size
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Reset dropdowns when menu closes or screen resizes
    useEffect(() => {
        if (size.width !== undefined && size.width > 768 && menuOpen) {
            setMenuOpen(false);
        }
    }, [size.width, menuOpen]);


    const menuToggleHandler = ():void => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header>
            
        </header>
    );
};

export default Header;
