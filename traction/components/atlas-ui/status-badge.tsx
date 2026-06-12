'use client';

import { getStatusColor } from '@/lib/atlas-utils';
import type { AvailabilityStatus } from '@/lib/atlas-types';

interface StatusBadgeProps {
  status: AvailabilityStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const color = getStatusColor(status);
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`badge ${padding}`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full pulse-dot"
        style={{ backgroundColor: color }}
      />
      {status}
    </span>
  );
}
