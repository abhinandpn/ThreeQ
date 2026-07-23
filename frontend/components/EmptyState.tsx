import React from 'react';
import { CalendarX2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from './ui/GlassCard';
import { GlowButton } from './ui/GlowButton';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Today's Quiz is Getting Ready",
  message = "Today's quiz is getting ready. Please check again soon or explore previous daily quizzes.",
}) => {
  return (
    <GlassCard className="max-w-lg mx-auto text-center my-8 border-white/10">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
        <CalendarX2 className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-extrabold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed">{message}</p>

      <Link href="/previous">
        <GlowButton variant="emerald" size="md">
          <ArrowLeft className="w-4 h-4" />
          <span>View Quiz Archive</span>
        </GlowButton>
      </Link>
    </GlassCard>
  );
};
