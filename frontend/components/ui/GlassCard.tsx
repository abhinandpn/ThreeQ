import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: 'none' | 'emerald' | 'saffron';
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = 'none',
  interactive = false,
  ...props
}) => {
  const glowStyles = {
    none: '',
    emerald: 'border-emerald-500/30 shadow-neon-emerald',
    saffron: 'border-saffron-500/30 shadow-neon-saffron',
  };

  return (
    <div
      className={cn(
        'rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-dark-card border border-dark-border shadow-glass-card transition-all duration-300 relative overflow-hidden',
        interactive && 'hover:bg-dark-cardHover hover:border-emerald-500/30 hover:shadow-neon-emerald hover:-translate-y-0.5 cursor-pointer',
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
