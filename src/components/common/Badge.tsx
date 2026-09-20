import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'amber' | 'emerald' | 'blue' | 'purple' | 'neutral' | 'red';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
}) => {
  const variantStyles = {
    amber: 'bg-amber-950/70 border-amber-800/80 text-amber-300',
    emerald: 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300',
    blue: 'bg-blue-950/70 border-blue-800/80 text-blue-300',
    purple: 'bg-purple-950/70 border-purple-800/80 text-purple-300',
    neutral: 'bg-neutral-800 border-neutral-700 text-neutral-300',
    red: 'bg-red-950/70 border-red-800/80 text-red-300',
  }[variant];

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full border font-medium',
    md: 'text-sm px-3 py-1 rounded-full border font-medium',
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 ${variantStyles} ${sizeStyles}`}>
      {children}
    </span>
  );
};
