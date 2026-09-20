import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-neutral-900/70 border border-neutral-800 backdrop-blur-sm',
    elevated: 'bg-neutral-900 border border-neutral-700/60 shadow-xl',
    bordered: 'bg-transparent border border-neutral-700',
  }[variant];

  return (
    <div className={`rounded-xl p-5 sm:p-6 transition-all ${variantStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
