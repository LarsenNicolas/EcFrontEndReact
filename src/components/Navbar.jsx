import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TagIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import {useCartStore} from "../store/useCartStore.js";

const Navbar = () => {
    const cart = useCartStore((state) => state.cart);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const location = useLocation();
    const isHome = location.pathname === "/";
    const [showNav, setShowNav] = useState(true);
    const [scrollTimeout, setScrollTimeout] = useState(null);

    useEffect(() => {
        if (!isHome) {
            setShowNav(true);
            return;
        }

        const handleScroll = () => {
            setShowNav(true);
            if (scrollTimeout) clearTimeout(scrollTimeout);

            const timeout = setTimeout(() => {
                setShowNav(false);
            }, 2000);

            setScrollTimeout(timeout);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [isHome, scrollTimeout]);

    const navContent = (
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-white text-xl font-bold tracking-wide">
                <img
                    src="/logo-aet.png"
                    alt="Logo"
                    className="h-8 drop-shadow-lg filter brightness-0 invert"
                />
            </Link>

            {/* Íconos a la derecha */}
            <div className="flex gap-5 items-center">
                <Link to="/products" className="relative group">
                    <TagIcon className="w-6 h-6 text-white transition-transform group-hover:scale-110 duration-300" />
                </Link>

                <Link to="/cart" className="relative group">
                    <ShoppingCartIcon className="w-7 h-7 text-white transition-transform group-hover:scale-110 duration-300" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                        {totalItems}
                    </span>
                    )}
                </Link>
            </div>
        </div>
    );

    if (isHome) {
        return (
            <AnimatePresence>
                {showNav && (
                    <motion.nav
                        initial={{ y: -80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -80, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-[#a5732db5] dark:bg-[#a5732db5] shadow-md fixed w-full top-0 z-50"
                    >
                        {navContent}
                    </motion.nav>
                )}
            </AnimatePresence>
        );
    }

    // Vistas distintas a home
    return (
        <nav className="bg-[#a5732db5] dark:bg-[#a5732db5] shadow-md w-full relative z-50">
            {navContent}
        </nav>
    );
};

export default Navbar;
