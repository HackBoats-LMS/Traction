'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Compass, Loader2, ArrowRight, Sparkles, Users, Eye, Zap, Navigation, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/nearby-stores/nearby-auth-store';
import { useLocationStore } from '@/nearby-stores/nearby-location-store';
import { Avatar } from '@/components/nearby-ui/avatar';
import { getInitials, getAvatarColor } from '@/lib/nearby-utils';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const { coords, city, isLocating, updateLocation } = useLocationStore();
  const [members, setMembers] = useState<any[]>([]);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push('/nearby/login');
    if (user && !coords && !isLocating) updateLocation();
  }, [user, isLoading, coords, isLocating, updateLocation, router]);

  useEffect(() => {
    let isCancelled = false;
    const timer = setTimeout(async () => {
      if (!coords) return;
      setIsFetchingMembers(true);
      try {
        const res = await fetch(`/nearby/api/members?lat=${coords.latitude}&lng=${coords.longitude}&radius=50`);
        const data = await res.json();
        if (!isCancelled && data.members) {
          setMembers(data.members);
        }
      } catch (e) {
        if (!isCancelled) console.error('Failed to fetch dashboard members', e);
      } finally {
        if (!isCancelled) setIsFetchingMembers(false);
      }
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [coords]);


  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-[#e62e3d]" />
          <span className="text-sm font-medium text-gray-500">Loading Nearby...</span>
        </div>
      </div>
    );
  }

  const isProfileIncomplete = user && (!user.profession || !user.company);

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans relative overflow-hidden">
      
      {/* Background Decor matching Landing Page */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex flex-col justify-between">
        <div className="absolute right-0 top-0 w-[600px] h-[500px] opacity-[0.03] bg-[radial-gradient(circle,#ef4444_2px,transparent_2px)] bg-[length:16px_16px]" style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)' }}></div>
      </div>

      {/* Header removed as it is now in layout.tsx */}

      <main className="px-6 py-8 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Greeting & Primary Action */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Profile Incomplete Notification */}
              {isProfileIncomplete && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-orange-50 border border-orange-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-xl text-orange-600 mt-0.5 shrink-0">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Action Required: Complete Your Profile</h3>
                      <p className="text-gray-600 text-xs mt-1">You won't appear on the Discover map until you add your business details.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push('/nearby/settings')}
                    className="w-full sm:w-auto shrink-0 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                  >
                    Add Business
                  </button>
                </motion.div>
              )}

              {/* Welcome Message */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2"
              >
                <span className="text-xs font-semibold text-[#e62e3d] uppercase tracking-wider bg-[#fce9ea] px-2.5 py-1 rounded-full">Dashboard</span>
                <h1 className="text-[32px] lg:text-[40px] font-bold text-gray-900 tracking-tight mt-3">
                  Hello, {user.name.split(' ')[0]} 👋
                </h1>
                <p className="text-gray-500 text-sm mt-1">Here is your local networking status updates today.</p>
              </motion.div>

              {/* Discover Network Banner */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
              >
                <Link href="/nearby/discover" className="block group">
                  <div className="bg-gradient-to-br from-[#e62e3d] via-[#eb3a48] to-[#f43f5e] p-8 lg:p-12 text-white rounded-2xl shadow-md shadow-red-500/10 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 relative overflow-hidden active:scale-[0.99] min-h-[220px] flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12"></div>
                    
                    <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner mb-8">
                      <Compass size={28} className="text-white" />
                    </div>

                    <div className="relative z-10 flex items-end justify-between gap-4">
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Discover Network</h2>
                        <p className="text-white/80 font-medium text-sm mt-1.5">Connect with nearby business professionals</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors shrink-0">
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Metrics & Quick Actions */}
            <div className="lg:col-span-4 space-y-6 lg:pt-16">
              {/* Networking Metrics Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-4"
              >
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Nearby Professionals</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">
                      {isFetchingMembers ? <Loader2 size={24} className="animate-spin inline-block text-gray-400" /> : members.length}
                    </h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-[#e62e3d]">
                    <Users size={28} />
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                  <div className="min-w-0 pr-4">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Your Location</p>
                    <h3 className="text-xl font-bold text-gray-900 mt-1 truncate">
                      {isLocating ? 'Locating...' : city || 'Unknown location'}
                    </h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 shrink-0">
                    <MapPin size={28} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Full-width bottom section */}
          {members.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Who's Around You</h3>
                <Link href="/nearby/discover" className="text-sm font-bold text-[#e62e3d] hover:underline flex items-center gap-1">
                  View Map <ArrowRight size={16} />
                </Link>
              </div>
              
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
                {members.slice(0, 8).map((m) => (
                  <Link href={`/discover?focus=${m.id}`} key={m.id} className="snap-start shrink-0 w-[180px] bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer">
                    <div className="mb-4">
                      <Avatar 
                        avatar={m.avatar || undefined} 
                        name={m.name} 
                        size="lg" 
                      />
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm truncate w-full">{m.name}</h4>
                    <p className="text-xs text-gray-500 font-medium truncate w-full mt-1">{m.profession}</p>
                    
                    <div className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2.5 py-1.5 rounded-md w-full truncate">
                      {m.city || 'Unknown'}
                    </div>
                  </Link>
                ))}
                
                {members.length > 8 && (
                  <Link href="/nearby/discover" className="snap-start shrink-0 w-[140px] bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-4 flex flex-col items-center justify-center text-center hover:bg-gray-100 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <ArrowRight size={18} className="text-[#e62e3d]" />
                    </div>
                    <span className="text-sm font-bold text-gray-600">View {members.length - 8} more</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}

          </div>
      </main>
    </div>
  );
}

