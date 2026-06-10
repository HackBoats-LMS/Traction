import { create } from 'zustand';
import type { LocationCoords, UserProfile } from '@/lib/nearby-types';

type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error';

export const DEFAULT_COORDS: LocationCoords = { latitude: 12.9352, longitude: 77.6245 };
export const DEFAULT_CITY = 'Bangalore';

// Initial state starts as null to avoid flashing incorrect default locations
interface LocationState {
  coords: LocationCoords | null;
  city: string | null;
  status: LocationStatus;
  error: string | null;
  isLocating: boolean;
  setCoords: (coords: LocationCoords) => void;
  setStatus: (status: LocationStatus) => void;
  setError: (error: string | null) => void;
  requestLocation: () => void;
  updateLocation: () => void;
  initializeFromUser: (user: UserProfile) => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  coords: null,
  city: null,
  status: 'idle',
  error: null,
  isLocating: false,
  setCoords: (coords) => set({ coords, status: 'granted', error: null }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: 'error' }),
  requestLocation: () => {
    get().updateLocation();
  },
  updateLocation: () => {
    if (!navigator.geolocation) {
      set({ error: 'Geolocation is not supported', status: 'error' });
      return;
    }

    // Set isLocating but DON'T null out coords — keep the map visible with current position
    set({ status: 'requesting', isLocating: true });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        set({ coords, status: 'granted', error: null });

        try {
          const res = await fetch('/api/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(coords),
          });
          const data = await res.json();
          if (data.city) {
            set({ city: data.city });
          }
        } catch (e) {
          console.error(e);
        } finally {
          set({ isLocating: false });
        }
      },
      () => {
        // Fallback to default location (Koramangala, Bangalore)
        set({ 
          coords: DEFAULT_COORDS, 
          city: DEFAULT_CITY, 
          status: 'granted', 
          error: null, 
          isLocating: false 
        });
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  },
  initializeFromUser: (user) => {
    if (!user) return;
    const lat = user.currentLatitude ?? user.latitude;
    const lng = user.currentLongitude ?? user.longitude;
    const city = user.currentCity || user.city;
    if (lat !== null && lng !== null && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
      set({
        coords: { latitude: Number(lat), longitude: Number(lng) },
        city: city || 'Your Location',
        status: 'granted'
      });
    }
  }
}));
