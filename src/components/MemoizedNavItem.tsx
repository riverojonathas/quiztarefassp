'use client';

import { memo } from 'react';
import { LazyIcon } from './LazyIcon';
import { Ripple } from './Ripple';

interface NavItem {
  href: string;
  icon: string; // Icon name for lazy loading
  label: string;
  description: string;
}

interface MemoizedNavItemProps {
  item: NavItem;
  isActive: boolean;
  isLoading: boolean;
  onNavigate: (href: string) => void;
}

const MemoizedNavItem = memo<MemoizedNavItemProps>(({
  item,
  isActive,
  isLoading,
  onNavigate
}) => {
  return (
    <Ripple
      className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-indigo-50 min-h-[60px] w-full max-w-[80px] nav-item ${
        isActive
          ? 'text-indigo-600 bg-indigo-50 shadow-lg transform scale-105'
          : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50 hover:shadow-md active:scale-95'
      } ${isLoading ? 'pointer-events-none opacity-75' : ''}`}
      onClick={() => onNavigate(item.href)}
    >
      <div className={`relative mb-1 transition-all duration-300 ${isLoading ? 'animate-spin' : ''}`}>
        {isLoading ? (
          <LazyIcon name="Loader2" className="w-6 h-6 text-indigo-600 nav-icon" />
        ) : (
          <LazyIcon
            name={item.icon}
            className={`w-6 h-6 transition-all duration-300 nav-icon ${
              isActive ? 'drop-shadow-sm' : ''
            }`}
            aria-hidden="true"
          />
        )}
        {isActive && !isLoading && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
        )}
      </div>
      <span className={`text-xs font-medium text-center leading-tight transition-all duration-300 nav-text ${
        isActive ? 'font-semibold active' : ''
      } ${isLoading ? 'opacity-50' : ''}`}>
        {item.label}
      </span>
      {isActive && !isLoading && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full"></div>
      )}
    </Ripple>
  );
});

MemoizedNavItem.displayName = 'MemoizedNavItem';

export { MemoizedNavItem };