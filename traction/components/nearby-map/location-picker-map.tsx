'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Loader2, Locate, Maximize2, Minimize2, Check } from 'lucide-react';

interface LocationPickerProps {
  initialLatitude: number | null;
  initialLongitude: number | null;
  onChange: (data: { latitude: number; longitude: number; city: string; address: string }) => void;
}

const DEFAULT_LAT = 12.9352;
const DEFAULT_LNG = 77.6245;

function MapEventsHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const handleMoveEnd = () => {
      const center = map.getCenter();
      onChange(center.lat, center.lng);
    };

    map.on('moveend', handleMoveEnd);
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onChange]);

  return null;
}

// Controller to programmatic set map view when search is performed
function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center, map]);
  return null;
}

export default function LocationPickerMap({ initialLatitude, initialLongitude, onChange }: LocationPickerProps) {
  const lat = initialLatitude ?? DEFAULT_LAT;
  const lng = initialLongitude ?? DEFAULT_LNG;

  const [mapCenter, setMapCenter] = useState<[number, number]>([lat, lng]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [addressDetail, setAddressDetail] = useState('');
  const [searchResults, setSearchResults] = useState<{ lat: string; lon: string; display_name: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dropdownRef = useRef<HTMLFormElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Reverse geocodes the coordinates to get the human-readable city/address
  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const res = await fetch(`/nearby/api/geocode/reverse?lat=${latitude}&lng=${longitude}`);
      if (res.ok) {
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
        const road = data.address?.road || '';
        const suburb = data.address?.suburb || data.address?.neighbourhood || '';
        const address = [road, suburb, city].filter(Boolean).join(', ') || data.display_name || '';

        setAddressDetail(address);
        onChange({ latitude, longitude, city, address });
      }
    } catch (e) {
      console.error('Picker geocoding error:', e);
    }
  };

  // Trigger initial geocode and map pan if props change from outside (e.g. from Google Maps link extraction)
  useEffect(() => {
    if (initialLatitude && initialLongitude) {
      setMapCenter([initialLatitude, initialLongitude]);
      Promise.resolve().then(() => {
        reverseGeocode(initialLatitude, initialLongitude);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLatitude, initialLongitude]);

  const locateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLat = position.coords.latitude;
        const nextLng = position.coords.longitude;
        setMapCenter([nextLat, nextLng]);
        reverseGeocode(nextLat, nextLng);
      },
      (error) => {
        console.error('Locate me error:', error);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const handleMapMove = (newLat: number, newLng: number) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      reverseGeocode(newLat, newLng);
    }, 600); // Debounce to prevent rate limits
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/nearby/api/geocode/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
        setShowDropdown(true);
      }
    } catch (e) {
      console.error('Search places error:', e);
    } finally {
      setSearching(false);
    }
  };

  const selectSearchResult = (item: { lat: string; lon: string; display_name: string }) => {
    const nextLat = parseFloat(item.lat);
    const nextLng = parseFloat(item.lon);
    if (!isNaN(nextLat) && !isNaN(nextLng)) {
      setMapCenter([nextLat, nextLng]);
      setShowDropdown(false);
      reverseGeocode(nextLat, nextLng);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  return (
    <div className={
      isFullscreen 
        ? "fixed inset-0 z-[9999] bg-gray-50 p-4 sm:p-6 flex flex-col gap-4 font-sans w-screen h-screen" 
        : "flex flex-col gap-3 font-sans w-full"
    }>
      {isFullscreen && (
        <div className="flex items-center justify-between shrink-0">
          <h3 className="font-bold text-gray-900 text-lg">Pin your Location</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(false)}
              className="bg-white border border-gray-200 text-gray-700 p-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              title="Minimize Map"
            >
              <Minimize2 size={18} />
            </button>
            <button
              onClick={() => setIsFullscreen(false)}
              className="bg-[#e62e3d] hover:bg-[#d02432] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={16} /> Confirm
            </button>
          </div>
        </div>
      )}
      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="relative z-10 w-full" ref={dropdownRef}>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search address or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 pr-11 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#e62e3d] focus:ring-2 focus:ring-[#e62e3d]/15 transition-all text-gray-900"
          />
          <button
            type="submit"
            className="absolute right-3 p-1.5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          >
            {searching ? <Loader2 size={16} className="animate-spin text-[#e62e3d]" /> : <Search size={16} />}
          </button>
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-150 rounded-xl shadow-lg max-h-60 overflow-y-auto z-[2000] p-1.5 divide-y divide-gray-50">
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectSearchResult(item)}
                className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors truncate block"
              >
                {item.display_name}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Map Picker viewport wrapper */}
      <div className={
        isFullscreen 
          ? "flex-1 w-full rounded-2xl overflow-hidden border border-gray-200 relative shadow-inner z-0" 
          : "h-56 w-full rounded-2xl overflow-hidden border border-gray-200 relative shadow-inner z-0"
      }>
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />
          <MapEventsHandler onChange={handleMapMove} />
          <MapController center={mapCenter} />
        </MapContainer>

        {/* Expand / Collapse Button */}
        {!isFullscreen && (
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 hover:text-[#e62e3d] p-2 rounded-xl shadow-md border border-gray-200 transition-all duration-200 z-[1000] cursor-pointer backdrop-blur-sm"
            title="Expand Map"
          >
            <Maximize2 size={16} />
          </button>
        )}

        {/* Floating GPS Target Action */}
        <button
          type="button"
          onClick={locateMe}
          className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 text-gray-700 hover:text-[#e62e3d] p-2.5 rounded-full shadow-lg border border-gray-150 transition-all duration-200 z-[1000] focus:outline-none focus:ring-2 focus:ring-[#e62e3d]/15 flex items-center justify-center cursor-pointer"
          title="Center on my current location"
        >
          <Locate size={17} />
        </button>

        {/* Floating Center Marker Overlay (Uber/Rapido style) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-[1000] flex flex-col items-center">
          {/* Floating Pin Wrapper with drop-shadow and micro-bounce */}
          <div className="relative transform translate-y-2.5">
            {/* The Pin Body */}
            <svg width="34" height="42" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 0C5.37258 0 0 5.37258 0 12C0 19.5 12 30 12 30C12 30 24 19.5 24 12C24 5.37258 18.6274 0 12 0ZM12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12C16.5 14.4853 14.4853 16.5 12 16.5Z"
                fill="#e62e3d"
              />
              <circle cx="12" cy="12" r="3" fill="white" />
            </svg>
          </div>
          {/* Ground Pin Shadow */}
          <div className="w-2.5 h-1 bg-black/20 rounded-full blur-[1px] transform -translate-y-0.5"></div>
        </div>
      </div>

      {/* Selected Address Display Card */}
      {addressDetail && (
        <div className="bg-gray-50 border border-gray-150 rounded-xl p-3 text-[11px] font-semibold text-gray-500 leading-normal">
          <span className="text-[#e62e3d] block font-bold text-xs uppercase tracking-wider mb-1">Office Address</span>
          {addressDetail}
        </div>
      )}
    </div>
  );
}
