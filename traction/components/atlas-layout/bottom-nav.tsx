'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Compass, UserCircle, Users, AlignLeft, Map as MapIcon, Settings, List } from 'lucide-react';

const navItems = [
  { href: '/atlas/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/atlas/discover', label: 'Map', icon: MapIcon },
  { href: '/atlas/discover?view=list', label: 'List', icon: List },
  { href: '/atlas/settings', label: 'Settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none pb-safe">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-[32px] px-2 py-2 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/60">
          {navItems.map((item) => {
            let isActive = false;
            if (item.href === '/atlas/discover') {
              isActive = pathname === '/atlas/discover' && view !== 'list';
            } else if (item.href === '/atlas/discover?view=list') {
              isActive = pathname === '/atlas/discover' && view === 'list';
            } else {
              isActive = pathname.startsWith(item.href);
            }
            return (
              <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center flex-1 h-12 sm:h-14">
                <item.icon size={20} className={`mb-0.5 transition-colors ${isActive ? 'text-[#e62e3d]' : 'text-gray-500 hover:text-gray-900'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] font-bold tracking-wide transition-colors ${isActive ? 'text-[#e62e3d]' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
