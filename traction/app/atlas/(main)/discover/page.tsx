'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Map as MapIcon, Loader2, MapPin, Search, X, Phone, Mail, Globe, Navigation, Filter, ArrowLeft, Locate } from 'lucide-react';
import { useAuthStore } from '@/atlas-stores/atlas-auth-store';
import { useLocationStore, DEFAULT_COORDS, DEFAULT_CITY } from '@/atlas-stores/atlas-location-store';
import { MapView } from '@/components/atlas-map/map-view';
import { MapSkeleton } from '@/components/atlas-ui/skeleton';
import { BUSINESS_CATEGORIES } from '@/lib/atlas-categories';
import type { AtlasMember } from '@/lib/atlas-types';

function DiscoverContent() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const { coords, city, isLocating, updateLocation } = useLocationStore();
  
  const [members, setMembers] = useState<AtlasMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [listSearchQuery, setListSearchQuery] = useState('');
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [searchCenter, setSearchCenter] = useState<{latitude: number; longitude: number} | null>(null);
  const [searchCity, setSearchCity] = useState<string | null>(null);

  const filteredMembers = members.filter(m => {
    if (!listSearchQuery.trim()) return true;
    const q = listSearchQuery.toLowerCase();
    const cat = BUSINESS_CATEGORIES.find(c => c.id === m.category);
    const catName = cat ? cat.name.toLowerCase() : '';
    const customCat = m.customCategory?.toLowerCase() || '';
    return m.name.toLowerCase().includes(q) || catName.includes(q) || customCat.includes(q);
  });
  const [mapFocus, setMapFocus] = useState<{latitude: number; longitude: number} | null>(null);
  
  const [selectedMember, setSelectedMember] = useState<AtlasMember | null>(null);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('view') === 'list') {
      setMobileView('list');
    } else {
      setMobileView('map');
    }
  }, [searchParams]);

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    setSearchingLocation(true);
    try {
      const res = await fetch(`/atlas/api/geocode/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const place = data[0];
        const latVal = parseFloat(place.lat);
        const lngVal = parseFloat(place.lon);
        
        if (!isNaN(latVal) && !isNaN(lngVal)) {
          setSearchCenter({ latitude: latVal, longitude: lngVal });
          setMapFocus({ latitude: latVal, longitude: lngVal });
          const cityPart = place.address?.city || place.address?.town || place.display_name.split(',')[0];
          setSearchCity(cityPart);
          setSearchQuery('');
          setSelectedMember(null);
        }
      }
    } catch (e) {
      console.error('Search location error:', e);
    } finally {
      setSearchingLocation(false);
    }
  };

  const handleBackToMyLocation = () => {
    setSearchCenter(null);
    setSearchCity(null);
    setMapFocus(null);
    setSelectedMember(null);
  };

  useEffect(() => {
    if (!authLoading && !user) router.push('/atlas/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && !coords && !isLocating) {
      updateLocation();
    }
  }, [user, coords, isLocating, updateLocation]);

  async function fetchMembers() {
    const lat = searchCenter ? searchCenter.latitude : (coords?.latitude ?? DEFAULT_COORDS.latitude);
    const lng = searchCenter ? searchCenter.longitude : (coords?.longitude ?? DEFAULT_COORDS.longitude);
    if (!lat || !lng) return;

    setLoading(true);

    try {
      const categoryParam = searchCategory ? `&category=${encodeURIComponent(searchCategory)}` : '';
      const res = await fetch(`/atlas/api/members?lat=${lat}&lng=${lng}&radius=50${categoryParam}`);
      const data = await res.json();
      if (data.members) setMembers(data.members);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, searchCenter, searchCategory]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 size={32} className="animate-spin text-[#e62e3d]" />
      </div>
    );
  }

  const selectedCategory = selectedMember 
    ? (BUSINESS_CATEGORIES.find(c => c.id === selectedMember.category) || BUSINESS_CATEGORIES[0]) 
    : null;
  const SelectedIcon = selectedCategory?.icon;

  return (
    <div className="h-[calc(100vh-5rem)] bg-white flex flex-col">
      <div className="flex-1 flex flex-col p-0">
        
        {/* DESKTOP IMMERSIVE VIEW */}
        <div className="hidden lg:flex h-[calc(100vh-5rem)] w-full bg-white overflow-hidden shadow-sm flex-row">
          
          <div className="flex-1 h-full relative flex flex-col">
            {isLocating && !coords ? (
              <MapSkeleton />
            ) : (
              <div className="w-full h-full relative">
                {/* Floating Search Bar with Category Filter */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-2rem)] max-w-2xl flex flex-col pointer-events-none">
                  <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-xl px-3.5 py-2.5 gap-2.5 pointer-events-auto shrink-0">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <input 
                      type="text"
                      placeholder="Search for a city or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearchLocation();
                      }}
                      className="flex-1 text-xs font-semibold focus:outline-none text-gray-900 bg-transparent min-w-[150px]"
                    />
                    
                    <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
                    
                    <Filter size={16} className="text-gray-400 shrink-0" />
                    <select
                      value={searchCategory}
                      onChange={(e) => {
                        setSearchCategory(e.target.value);
                        setSelectedMember(null);
                      }}
                      className="text-xs font-semibold focus:outline-none text-gray-900 bg-transparent cursor-pointer max-w-[160px] truncate appearance-none"
                    >
                      <option value="">All Categories</option>
                      {BUSINESS_CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>

                    {searchingLocation ? (
                      <Loader2 size={14} className="animate-spin text-[#e62e3d] shrink-0 ml-2" />
                    ) : searchQuery ? (
                      <button 
                        onClick={handleSearchLocation}
                        className="text-[10px] bg-[#e62e3d] hover:bg-[#d02432] text-white font-bold px-2.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer shrink-0 ml-2"
                      >
                        Go
                      </button>
                    ) : null}
                  </div>
                </div>

                <MapView 
                  userLocation={coords} 
                  members={members} 
                  mapCenter={mapFocus ?? searchCenter ?? undefined} 
                  onMarkerClick={(b) => setSelectedMember(b)}
                  currentUserId={user?.id}
                />

                {/* Desktop Precise Location Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSearchCategory('');
                    handleBackToMyLocation();
                    updateLocation();
                  }}
                  className="absolute bottom-6 right-6 z-[1000] bg-white hover:bg-gray-50 text-gray-700 hover:text-[#e62e3d] p-3 rounded-full shadow-lg border border-gray-150 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e62e3d]/15 flex items-center justify-center cursor-pointer"
                  title="Go to precise location"
                >
                  <Locate size={20} />
                </button>
                
                {/* Floating location card */}
                <div className="absolute bottom-6 left-6 z-[1000] bg-white border border-gray-150 rounded-2xl p-4 shadow-xl max-w-[280px] select-none pointer-events-auto hidden md:block">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{searchCity ? 'Viewing area' : 'You are in'}</span>
                  <div className="flex items-center justify-between gap-4 mt-0.5">
                    <p className="text-sm font-bold text-gray-900 truncate">{searchCity || city || DEFAULT_CITY}</p>
                    <button 
                      onClick={() => {
                        handleBackToMyLocation();
                        setSearchCategory('');
                        if (coords) {
                          setMapFocus(coords);
                        } else {
                          updateLocation();
                        }
                      }}
                      className="text-[10px] font-bold text-[#e62e3d] hover:underline cursor-pointer whitespace-nowrap bg-[#fce9ea] px-2 py-1 rounded-md"
                    >
                      Reset Focus
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side Panel: Fixed width Flex child */}
          {(!isLocating || coords) && (
            <div className="w-[360px] h-full border-l border-gray-200 bg-gray-50 flex flex-col z-[10] shadow-[-10px_0_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
              <AnimatePresence mode="wait">
                {selectedMember && selectedCategory && SelectedIcon ? (
                  /* Detail View */
                  <motion.div 
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col h-full bg-white"
                  >
                    {/* Header Banner */}
                    <div className="h-28 relative flex items-end justify-between p-5 shrink-0" style={{ backgroundColor: `${selectedCategory.color}20` }}>
                      <button 
                        onClick={() => setSelectedMember(null)}
                        className="absolute top-4 left-4 bg-white/70 hover:bg-white px-3 py-1.5 rounded-full text-gray-700 font-semibold text-[10px] transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <ArrowLeft size={12} /> Back to List
                      </button>
                      <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center -mb-8 relative z-10 border border-gray-100" style={{ color: selectedCategory.color }}>
                        <SelectedIcon size={32} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-12 p-6 overflow-y-auto flex-1">
                      <div className="mb-1">
                        <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: selectedCategory.color }}>
                          {selectedMember.customCategory ? selectedMember.customCategory : selectedCategory.name}
                        </span>
                      </div>
                      <h2 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">{selectedMember.name}</h2>
                      
                      {selectedMember.bio && (
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{selectedMember.bio}</p>
                      )}

                      <div className="space-y-4 mt-4 bg-gray-50 p-4 rounded-2xl">
                        {selectedMember.phone && (
                          <div className="flex items-start gap-3">
                            <Phone size={16} className="text-gray-400 mt-0.5 shrink-0" />
                            <a href={`tel:${selectedMember.phone}`} className="text-sm font-medium text-gray-800 hover:text-[#e62e3d]">{selectedMember.phone}</a>
                          </div>
                        )}
                        {selectedMember.email && (
                          <div className="flex items-start gap-3">
                            <Mail size={16} className="text-gray-400 mt-0.5 shrink-0" />
                            <a href={`mailto:${selectedMember.email}`} className="text-sm font-medium text-gray-800 hover:text-blue-600">{selectedMember.email}</a>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                          <span className="text-sm font-medium text-gray-800">
                            {selectedMember.address ? `${selectedMember.address}, ` : ''}{selectedMember.city}
                          </span>
                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col gap-3">
                        <a 
                          href={selectedMember.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${selectedMember.latitude},${selectedMember.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#fce9ea] hover:bg-[#fad1d4] text-[#e62e3d] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shadow-sm"
                        >
                          <Globe size={18} />
                          View on Google Maps
                        </a>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMember.latitude},${selectedMember.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#e62e3d] hover:bg-[#d02432] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shadow-md"
                        >
                          <Navigation size={18} />
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* List View */
                  <motion.div 
                    key="list"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col h-full bg-gray-50/50"
                  >
                    <div className="p-5 border-b border-gray-200 bg-white shrink-0">
                      {/* Local List Search */}
                      <div className="relative mb-4">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search name or category..."
                          value={listSearchQuery}
                          onChange={(e) => setListSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e62e3d]/20 focus:border-[#e62e3d] transition-all"
                        />
                        {listSearchQuery && (
                          <button onClick={() => setListSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <h3 className="text-lg font-extrabold text-gray-900">Atlas Businesses</h3>
                        <p className="text-xs font-semibold text-gray-500 mb-0.5">{filteredMembers.length} found {searchCategory && 'in selected category'}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gray-400" /></div>
                      ) : filteredMembers.length === 0 ? (
                        <div className="p-6 text-center text-sm font-semibold text-gray-500">No businesses found. Try adjusting your search.</div>
                      ) : (
                        filteredMembers.map(member => {
                          const cat = BUSINESS_CATEGORIES.find(c => c.id === member.category) || BUSINESS_CATEGORIES[0];
                          const Icon = cat.icon;
                          const isMe = member.id === user?.id;
                          return (
                            <div 
                              key={member.id}
                              onClick={() => {
                                setSelectedMember(member);
                                if (member.latitude && member.longitude) {
                                  setMapFocus({ latitude: member.latitude, longitude: member.longitude });
                                }
                              }}
                              className={`w-full text-left p-4 bg-white rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-4 ${isMe ? 'border-2 border-[#e62e3d] shadow-sm' : 'border border-gray-100'}`}
                            >
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                                <Icon size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-gray-900 truncate flex items-center gap-2">
                                  {member.name}
                                  {isMe && <span className="bg-[#e62e3d] text-white text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wider">You</span>}
                                </h4>
                                <p className="text-xs font-medium text-gray-500 truncate mt-1 flex items-center gap-1">
                                  <MapPin size={10} /> {member.city}
                                  <span className="text-gray-300 mx-1">•</span> 
                                  <span style={{color: cat.color}}>{(member.distance ?? 0).toFixed(1)} km</span>
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>

        {/* MOBILE VIEW Outlet */}
        <div className="lg:hidden w-full flex-1 flex flex-col relative z-0">
          {isLocating && !coords ? (
            <div className="p-4 flex-1">
              <MapSkeleton />
            </div>
          ) : (
            <div className="w-full relative h-[calc(100dvh-4rem)]">
              {/* Mobile Search Bar */}
              <div className="absolute top-4 left-4 right-4 z-[1000]">
                <div className="relative flex flex-col bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                  <div className="flex items-center px-3.5 py-2.5 gap-2.5 border-b border-gray-100">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <input 
                      type="text"
                      placeholder="Search location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearchLocation();
                      }}
                      className="w-full text-xs font-semibold focus:outline-none text-gray-900 bg-transparent"
                    />
                    {searchingLocation ? (
                      <Loader2 size={14} className="animate-spin text-[#e62e3d] shrink-0" />
                    ) : searchQuery ? (
                      <button 
                        onClick={handleSearchLocation}
                        className="text-[10px] bg-[#e62e3d] hover:bg-[#d02432] text-white font-bold px-2.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer shrink-0"
                      >
                        Go
                      </button>
                    ) : null}
                  </div>
                  <div className="flex items-center px-3.5 py-2 bg-gray-50 gap-2.5">
                    <Filter size={14} className="text-gray-400 shrink-0" />
                    <select
                      value={searchCategory}
                      onChange={(e) => {
                        setSearchCategory(e.target.value);
                        setSelectedMember(null);
                      }}
                      className="w-full text-xs font-semibold focus:outline-none text-gray-700 bg-transparent cursor-pointer appearance-none"
                    >
                      <option value="">All Categories</option>
                      {BUSINESS_CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {mobileView === 'map' ? (
                <>
                  <MapView 
                    userLocation={coords} 
                    members={members} 
                    mapCenter={mapFocus ?? searchCenter ?? undefined} 
                    onMarkerClick={(b) => setSelectedMember(b)}
                    currentUserId={user?.id}
                  />

                  {/* Mobile Precise Location Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSearchCategory('');
                      handleBackToMyLocation();
                      updateLocation();
                    }}
                    className="absolute right-4 bottom-6 z-[1000] bg-white text-gray-700 hover:text-[#e62e3d] p-3 rounded-full shadow-lg border border-gray-150 transition-all duration-300 flex items-center justify-center cursor-pointer"
                    title="Go to precise location"
                  >
                    <Locate size={20} />
                  </button>
                </>
              ) : (
                <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 pb-24">
                  <div className="space-y-3">
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                          </div>
                        </div>
                      ))
                    ) : filteredMembers.length === 0 ? (
                      <div className="text-center p-8 text-gray-500 text-sm">
                        No businesses found matching your criteria.
                      </div>
                    ) : (
                      filteredMembers.map(member => {
                        const cat = BUSINESS_CATEGORIES.find(c => c.id === member.category) || BUSINESS_CATEGORIES[0];
                        const Icon = cat.icon;
                        const isMe = member.id === user?.id;
                        return (
                          <div 
                            key={member.id}
                            onClick={() => setSelectedMember(member)}
                            className={`w-full text-left p-4 bg-white rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-4 ${isMe ? 'border-2 border-[#e62e3d] shadow-sm' : 'border border-gray-100'}`}
                          >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                              <Icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm text-gray-900 truncate flex items-center gap-2">
                                {member.name}
                                {isMe && <span className="bg-[#e62e3d] text-white text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wider">You</span>}
                              </h4>
                              <p className="text-xs font-medium text-gray-500 truncate mt-1 flex items-center gap-1">
                                <MapPin size={10} /> {member.city}
                                <span className="text-gray-300 mx-1">•</span> 
                                <span style={{color: cat.color}}>{(member.distance ?? 0).toFixed(1)} km</span>
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}





              {/* Mobile Bottom Sheet for Details (only if selected) */}
              <AnimatePresence>
                {selectedMember && selectedCategory && SelectedIcon && (
                  <motion.div 
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    className="fixed inset-x-0 bottom-0 top-16 z-[9999] bg-white overflow-y-auto flex flex-col"
                  >
                    {/* Sticky Top Header */}
                    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
                      <h3 className="font-bold text-gray-900 text-lg">Business Details</h3>
                      <button 
                        onClick={() => setSelectedMember(null)}
                        className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 pt-6 pb-safe">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${selectedCategory.color}20`, color: selectedCategory.color }}>
                        <SelectedIcon size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: selectedCategory.color }}>
                          {selectedMember.customCategory ? selectedMember.customCategory : selectedCategory.name}
                        </span>
                        <h2 className="text-lg font-extrabold text-gray-900 leading-tight">{selectedMember.name}</h2>
                      </div>
                    </div>

                    <div className="space-y-3 mb-5">
                      {selectedMember.phone && (
                        <div className="flex items-center gap-3">
                          <Phone size={14} className="text-gray-400 shrink-0" />
                          <a href={`tel:${selectedMember.phone}`} className="text-sm font-medium text-gray-800">{selectedMember.phone}</a>
                        </div>
                      )}
                      {selectedMember.email && (
                        <div className="flex items-center gap-3">
                          <Mail size={14} className="text-gray-400 shrink-0" />
                          <a href={`mailto:${selectedMember.email}`} className="text-sm font-medium text-gray-800 truncate">{selectedMember.email}</a>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <MapPin size={14} className="text-gray-400 shrink-0" />
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {selectedMember.address ? `${selectedMember.address}, ` : ''}{selectedMember.city}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <a 
                        href={selectedMember.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${selectedMember.latitude},${selectedMember.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#fce9ea] text-[#e62e3d] font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
                      >
                        <Globe size={16} />
                        View on Google Maps
                      </a>
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMember.latitude},${selectedMember.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#e62e3d] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
                      >
                        <Navigation size={16} />
                        Get Directions
                      </a>
                    </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<MapSkeleton />}>
      <DiscoverContent />
    </Suspense>
  );
}
