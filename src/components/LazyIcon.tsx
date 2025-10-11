'use client';

import { lazy, Suspense, ComponentType } from 'react';
import { LucideProps } from 'lucide-react';

// Cache for loaded icons
const iconCache = new Map<string, ComponentType<LucideProps>>();

interface LazyIconProps extends LucideProps {
  name: string;
  fallback?: React.ReactNode;
}

function LazyIconComponent({ name, fallback, ...props }: LazyIconProps) {
  // If icon is already cached, use it directly
  if (iconCache.has(name)) {
    const IconComponent = iconCache.get(name)!;
    return <IconComponent {...props} />;
  }

  // Create a lazy-loaded component
  const LazyIcon = lazy(() =>
    import('lucide-react').then(module => {
      const IconComponent = module[name as keyof typeof module] as ComponentType<LucideProps>;
      // Cache the component for future use
      iconCache.set(name, IconComponent);
      return { default: IconComponent };
    }).catch(() => {
      // Fallback to a generic icon if import fails
      const FallbackIcon = ({ ...props }: LucideProps) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      );
      return { default: FallbackIcon };
    })
  );

  return (
    <Suspense fallback={fallback || <div className="w-6 h-6 animate-pulse bg-gray-200 rounded" />}>
      <LazyIcon {...props} />
    </Suspense>
  );
}

export { LazyIconComponent as LazyIcon };