'use client';

import React, { Suspense } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Compass, 
  Map, 
  Users, 
  UserCircle, 
  Settings, 
  LogOut, 
  Search, 
  SlidersHorizontal, 
  Bell,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '@/atlas-stores/atlas-auth-store';
import { useLocationStore } from '@/atlas-stores/atlas-location-store';
import { BottomNav } from '@/components/atlas-layout/bottom-nav';
import { Avatar } from '@/components/atlas-ui/avatar';
import { SearchBar } from '@/components/atlas-layout/search-bar';
import { NotificationBell } from '@/components/atlas-layout/notification-bell';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { coords, isLocating, updateLocation, status: locationStatus, error: locationError } = useLocationStore();

  const handleLogout = () => {
    logout();
    router.push('/atlas');
  };



  type NavItem = {
    href: string;
    label: string;
    icon: any;
    disabled?: boolean;
    badge?: string;
  };

  const navItems: NavItem[] = [
    { href: '/atlas/dashboard', label: 'Home', icon: Compass },
    { href: '/atlas/discover', label: 'Discover', icon: Map },
    { href: '/atlas/settings', label: 'Settings', icon: Settings },
  ];

  if (user?.role === 'admin') {
    navItems.push({ href: '/atlas/admin', label: 'Admin Panel', icon: Users });
  }

  const getPageTitle = () => {
    if (pathname.startsWith('/atlas/discover')) return 'Discover';
    if (pathname.startsWith('/atlas/dashboard')) return 'Dashboard';
    if (pathname.startsWith('/atlas/settings')) return 'Settings';
    return 'Atlas';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      
      {/* Permanent Left Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 bg-white h-screen fixed left-0 top-0 z-40 p-6 justify-between select-none">
        
        <div className="space-y-8">
          {/* Brand Logo & Name */}
          <Link href="/atlas/dashboard" className="flex items-center gap-3 px-2">
            <img
              src="/atlaslogo.png"
              alt="Atlas Logo"
              className="h-8 sm:h-10 w-auto object-contain"
              
            />
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/atlas/dashboard' && pathname.startsWith(item.href) && item.href !== '/atlas/discover?view=map');
              return (
                <Link
                  key={item.label}
                  href={item.disabled ? '#' : item.href}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] font-semibold transition-all relative ${
                    item.disabled 
                      ? 'opacity-50 cursor-not-allowed text-gray-400' 
                      : isActive 
                        ? 'text-[#e62e3d] bg-[#fce9ea]' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} strokeWidth={2.2} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#e62e3d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-6">
          {/* Enable Precise Location Card */}
          {!coords && (
            <div className="bg-[#fce9ea]/50 border border-[#fce9ea]/30 rounded-2xl p-5 text-center relative overflow-hidden">
              <div className="w-10 h-10 bg-[#e62e3d]/10 text-[#e62e3d] rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin size={18} />
              </div>
              <h4 className="text-xs font-bold text-gray-900 mb-1">Enable precise location</h4>
              <p className="text-[10px] text-gray-500 leading-normal mb-3.5">Allow precise location to see more relevant atlas businesses.</p>
              <button 
                onClick={updateLocation} 
                disabled={isLocating}
                className="w-full py-2 bg-[#e62e3d] text-white text-[11px] font-bold rounded-lg hover:bg-[#d02432] active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
              >
                {isLocating ? 'Locating...' : 'Enable Location'}
              </button>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 w-full text-gray-500 hover:text-[#e62e3d] text-[14px] font-semibold rounded-xl hover:bg-red-50/50 transition-colors cursor-pointer"
          >
            <LogOut size={20} strokeWidth={2.2} />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* Main Content Layout Wrapper */}
      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
        
        {/* Top Header Bar for Desktop */}
        <header className="hidden lg:flex h-20 border-b border-gray-150 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h2>

          {/* Search, Notifications & Profile dropdown */}
          <div className="flex items-center gap-6">
            
            <SearchBar />



            {/* User Profile dropdown avatar */}
            {user && (
              <Link href="/atlas/settings" className="flex items-center gap-2 hover:opacity-95 transition-opacity">
                <Avatar name={user.name} avatar={user.avatar} size="sm" showStatus status={user.availability} />
              </Link>
            )}

          </div>
        </header>

        {/* Top Header Bar for Mobile */}
        <header className="flex lg:hidden h-16 border-b border-gray-200 bg-white sticky top-0 z-30 px-4 items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">{getPageTitle()}</h2>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center text-gray-500 rounded-full hover:bg-gray-50 transition-colors">
              <Search size={18} />
            </button>

          </div>
        </header>

        {/* Content Render Outlet */}
        <main className="flex-1 pb-safe min-h-0 relative">
          {(locationStatus === 'error' || locationStatus === 'denied') && (
            <div className="bg-orange-50 border-b border-orange-200 px-4 py-2.5 flex items-start gap-3">
              <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={16} />
              <div className="flex-1">
                <p className="text-xs font-bold text-orange-900 leading-tight">Location disabled</p>
                <p className="text-[11px] font-medium text-orange-700 leading-snug mt-0.5">Please turn on your location and allow permissions for accurate tracking and atlas features.</p>
              </div>
              <button 
                onClick={updateLocation}
                className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-orange-600 bg-orange-100 hover:bg-orange-200 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}
          {children}
        </main>

      </div>

      {/* Bottom Nav for Mobile */}
      <div className="lg:hidden mobile-bottom-nav-container transition-opacity duration-300">
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
      </div>

    </div>
  );
}
