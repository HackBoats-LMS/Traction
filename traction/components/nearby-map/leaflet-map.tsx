'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { BUSINESS_CATEGORIES } from '@/lib/nearby-categories';
import type { NearbyMember, LocationCoords } from '@/lib/nearby-types';

interface MapViewProps {
  userLocation: LocationCoords | null;
  members: NearbyMember[];
  mapCenter?: LocationCoords;
  hideZoomControls?: boolean;
  onMarkerClick?: (member: NearbyMember) => void;
  currentUserId?: string;
}

const DEFAULT_LAT = 12.9352;
const DEFAULT_LNG = 77.6245;

const iconCache = new Map<string, L.DivIcon>();

function isValidCoord(val: unknown): val is number {
  return typeof val === 'number' && isFinite(val) && !isNaN(val);
}

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const lastCoords = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!isValidCoord(lat) || !isValidCoord(lng)) return;
    const hasChanged = lastCoords.current &&
      (lastCoords.current.lat !== lat || lastCoords.current.lng !== lng);

    if (hasChanged) {
      try {
        map.setView([lat, lng], map.getZoom());
      } catch {}
    }
    lastCoords.current = { lat, lng };
  }, [lat, lng, map]);
  return null;
}

function ResizeObserverUpdater() {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

export default function LeafletMap({ userLocation, members, mapCenter, onMarkerClick, currentUserId }: MapViewProps) {
  const lat = isValidCoord(userLocation?.latitude) ? userLocation.latitude : DEFAULT_LAT;
  const lng = isValidCoord(userLocation?.longitude) ? userLocation.longitude : DEFAULT_LNG;
  const center: [number, number] = [lat, lng];

  const viewLat = mapCenter && isValidCoord(mapCenter.latitude) ? mapCenter.latitude : lat;
  const viewLng = mapCenter && isValidCoord(mapCenter.longitude) ? mapCenter.longitude : lng;

  const userIcon = useMemo(() => L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 10px rgba(59,130,246,0.5);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  }), []);

  const getBusinessIcon = (categoryId?: string, isCurrentUser?: boolean) => {
    const safeCategoryId = categoryId || 'other';
    const cacheKey = `${safeCategoryId}-${isCurrentUser ? 'me' : 'other'}`;
    if (iconCache.has(cacheKey)) return iconCache.get(cacheKey)!;
    
    const category = BUSINESS_CATEGORIES.find(c => c.id === safeCategoryId) || BUSINESS_CATEGORIES[BUSINESS_CATEGORIES.length - 1];
    const IconComponent = category.icon;
    const iconSvg = renderToString(<IconComponent size={isCurrentUser ? 20 : 18} strokeWidth={2.5} color="white" />);

    const borderStyle = isCurrentUser ? '3px solid #e62e3d' : '3px solid white';

    const icon = L.divIcon({
      className: 'custom-leaflet-marker leaflet-business-marker',
      html: `
        <div style="position:relative;width:36px;height:36px;background:${category.color};border:${borderStyle};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.2s;cursor:pointer;">
          ${iconSvg}
          ${isCurrentUser ? '<div style="position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);background:#e62e3d;color:white;font-size:10px;font-weight:bold;padding:2px 6px;border-radius:12px;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.2);z-index:100;">You</div>' : ''}
        </div>
      `,
      iconSize: [36, isCurrentUser ? 56 : 36],
      iconAnchor: [18, 18],
    });
    
    iconCache.set(cacheKey, icon);
    return icon;
  };

  const validMembers = useMemo(() =>
    members.filter(b => isValidCoord(b.latitude) && isValidCoord(b.longitude)),
    [members]
  );

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }} 
        attributionControl={false} 
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; OSM'
        />
        <ResizeObserverUpdater />
        <MapUpdater lat={viewLat} lng={viewLng} />
        
        {userLocation && <Marker position={center} icon={userIcon} />}

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={40}
          iconCreateFunction={(cluster: any) => {
            const count = cluster.getChildCount();
            // A clean React component for the cluster
            const ClusterIcon = () => (
              <div className="flex items-center justify-center w-10 h-10 bg-[#e62e3d] text-white font-bold rounded-full border-[3px] border-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-sm">
                {count}
              </div>
            );

            return L.divIcon({
              html: renderToString(<ClusterIcon />),
              className: 'custom-marker-cluster bg-transparent border-0',
              iconSize: [40, 40],
            });
          }}
        >
          {validMembers.map(b => (
            <Marker 
              key={b.id} 
              position={[b.latitude as number, b.longitude as number]} 
              icon={getBusinessIcon(b.category, b.id === currentUserId)}
              eventHandlers={{
                click: () => onMarkerClick?.(b)
              }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
