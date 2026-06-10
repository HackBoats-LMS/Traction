'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

interface LocationPickerProps {
  initialLatitude: number | null;
  initialLongitude: number | null;
  onChange: (data: { latitude: number; longitude: number; city: string; address: string }) => void;
}

const DynamicLocationPickerMap = dynamic(() => import('./location-picker-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-56 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center shadow-sm">
      <Loader2 className="w-8 h-8 text-[#e62e3d] animate-spin" />
      <span className="text-xs font-semibold text-gray-400 mt-2">Loading Location Picker...</span>
    </div>
  ),
});

export function LocationPickerView(props: LocationPickerProps) {
  return <DynamicLocationPickerMap {...props} />;
}
