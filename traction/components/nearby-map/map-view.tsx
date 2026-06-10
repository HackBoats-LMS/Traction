'use client';

import dynamic from 'next/dynamic';
import type { NearbyMember, LocationCoords } from '@/lib/nearby-types';

interface MapViewProps {
  userLocation: LocationCoords | null;
  members: NearbyMember[];
  mapCenter?: LocationCoords;
  hideZoomControls?: boolean;
  onMarkerClick?: (member: NearbyMember) => void;
  currentUserId?: string;
}

const LeafletMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#e62e3d] border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export function MapView(props: MapViewProps) {
  return <LeafletMap {...props} />;
}
