'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, MapPin, Sparkles, Flame } from 'lucide-react';
import { formatDateKolkata } from '@/lib/utils';
import { GlowButton } from './ui/GlowButton';
import { Badge } from './ui/Badge';

interface HeroSectionProps {
  todayDateStr?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ todayDateStr }) => {
  const formattedToday = todayDateStr ? formatDateKolkata(todayDateStr) : 'Today';

  return (
    <div className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-dark-card p-6 sm:p-10 shadow-glass-card border border-white/10 mb-10 group">
      {/* Background Neon Orbs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/25 transition-all duration-700" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-saffron-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-saffron-500/25 transition-all duration-700" />
      
      {/* Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge variant="emerald" className="animate-pulse">
            <Flame className="w-3.5 h-3.5 text-saffron-400" />
            <span>3 Questions • 1 Minute Daily</span>
          </Badge>

          <Badge variant="slate">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>Kerala & India Current Affairs</span>
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight mb-4">
          Three questions. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-saffron-400 text-glow-emerald">
            One minute.
          </span>{' '}
          Smarter every day.
        </h1>

        <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed font-normal max-w-2xl">
          Test your knowledge with today’s fast 3-question current affairs micro-quiz. Tailored for Kerala PSC aspirants, competitive exams, and daily habit-building.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
          <Link href="/quiz/today">
            <GlowButton variant="emerald" size="lg" className="w-full sm:w-auto">
              <span>Start Today's Quiz ({formattedToday})</span>
              <ArrowRight className="w-5 h-5" />
            </GlowButton>
          </Link>

          <Link href="/previous">
            <GlowButton variant="glass" size="lg" className="w-full sm:w-auto">
              <span>View Quiz Archive</span>
            </GlowButton>
          </Link>
        </div>

        {/* 3 Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>3 Fact-Checked Questions</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-saffron-400 shrink-0" />
            <span>Instant Factual Explanations</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>WhatsApp Group Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};
