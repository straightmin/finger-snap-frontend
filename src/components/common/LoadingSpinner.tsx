'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-2 text-gray-500">
        <div 
          className={`${sizeClasses[size]} border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin`}
        />
        {text && <span className="text-sm">{text}</span>}
      </div>
    </div>
  );
}