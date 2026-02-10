import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const shadowStyles = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
};

export default function Card({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false,
}: CardProps) {
  const baseStyles = 'bg-white rounded-xl border border-gray-200 transition-all duration-300';
  const hoverStyles = hover ? 'hover:shadow-xl hover:border-orange-300 cursor-pointer' : '';
  
  const combinedClassName = `${baseStyles} ${paddingStyles[padding]} ${shadowStyles[shadow]} ${hoverStyles} ${className}`.trim();

  return <div className={combinedClassName}>{children}</div>;
}

export function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-4 pb-4 border-b border-gray-200 ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-xl font-bold text-gray-900 ${className}`.trim()}>
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`.trim()}>
      {children}
    </div>
  );
}
