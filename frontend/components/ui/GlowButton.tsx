import React from 'react';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'emerald' | 'saffron' | 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  variant = 'emerald',
  size = 'md',
  children,
  className,
  ...props
}) => {
  const variants = {
    emerald:
      'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold shadow-neon-emerald border border-emerald-400/30',
    saffron:
      'bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-400 hover:to-saffron-500 text-white font-bold shadow-neon-saffron border border-saffron-400/30',
    glass:
      'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 backdrop-blur-md hover:border-white/20 font-semibold',
    ghost:
      'bg-transparent hover:bg-white/5 text-slate-400 hover:text-white font-medium',
    danger:
      'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-semibold',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs rounded-xl',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-7 py-3.5 text-base rounded-2xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
