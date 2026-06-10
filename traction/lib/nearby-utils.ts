/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m away`;
  if (km < 10) return `${km.toFixed(1)}km away`;
  return `${Math.round(km)}km away`;
}

/**
 * Get initials from a name
 */
export function getInitials(name?: string): string {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0] || '')
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get a consistent avatar color from a name
 */
export function getAvatarColor(name?: string): string {
  if (!name) return '#71717a';
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#22c55e',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Status color mapping
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'Available': return '#22c55e';
    case 'Open to Meet': return '#3b82f6';
    case 'Traveling': return '#f59e0b';
    case 'Busy': return '#ef4444';
    default: return '#71717a';
  }
}
