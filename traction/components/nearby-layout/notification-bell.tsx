'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, User, Users, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import type { Notification } from '@/lib/nearby-types';
import { usePathname } from 'next/navigation';

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/nearby/api/notifications');
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    
    fetchNotifications();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'profile_view': return <User size={16} className="text-blue-500" />;
      case 'connection_request': return <Users size={16} className="text-green-500" />;
      case 'message': return <MessageSquare size={16} className="text-purple-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#e62e3d] rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[320px] sm:w-[380px] bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] text-[#e62e3d] font-semibold cursor-pointer hover:underline">Mark all as read</span>
            )}
          </div>
          
          <div className="max-h-[350px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <Link 
                  key={notif.id}
                  href={notif.actionUrl || '#'}
                  className={`flex gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                      {getTimeAgo(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2 h-2 bg-[#e62e3d] rounded-full mt-1.5 flex-shrink-0"></div>
                  )}
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-gray-500">
                You have no notifications.
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-gray-100 text-center bg-gray-50">
            <button className="text-xs font-semibold text-gray-600 hover:text-gray-900 w-full py-1">
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
