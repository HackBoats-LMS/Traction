'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Loader2, Save, MapPin, Search } from 'lucide-react';
import { useAuthStore } from '@/nearby-stores/nearby-auth-store';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLat: number;
  initialLng: number;
}

const DEFAULT_LAT = 12.9352;
const DEFAULT_LNG = 77.6245;

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    moveend() {
      const center = map.getCenter();
      onLocationSelect(center.lat, center.lng);
    },
  });
  return null;
}

function MapController({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 15, { animate: true, duration: 1 });
    }
  }, [target, map]);
  return null;
}

// Removed MapCenterer to fix infinite loop

export function LocationPickerModal({ isOpen, onClose, initialLat, initialLng }: LocationPickerModalProps) {
  const { user, setUser } = useAuthStore();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTarget, setSearchTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Initialize selected location when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedLocation({
        lat: initialLat || DEFAULT_LAT,
        lng: initialLng || DEFAULT_LNG,
      });
      setSaveSuccess(false);
      setSearchQuery('');
      setSearchResults([]);
      setSearchTarget(null);
    }
  }, [isOpen, initialLat, initialLng]);

  // userIcon is no longer used for a leaflet marker, we use an absolute overlay instead

  const handleSave = async () => {
    if (!selectedLocation || !user) return;
    
    setIsSaving(true);
    try {
      // First, get the city name from coordinates using our geocoding API
      let cityName = user.city;
      let addressLine = user.address;
      
      try {
        const geoRes = await fetch(`/nearby/api/geocode/reverse?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`);
        const geoData = await geoRes.json();
        if (geoData.address) {
          if (geoData.address.city || geoData.address.town || geoData.address.village) {
             cityName = geoData.address.city || geoData.address.town || geoData.address.village;
          }
          addressLine = geoData.displayName;
        }
      } catch (err) {
        console.error('Failed to geocode location', err);
      }

      // Update profile
      const res = await fetch('/nearby/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          latitude: selectedLocation.lat, 
          longitude: selectedLocation.lng,
          city: cityName,
          address: addressLine
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setSaveSuccess(true);
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Failed to save location', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/nearby/api/geocode/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setShowResults(true);
        }
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon); // Nominatim uses lon
    if (!isNaN(lat) && !isNaN(lng)) {
      setSearchTarget({ lat, lng });
      setSearchQuery(result.display_name.split(',')[0]); // Set to just the city/place name
      setShowResults(false);
    }
  };

  if (!isOpen) return null;

  // We only need the center once when the map mounts.
  const initialCenter: [number, number] = [
    initialLat || DEFAULT_LAT, 
    initialLng || DEFAULT_LNG
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[101] flex flex-col bg-white rounded-t-[32px] overflow-hidden shadow-2xl h-[85vh] max-h-[800px] lg:h-[600px] lg:rounded-2xl lg:inset-x-auto lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Set Location</h3>
                <p className="text-xs text-gray-500 mt-0.5">Drag the map to pin your location</p>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative bg-gray-100 w-full h-full">
              {typeof window !== 'undefined' && (
                <MapContainer 
                  center={initialCenter} 
                  zoom={15} 
                  style={{ height: '100%', width: '100%' }} 
                  zoomControl={false}
                  attributionControl={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  <MapEvents onLocationSelect={(lat, lng) => {
                    setSelectedLocation({ lat, lng });
                    setSearchTarget(null); // Clear target so we don't snap back
                  }} />
                  <MapController target={searchTarget} />
                </MapContainer>
              )}

              {/* Floating Search Bar */}
              <div className="absolute top-4 left-4 right-4 z-[500] pointer-events-none">
                <div className="max-w-md mx-auto pointer-events-auto relative">
                  <div className="relative bg-white rounded-2xl shadow-lg border border-gray-150 overflow-hidden flex items-center">
                    <div className="pl-4 pr-2 text-gray-400">
                      <Search size={18} />
                    </div>
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => { if (searchResults.length > 0) setShowResults(true); }}
                      placeholder="Search for a city or neighborhood..."
                      className="w-full py-3.5 pr-4 bg-transparent outline-none text-sm text-gray-900 font-medium placeholder:text-gray-400"
                    />
                    {isSearching && (
                      <div className="pr-4 text-gray-400">
                        <Loader2 size={16} className="animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  <AnimatePresence>
                    {showResults && searchResults.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto z-[501]"
                      >
                        {searchResults.map((res, i) => (
                          <div 
                            key={i}
                            onClick={() => handleSelectResult(res)}
                            className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 cursor-pointer flex items-start gap-3"
                          >
                            <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{res.display_name.split(',')[0]}</p>
                              <p className="text-xs text-gray-500 truncate mt-0.5">{res.display_name.split(',').slice(1).join(',').trim()}</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Rapido-style fixed center pin */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-[400]">
                {/* Visual Pin */}
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="relative -top-3"
                >
                  <div className="w-8 h-8 rounded-full bg-[#e62e3d] border-[3px] border-white shadow-[0_4px_15px_rgba(230,46,61,0.5)] flex items-center justify-center z-20">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  {/* Pin Tail */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white z-10 drop-shadow-md"></div>
                </motion.div>
                {/* Shadow marker on the ground */}
                <div className="w-4 h-1.5 bg-black/20 rounded-[100%] blur-[1px]"></div>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="p-6 bg-white border-t border-gray-100 shrink-0 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                {selectedLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#e62e3d] shrink-0" />
                    <span className="text-sm font-semibold text-gray-700 truncate">
                      {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving || saveSuccess || !selectedLocation}
                className="flex items-center gap-2 px-6 py-3 bg-[#e62e3d] hover:bg-[#d02432] disabled:opacity-50 disabled:hover:bg-[#e62e3d] text-white text-sm font-bold rounded-xl shadow-sm transition-all active:scale-[0.98]"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : saveSuccess ? (
                  <span className="flex items-center gap-1.5"><Save size={18} /> Saved!</span>
                ) : (
                  <span>Save Location</span>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
