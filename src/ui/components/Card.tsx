import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md' }) => {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-100 shadow-soft
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
