'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, ChevronRight, Briefcase, Users, TrendingUp, ShieldCheck, Zap, HeartHandshake, MapPin, Target, Award, ArrowRight, Search } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex flex-col justify-between">
        <div className="absolute right-0 top-[10%] w-[800px] h-[600px] opacity-[0.04] bg-[radial-gradient(circle,#ef4444_2px,transparent_2px)] bg-[length:16px_16px]" style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)' }}></div>
        <div className="absolute bottom-0 w-full h-48 opacity-[0.03] bg-[#ef4444]" style={{ maskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1000 200\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M0,200 L0,140 L10,140 L10,100 L25,100 L25,150 L40,150 L40,80 L60,80 L60,170 L75,170 L75,110 L90,110 L90,60 L120,60 L120,130 L140,130 L140,90 L160,90 L160,160 L180,160 L180,110 L200,110 L200,40 L230,40 L230,120 L260,120 L260,70 L280,70 L280,150 L310,150 L310,50 L340,50 L340,140 L370,140 L370,80 L400,80 L400,120 L420,120 L420,60 L450,60 L450,150 L480,150 L480,90 L510,90 L510,130 L540,130 L540,40 L570,40 L570,160 L600,160 L600,100 L630,100 L630,140 L650,140 L650,70 L680,70 L680,120 L710,120 L710,50 L750,50 L750,150 L780,150 L780,90 L810,90 L810,170 L840,170 L840,110 L870,110 L870,60 L900,60 L900,140 L930,140 L930,80 L960,80 L960,160 L980,160 L980,100 L1000,100 L1000,200 Z\' fill=\'black\'/%3E%3C/svg%3E")' }}></div>
      </div>

      {/* Header */}
      <header className="w-full absolute top-0 left-0 right-0 z-50 pt-8">
        <div className="max-w-[1500px] mx-auto w-full px-4 sm:px-6 lg:px-12 xl:px-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/atlaslogo.png"
              alt="Atlas Logo"
              className="h-8 sm:h-10 w-auto object-contain"
              
            />
          </div>

          {/* Center Nav */}
          <nav className="hidden lg:flex items-center gap-10 font-semibold text-[15px] text-[#4b5563]">
            <Link href="#features" className="hover:text-[#111827] transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-[#111827] transition-colors">How it Works</Link>

          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/atlas/login" className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2 bg-white text-gray-900 border border-gray-200 rounded-lg font-semibold text-[13px] sm:text-[15px] hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 whitespace-nowrap shadow-sm">
              Log In
            </Link>
            <Link href="/atlas/signup" className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2 bg-[#e62e3d] text-white border border-[#e62e3d] rounded-lg font-semibold text-[13px] sm:text-[15px] hover:bg-[#d02432] hover:border-[#d02432] transition-all duration-150 whitespace-nowrap shadow-sm">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-[1500px] mx-auto w-full px-6 lg:px-12 xl:px-16 pt-32 lg:pt-28 pb-8 relative z-10 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left Content */}
        <div className="w-full lg:w-[45%]">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fce9ea] text-[#e62e3d] text-[13px] font-semibold mb-8"
          >
            <Globe size={14} strokeWidth={2.5} />
            Global Network. Local Connections.
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[64px] lg:text-[72px] leading-[1.05] font-bold tracking-[-0.03em] mb-4 text-[#111827]"
          >
            Discover.<br />
            <span className="text-[#e62e3d]">Pin.</span><br />
            Grow.
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-[18px] text-[#6b7280] mb-8 max-w-[420px] leading-[1.6]"
          >
            Discover local businesses near you and pin your own to the interactive map to get found by customers.
          </motion.p>
          
          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex items-center gap-4 mb-10"
          >
            <Link href="/atlas/signup" className="inline-flex items-center justify-center px-7 py-3.5 bg-[#e62e3d] text-white border border-[#e62e3d] rounded-lg font-semibold text-[15px] hover:bg-[#d02432] hover:border-[#d02432] transition-all duration-150 whitespace-nowrap gap-2 shadow-sm">
              Get Started 
              <ChevronRight size={18} strokeWidth={2.5} />
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/150?u=12" alt="User" className="w-10 h-10 rounded-full border-[3px] border-white shadow-sm object-cover" />
              <img src="https://i.pravatar.cc/150?u=24" alt="User" className="w-10 h-10 rounded-full border-[3px] border-white shadow-sm object-cover" />
              <img src="https://i.pravatar.cc/150?u=35" alt="User" className="w-10 h-10 rounded-full border-[3px] border-white shadow-sm object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-[2px] mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <p className="text-[12px] font-medium text-[#6b7280]">4.9/5 from 2,500+ professionals</p>
            </div>
          </motion.div>



        </div>

        {/* Right Content - Map Visual */}
        <div className="w-full lg:w-[55%] h-[500px] relative mt-16 lg:mt-0 flex items-center justify-center">
          
          <div className="relative w-[700px] h-[700px] flex items-center justify-center ml-0 lg:ml-10 scale-[0.45] sm:scale-[0.6] lg:scale-[0.75] origin-center">
            
            {/* Dotted World Map Background */}
            <img 
              src="https://raw.githubusercontent.com/KristjanJansen/dottedmap/master/dottedmap.svg"
              alt="World Map"
              className="absolute w-[680px] h-[400px] opacity-[0.06] pointer-events-none z-0 object-contain"
              style={{ filter: 'invert(36%) sepia(84%) saturate(2059%) hue-rotate(336deg) brightness(96%) contrast(94%)' }}
            />
            
            {/* Center Pin & Concentric Ripples */}
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
              className="absolute z-20 flex items-center justify-center"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 rounded-full bg-[#ef4444] opacity-10 absolute" />
                <div className="w-56 h-56 rounded-full bg-[#ef4444] opacity-5 absolute" />
                {/* Thin rings */}
                <div className="w-[450px] h-[450px] rounded-full border border-gray-200 absolute" />
                <div className="w-[700px] h-[700px] rounded-full border border-gray-100 absolute" />
              </div>
              
              {/* The Red Map Pin */}
              <svg width="48" height="64" viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-xl -mt-6">
                <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 56 20 56C20 56 40 35 40 20C40 8.954 31.046 0 20 0Z" fill="#ef4444"/>
                <circle cx="20" cy="20" r="8" fill="#ffffff"/>
              </svg>
            </motion.div>

            {/* Connecting Dashed Lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 700 700">
              {/* Curve to Avatar 1 (Top Center) */}
              <path d="M 350 350 Q 320 220 350 126" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              {/* Curve to Avatar 2 (Top Right) */}
              <path d="M 350 350 Q 480 230 600 175" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              {/* Curve to Avatar 3 (Middle Right) */}
              <path d="M 350 350 Q 550 350 665 364" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              {/* Curve to Avatar 4 (Bottom Right) */}
              <path d="M 350 350 Q 470 480 550 574" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              {/* Curve to Avatar 5 (Bottom Left) */}
              <path d="M 350 350 Q 230 480 154 574" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              {/* Curve to Avatar 6 (Middle Left) */}
              <path d="M 350 350 Q 180 290 56 266" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            </svg>

            {/* Floating Avatars */}
            {/* Avatar 1 (Top Center) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="absolute top-[18%] left-[50%] z-10 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <div className="w-[72px] h-[72px] rounded-full border-[5px] border-white shadow-xl bg-white overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=7" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-1 right-0.5 w-4 h-4 bg-[#ef4444] border-2 border-white rounded-full" />
              </div>
            </motion.div>

            {/* Avatar 2 (Top Right) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
              className="absolute top-[25%] right-[15%] z-10 translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <div className="w-[64px] h-[64px] rounded-full border-[4.5px] border-white shadow-xl bg-white overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=9" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-1 right-0 w-3.5 h-3.5 bg-[#ef4444] border-2 border-white rounded-full" />
              </div>
            </motion.div>

            {/* Avatar 3 (Middle Right) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
              className="absolute top-[52%] right-[5%] z-10 translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <div className="w-[68px] h-[68px] rounded-full border-[4.5px] border-white shadow-xl bg-white overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=14" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-1 right-0.5 w-3.5 h-3.5 bg-[#ef4444] border-2 border-white rounded-full" />
              </div>
            </motion.div>

            {/* Avatar 4 (Bottom Right) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
              className="absolute bottom-[18%] right-[22%] z-10 translate-x-1/2 translate-y-1/2"
            >
              <div className="relative">
                <div className="w-[80px] h-[80px] rounded-full border-[5px] border-white shadow-xl bg-white overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=18" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#ef4444] border-2 border-white rounded-full" />
              </div>
            </motion.div>
            
            {/* Avatar 5 (Bottom Left) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}
              className="absolute bottom-[18%] left-[22%] z-10 -translate-x-1/2 translate-y-1/2"
            >
              <div className="relative">
                <div className="w-[72px] h-[72px] rounded-full border-[5px] border-white shadow-xl bg-white overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=11" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-1 right-0.5 w-4 h-4 bg-[#ef4444] border-2 border-white rounded-full" />
              </div>
            </motion.div>

            {/* Avatar 6 (Middle Left) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
              className="absolute top-[38%] left-[8%] z-10 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <div className="w-[72px] h-[72px] rounded-full border-[5px] border-white shadow-xl bg-white overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=33" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-1 right-0.5 w-4 h-4 bg-[#ef4444] border-2 border-white rounded-full" />
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full bg-white py-24 relative z-10">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 xl:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[40px] lg:text-[48px] font-bold text-[#111827] mb-4 tracking-tight">How <span className="text-[#e62e3d]">Atlas</span> Works</h2>
            <p className="text-[18px] text-[#6b7280]">Three simple steps to expand your professional network and grow your business.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[60px] left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent z-0"></div>
            
            {[
              { step: "01", title: "Pin Your Business", desc: "Add your multiple businesses to the map with custom category icons.", icon: MapPin },
              { step: "02", title: "Get Discovered", desc: "Customers easily find you by browsing the interactive map or searching locally.", icon: Target },
              { step: "03", title: "Grow Locally", desc: "Drive foot traffic and engagement directly to your business locations.", icon: TrendingUp }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(230,46,61,0.1)] transition-all duration-300 group"
              >
                <div className="w-20 h-20 rounded-full bg-[#fce9ea] text-[#e62e3d] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon size={32} strokeWidth={1.5} />
                </div>
                <div className="absolute top-6 left-6 text-4xl font-black text-gray-50 opacity-50 group-hover:text-red-50 transition-colors">{item.step}</div>
                <h3 className="text-[22px] font-bold text-[#111827] mb-3">{item.title}</h3>
                <p className="text-[16px] text-[#6b7280] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Discovery Section */}
      <section id="discovery" className="w-full bg-[#111827] py-32 relative z-10 overflow-hidden">
        {/* Dark theme background decor */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#e62e3d] rounded-full mix-blend-screen filter blur-[120px] opacity-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] opacity-10 -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 xl:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Content Side */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-300 text-[13px] font-medium mb-6 border border-gray-700"
              >
                <MapPin size={14} className="text-[#e62e3d]" />
                Interactive Map Directory
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-[40px] lg:text-[52px] leading-[1.1] font-bold tracking-tight mb-6 text-white"
              >
                See who's around.<br/><span className="text-[#e62e3d]">Connect instantly.</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-[18px] text-gray-400 mb-10 max-w-[500px] leading-[1.6]"
              >
                Our interactive map lets you browse verified professionals in your city. Click on a pin to view their profile, get directions to their office, and reach out directly.
              </motion.p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {[
                  { title: "Real-time Map", icon: MapPin },
                  { title: "Smart Filtering", icon: Search },
                  { title: "Admin Verified", icon: ShieldCheck },
                  { title: "Direct Contact", icon: Users }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-gray-700">
                      <item.icon className="text-[#e62e3d]" size={18} />
                    </div>
                    <span className="text-gray-200 font-medium">{item.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Visual Side */}
            <div className="w-full lg:w-1/2 relative order-1 lg:order-2">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden aspect-[4/3] flex"
              >
                {/* Map Area */}
                <div className="flex-1 relative overflow-hidden bg-[#e5e3df]">
                  {/* Realistic Map Background */}
                  <div className="absolute inset-0 opacity-40">
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d1d5db" strokeWidth="1.5" />
                        </pattern>
                        <pattern id="grid-large" width="160" height="160" patternUnits="userSpaceOnUse">
                          <rect width="160" height="160" fill="url(#grid)" />
                          <path d="M 160 0 L 0 0 0 160" fill="none" stroke="#9ca3af" strokeWidth="3" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid-large)" />
                      
                      {/* Fake Park */}
                      <path d="M 20 20 Q 80 80 150 40 T 300 100 T 350 20 L 20 0 Z" fill="#dcfce7" opacity="0.8" />
                      
                      {/* Fake Water body */}
                      <path d="M -50 400 Q 150 350 250 450 T 600 300 L 600 600 L -50 600 Z" fill="#dbeafe" opacity="0.8" />

                      {/* Diagonal arterial roads */}
                      <path d="M -50 150 L 500 -50" fill="none" stroke="#9ca3af" strokeWidth="6" />
                      <path d="M -50 300 L 500 100" fill="none" stroke="#9ca3af" strokeWidth="5" />
                      <path d="M 150 500 L 450 -50" fill="none" stroke="#9ca3af" strokeWidth="6" />
                    </svg>
                  </div>
                  
                  {/* Fake map pins */}
                  <div className="absolute top-[30%] left-[40%] flex flex-col items-center">
                    <div className="bg-white p-0.5 rounded-full shadow-md z-10 mb-[-6px] relative">
                      <img src="https://i.pravatar.cc/150?u=15" alt="user" className="w-6 h-6 rounded-full object-cover" />
                    </div>
                    <MapPin className="text-[#e62e3d]" size={24} fill="#e62e3d" strokeWidth={1} />
                  </div>
                  
                  <div className="absolute top-[60%] left-[70%] flex flex-col items-center">
                    <div className="bg-white p-0.5 rounded-full shadow-md z-10 mb-[-6px] relative">
                      <img src="https://i.pravatar.cc/150?u=22" alt="user" className="w-6 h-6 rounded-full object-cover" />
                    </div>
                    <MapPin className="text-[#e62e3d]" size={24} fill="#e62e3d" strokeWidth={1} />
                  </div>

                  {/* Active Pin with Popup */}
                  <div className="absolute top-[35%] left-[10%] flex flex-col items-center z-20">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-3 w-48 mb-1 absolute bottom-[100%] left-1/2 -translate-x-1/2 origin-bottom animate-in zoom-in duration-200">
                      <div className="flex items-center gap-2 mb-2">
                        <img src="https://i.pravatar.cc/150?u=44" className="w-8 h-8 rounded-full object-cover" alt="user"/>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-[11px] leading-tight truncate">Sarah Jenkins</p>
                          <p className="text-[#e62e3d] text-[9px] font-semibold truncate">Real Estate Agent</p>
                        </div>
                      </div>
                      <button className="w-full bg-[#e62e3d] text-white text-[10px] font-bold py-1.5 rounded-lg shadow-sm">View Profile</button>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b border-r border-gray-100"></div>
                    </div>
                    
                    <div className="bg-[#e62e3d] p-0.5 rounded-full shadow-md z-10 mb-[-6px] relative ring-4 ring-[#e62e3d]/20">
                      <img src="https://i.pravatar.cc/150?u=44" alt="user" className="w-6 h-6 rounded-full object-cover" />
                    </div>
                    <MapPin className="text-[#e62e3d]" size={24} fill="#e62e3d" strokeWidth={1} />
                  </div>
                </div>
                
                {/* Sidebar Area */}
                <div className="w-[35%] bg-white border-l border-gray-100 p-4 flex flex-col gap-2 z-10 shadow-[-10px_0_20px_rgba(0,0,0,0.03)]">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Atlas People</h4>
                  
                  {[
                    { name: 'Sarah Jenkins', role: 'Real Estate Agent', img: 44, active: true },
                    { name: 'Michael Chen', role: 'Corporate Lawyer', img: 15 },
                    { name: 'Emma Watson', role: 'Graphic Designer', img: 22 },
                    { name: 'David Smith', role: 'Financial Advisor', img: 31 }
                  ].map((u, i) => (
                    <div key={i} className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${u.active ? 'border-[#e62e3d]/30 bg-[#e62e3d]/5' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                      <img src={`https://i.pravatar.cc/150?u=${u.img}`} className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0" alt={u.name} />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-[11px] truncate">{u.name}</p>
                        <p className="text-gray-500 text-[9px] truncate">{u.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white pt-20 pb-10 border-t border-gray-100 z-10 relative">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/atlaslogo.png"
                  alt="Atlas Logo"
                  className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
                />
              </div>
              <p className="text-gray-500 text-[14px] leading-relaxed mb-6">
                Your local business networking platform, right in your pocket. Connect, network, and grow your local presence.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-[15px]">Platform</h4>
              <ul className="space-y-3 text-[14px] text-gray-500">
                <li><Link href="#how-it-works" className="hover:text-[#e62e3d] transition-colors">How it Works</Link></li>
                <li><Link href="#features" className="hover:text-[#e62e3d] transition-colors">Features</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-[15px]">Resources</h4>
              <ul className="space-y-3 text-[14px] text-gray-500">
                <li><Link href="#" className="hover:text-[#e62e3d] transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-[#e62e3d] transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-[#e62e3d] transition-colors">Success Stories</Link></li>
                <li><Link href="#" className="hover:text-[#e62e3d] transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-[15px]">Legal</h4>
              <ul className="space-y-3 text-[14px] text-gray-500">
                <li><Link href="#" className="hover:text-[#e62e3d] transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-[#e62e3d] transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-[#e62e3d] transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-[14px]">© {new Date().getFullYear()} Atlas. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-[13px] font-medium">Powered by</span>
              <img src="/hb-logo.png" alt="HackBoats Logo" className="h-6 transition-all duration-300 hover:scale-105" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
