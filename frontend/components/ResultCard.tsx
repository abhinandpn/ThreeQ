'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, RotateCcw, Trophy } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from './ui/GlassCard';
import { GlowButton } from './ui/GlowButton';
import { Badge } from './ui/Badge';

interface ResultCardProps {
  score: number;
  total: number;
  message: string;
  quizDate: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  score,
  total = 3,
  message,
  quizDate,
}) => {
  useEffect(() => {
    if (score === 3) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#34d399', '#fbbf24'],
        });
      } catch (e) {
        // Fallback
      }
    }
  }, [score]);

  const getScoreBadge = () => {
    switch (score) {
      case 3:
        return {
          title: 'Perfect Score!',
          glow: 'emerald' as const,
          icon: <Trophy className="w-8 h-8 text-saffron-400" />,
        };
      case 2:
        return {
          title: 'Great Job!',
          glow: 'emerald' as const,
          icon: <Award className="w-8 h-8 text-emerald-400" />,
        };
      case 1:
        return {
          title: 'Good Effort!',
          glow: 'none' as const,
          icon: <CheckCircle2 className="w-8 h-8 text-saffron-400" />,
        };
      default:
        return {
          title: 'Keep Learning!',
          glow: 'none' as const,
          icon: <RotateCcw className="w-8 h-8 text-slate-400" />,
        };
    }
  };

  const badge = getScoreBadge();

  return (
    <GlassCard glow={badge.glow} className="text-center max-w-xl mx-auto mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 mb-4 shadow-neon-emerald">
        {badge.icon}
      </div>

      <div className="mb-2">
        <Badge variant="slate">Quiz Date: {quizDate}</Badge>
      </div>

      <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 tracking-tight">
        {badge.title}
      </h2>

      <div className="flex items-center justify-center gap-1.5 text-5xl sm:text-6xl font-black text-emerald-400 my-4 text-glow-emerald">
        <span>{score}</span>
        <span className="text-slate-600 text-3xl font-light">/</span>
        <span className="text-slate-400 text-3xl font-medium">{total}</span>
      </div>

      <p className="text-slate-300 text-base sm:text-lg max-w-md mx-auto mb-6 leading-relaxed">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/10">
        <Link href="/previous">
          <GlowButton variant="glass" size="md">
            <RotateCcw className="w-4 h-4" />
            <span>Try Previous Quiz</span>
          </GlowButton>
        </Link>
      </div>
    </GlassCard>
  );
};
