"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToNext = () => {
    setIsMenuOpen(false); // Close mobile menu if open
    const element = document.getElementById('our-products');
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="relative flex items-center justify-between px-6 md:px-10 py-4 w-full bg-white/90 backdrop-blur-md border-b border-black/5 z-50">
      <Link href="/" className="flex items-center">
        <Image
          src="/traction-logo.png"
          alt="Traction Logo"
          width={200}
          height={60}
          className="w-32 sm:w-40 md:w-48 h-auto object-contain invert hue-rotate-180"
          priority
        />
      </Link>

      {/* Desktop Links - Centered between Logo and Button */}
      <div className="hidden md:flex items-center gap-6 lg:gap-10 mr-4 lg:mr-8">
        <Link href={process.env.NEXT_PUBLIC_GREEN_TOOL_URL || "#"} className="text-sm font-medium text-black hover:opacity-70 transition-colors">
          Green Tool
        </Link>
        <Link href={process.env.NEXT_PUBLIC_ONE_TO_ONE_URL || "#"} className="text-sm font-medium text-black hover:opacity-70 transition-colors">
          one-to-one
        </Link>
        <Link href={process.env.NEXT_PUBLIC_NEARBY_URL || "#"} className="text-sm font-medium text-black hover:opacity-70 transition-colors">
          NearBy
        </Link>
      </div>

      {/* Right Side */}
      <div className="hidden md:flex items-center">
        <button 
          onClick={scrollToNext}
          className="bg-[#A3E6B5] hover:bg-[#8fd9a3] text-black font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm border border-[#A3E6B5] shadow-sm cursor-pointer"
        >
          Get Started
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-black focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 w-full bg-[#F5F5F7] shadow-xl overflow-hidden md:hidden border-b border-black/5"
          >
            <div className="flex flex-col px-6 py-6 gap-6">
              <Link href={process.env.NEXT_PUBLIC_GREEN_TOOL_URL || "#"} onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-black hover:opacity-70 transition-colors">
                Green Tool
              </Link>
              <Link href={process.env.NEXT_PUBLIC_ONE_TO_ONE_URL || "#"} onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-black hover:opacity-70 transition-colors">
                one-to-one
              </Link>
              <Link href={process.env.NEXT_PUBLIC_NEARBY_URL || "#"} onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-black hover:opacity-70 transition-colors">
                NearBy
              </Link>
              <button 
                onClick={scrollToNext}
                className="w-full bg-[#A3E6B5] hover:bg-[#8fd9a3] text-black font-bold px-6 py-3 mt-2 rounded-lg transition-colors text-base shadow-sm border border-[#A3E6B5] cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
