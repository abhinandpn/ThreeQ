import React from 'react';
import { GlassCard } from './ui/GlassCard';

export const LoadingSkeleton: React.FC = () => {
  return (
    <GlassCard className="max-w-2xl mx-auto border-white/10 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="w-24 h-6 bg-white/10 rounded-lg" />
        <div className="w-28 h-4 bg-white/10 rounded-lg" />
      </div>

      <div className="w-full h-2.5 bg-white/5 rounded-full mb-8" />

      <div className="space-y-3 mb-6">
        <div className="h-6 bg-white/10 rounded-lg w-11/12" />
        <div className="h-6 bg-white/10 rounded-lg w-3/4" />
      </div>

      <div className="space-y-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-white/5 rounded-2xl w-full border border-white/5" />
        ))}
      </div>
    </GlassCard>
  );
};
