'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface OptionButtonProps {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  text,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex items-start gap-4 relative group focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
        isSelected
          ? 'bg-emerald-500/15 border-emerald-500/80 text-white shadow-neon-emerald font-medium'
          : 'bg-white/[0.03] border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.06] text-slate-200'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors mt-0.5 border',
          isSelected
            ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
            : 'bg-white/5 border-white/10 text-slate-400 group-hover:border-emerald-500/30 group-hover:text-emerald-400'
        )}
      >
        {label}
      </div>

      <span className="text-base sm:text-lg leading-snug flex-1 pt-0.5 font-normal text-slate-100">
        {text}
      </span>

      {isSelected && (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 self-center" />
      )}
    </button>
  );
};
