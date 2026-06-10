'use client';

import { getInitials, getAvatarColor, getStatusColor } from '@/lib/nearby-utils';

interface AvatarProps {
  name: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  status?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

const statusSizeMap = {
  sm: 'w-2.5 h-2.5 border-[1.5px]',
  md: 'w-3 h-3 border-2',
  lg: 'w-3.5 h-3.5 border-2',
  xl: 'w-4 h-4 border-[2.5px]',
};

export function Avatar({ name, avatar, size = 'md', showStatus = false, status = 'Available' }: AvatarProps) {
  const initials = getInitials(name || 'Unknown');
  const bgColor = getAvatarColor(name || 'Unknown');
  const statusColor = getStatusColor(status);

  return (
    <div className="relative inline-flex shrink-0">
      <div className={`${sizeMap[size]} rounded-full overflow-hidden flex items-center justify-center font-bold text-white shadow-sm relative shrink-0`}
           style={{ backgroundColor: bgColor }}>
        <div className="absolute inset-0 flex items-center justify-center z-0 select-none">
          {initials}
        </div>
        
        {avatar && (
          <img 
            src={avatar} 
            alt={name || 'Avatar'} 
            className="absolute inset-0 w-full h-full object-cover z-10 bg-white" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>
      {showStatus && (
        <span className={`absolute -bottom-0.5 -right-0.5 ${statusSizeMap[size]} rounded-full border-white pulse-dot`}
          style={{ backgroundColor: statusColor }} />
      )}
    </div>
  );
}
