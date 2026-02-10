import React from 'react';

export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoaderVariant = 'spinner' | 'dots' | 'pulse';

export interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeStyles: Record<LoaderSize, { spinner: string; dot: string }> = {
  sm: { spinner: 'w-4 h-4', dot: 'w-2 h-2' },
  md: { spinner: 'w-8 h-8', dot: 'w-3 h-3' },
  lg: { spinner: 'w-12 h-12', dot: 'w-4 h-4' },
  xl: { spinner: 'w-16 h-16', dot: 'w-5 h-5' },
};

export default function Loader({
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
  className = '',
}: LoaderProps) {
  const renderSpinner = () => (
    <svg
      className={`animate-spin text-orange-600 ${sizeStyles[size].spinner}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const renderDots = () => (
    <div className="flex gap-2">
      <div
        className={`${sizeStyles[size].dot} bg-orange-600 rounded-full animate-bounce`}
        style={{ animationDelay: '0ms' }}
      />
      <div
        className={`${sizeStyles[size].dot} bg-orange-600 rounded-full animate-bounce`}
        style={{ animationDelay: '150ms' }}
      />
      <div
        className={`${sizeStyles[size].dot} bg-orange-600 rounded-full animate-bounce`}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );

  const renderPulse = () => (
    <div
      className={`${sizeStyles[size].spinner} bg-orange-600 rounded-full animate-pulse`}
    />
  );

  const loaderContent = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {variant === 'spinner' && renderSpinner()}
      {variant === 'dots' && renderDots()}
      {variant === 'pulse' && renderPulse()}
      {text && <p className="text-gray-700 font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
}
