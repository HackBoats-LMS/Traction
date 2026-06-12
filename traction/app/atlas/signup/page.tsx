'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export default function SignupPage() {
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if there is an error in the URL from Google Auth
    const searchParams = new URLSearchParams(window.location.search);
    const errorParam = searchParams.get('error');
    if (errorParam) {
      if (errorParam === 'google_auth_failed') setError('Google authentication failed.');
      else if (errorParam === 'no_code') setError('No authorization code provided by Google.');
      else if (errorParam === 'server_config') setError('Server is missing Google Auth configuration.');
      else if (errorParam === 'unauthorized_email') setError('Your email has not been invited. Please contact your administrator to get access.');
      else setError('An error occurred during Google authentication.');
      
      // Clean up the URL
      window.history.replaceState({}, '', '/atlas/signup');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden relative">
      
      {/* Background Decor (Mobile/Left panel) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex flex-col justify-between lg:w-1/2">
        <div className="absolute right-0 top-[10%] w-[600px] h-[500px] opacity-[0.04] bg-[radial-gradient(circle,#ef4444_2px,transparent_2px)] bg-[length:16px_16px]" style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)' }}></div>
      </div>

      {/* Left Pane - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 md:p-16 z-10 relative bg-white/80 backdrop-blur-sm min-h-screen">
        
        {/* Header/Logo */}
        <div className="flex items-center justify-between">
          <Link href="/atlas" className="flex items-center gap-3">
            <Image
              src="/atlaslogo.png"
              alt="Atlas Logo"
              width={140}
              height={40}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center Content Form */}
        <div className="w-full max-w-[400px] mx-auto my-auto py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-[32px] font-bold tracking-tight text-[#111827] mb-2">Join the Network</h1>
            <p className="text-[#6b7280] text-[15px] mb-8">Atlas is an invite-only platform. If you've been invited by an admin, verify your account below.</p>

            <div className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-lg text-sm text-[#e62e3d] bg-[#fce9ea] border border-[#fce9ea]"
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Google Button */}
            <div className="flex justify-center select-none">
              <a 
                href="/atlas/api/auth/google" 
                className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-bold text-[15px] hover:bg-gray-50 transition-all duration-150 ease-in-out active:scale-[0.98] shadow-sm"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.85-2.22.83-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </a>
            </div>
            
            <div className="text-center text-sm text-gray-500 mt-6">
              Already verified?{' '}
              <Link href="/atlas/login" className="text-[#e62e3d] font-bold hover:underline">Log in</Link>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="text-center lg:text-left text-sm text-gray-500 mt-8">
          Admin access?{' '}
          <Link href="/atlas/admin/login" className="text-[#e62e3d] font-bold hover:underline">Log in</Link>
        </div>

      </div>

      {/* Right Pane - Map Visual Showcase */}
      <div className="hidden lg:flex w-1/2 bg-[#111827] relative items-center justify-center overflow-hidden">
        
        {/* Abstract Background Design */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(circle,#ef4444_1px,transparent_1px)] bg-[length:24px_24px]"></div>
        
        <div className="relative w-[600px] h-[600px] flex items-center justify-center scale-95 origin-center z-10">
          {/* Concentric ripples */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 rounded-full bg-[#ef4444] opacity-20 absolute animate-pulse" />
            <div className="w-48 h-48 rounded-full bg-[#ef4444] opacity-10 absolute" />
            <div className="w-[350px] h-[350px] rounded-full border border-white/10 absolute" />
            <div className="w-[500px] h-[500px] rounded-full border border-white/5 absolute" />
          </div>

          {/* Dotted Map */}
          <img 
            src="https://raw.githubusercontent.com/KristjanJansen/dottedmap/master/dottedmap.svg"
            alt="World Map"
            className="absolute w-[500px] h-[300px] opacity-[0.08] pointer-events-none z-0 object-contain"
            style={{ filter: 'invert(100%)' }}
          />

          {/* Center Pin */}
          <div className="absolute z-20 flex items-center justify-center">
            <svg width="40" height="52" viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-xl -mt-6">
              <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 56 20 56C20 56 40 35 40 20C40 8.954 31.046 0 20 0Z" fill="#ef4444"/>
              <circle cx="20" cy="20" r="8" fill="#ffffff"/>
            </svg>
          </div>

          {/* Floating Avatars */}
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2">
            <img src="https://i.pravatar.cc/150?u=7" alt="User" className="w-[56px] h-[56px] rounded-full border-[3px] border-white shadow-xl object-cover" />
          </div>
          <div className="absolute top-[30%] right-[15%] translate-x-1/2 -translate-y-1/2">
            <img src="https://i.pravatar.cc/150?u=9" alt="User" className="w-[50px] h-[50px] rounded-full border-[3px] border-white shadow-xl object-cover" />
          </div>
          <div className="absolute top-[55%] right-[8%] translate-x-1/2 -translate-y-1/2">
            <img src="https://i.pravatar.cc/150?u=14" alt="User" className="w-[52px] h-[52px] rounded-full border-[3px] border-white shadow-xl object-cover" />
          </div>
          <div className="absolute bottom-[22%] right-[22%] translate-x-1/2 translate-y-1/2">
            <img src="https://i.pravatar.cc/150?u=18" alt="User" className="w-[60px] h-[60px] rounded-full border-[3px] border-white shadow-xl object-cover" />
          </div>
          <div className="absolute bottom-[22%] left-[22%] -translate-x-1/2 translate-y-1/2">
            <img src="https://i.pravatar.cc/150?u=11" alt="User" className="w-[56px] h-[56px] rounded-full border-[3px] border-white shadow-xl object-cover" />
          </div>
          <div className="absolute top-[42%] left-[10%] -translate-x-1/2 -translate-y-1/2">
            <img src="https://i.pravatar.cc/150?u=33" alt="User" className="w-[56px] h-[56px] rounded-full border-[3px] border-white shadow-xl object-cover" />
          </div>
        </div>

        {/* Brand Text Overlay */}
        <div className="absolute bottom-12 left-12 right-12 z-20 text-white/95">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-[12px] font-semibold mb-4 backdrop-blur-md">
            <Globe size={12} strokeWidth={2.5} className="text-[#ef4444]" />
            Global Network. Local Connections.
          </div>
          <h2 className="text-[28px] font-bold tracking-tight mb-2 leading-tight">Discover professionals near you, wherever you go.</h2>
          <p className="text-gray-400 text-[14px]">Connect, network, and grow with Atlas.</p>
        </div>

      </div>

    </div>
  );
}
