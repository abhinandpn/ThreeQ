import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'saffron' | 'cyan' | 'purple' | 'slate';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  className,
}) => {
  const variants = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10',
    saffron: 'bg-saffron-500/10 text-saffron-400 border-saffron-500/30 shadow-sm shadow-saffron-500/10',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-sm shadow-cyan-500/10',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-sm shadow-purple-500/10',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border backdrop-blur-md',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
