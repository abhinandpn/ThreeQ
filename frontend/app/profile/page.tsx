'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { getOrCreateGuestID } from '@/lib/storage';
import { User, Flame, Award, Calendar, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function ProfilePage() {
  const [guestId, setGuestId] = useState<string>('Guest');

  useEffect(() => {
    setGuestId(getOrCreateGuestID());
  }, []);

  const earnedBadges = [
    { title: '7-Day Streak', icon: '🔥', desc: 'Completed 7 daily quizzes in a row' },
    { title: 'PSC Scholar', icon: '🎓', desc: 'Achieved 100% score on Kerala Affairs' },
    { title: 'Speed Demon', icon: '⚡', desc: 'Completed a quiz in under 30 seconds' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-3 text-2xl shadow-neon-emerald border border-emerald-400/30">
          👤
        </div>
        <Badge variant="emerald" className="mb-2">
          Guest User
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-white">{guestId}</h1>
        <p className="text-xs font-mono text-slate-500 mt-1">Stored locally on your device</p>
      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <GlassCard className="p-5 text-center border-white/10">
          <div className="w-10 h-10 rounded-xl bg-saffron-500/10 border border-saffron-500/30 flex items-center justify-center mx-auto mb-2 text-saffron-400">
            <Flame className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-white font-mono">7 Days</div>
          <span className="text-xs text-slate-400 font-medium">Current Streak</span>
        </GlassCard>

        <GlassCard className="p-5 text-center border-white/10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-white font-mono">14</div>
          <span className="text-xs text-slate-400 font-medium">Quizzes Completed</span>
        </GlassCard>

        <GlassCard className="p-5 text-center border-white/10">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-2 text-cyan-400">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-white font-mono">88%</div>
          <span className="text-xs text-slate-400 font-medium">Accuracy Rate</span>
        </GlassCard>
      </div>

      {/* Earned Badges */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-saffron-400" />
          <span>Earned Achievements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {earnedBadges.map((b, idx) => (
            <GlassCard key={idx} className="p-5 border-white/10">
              <div className="text-3xl mb-2">{b.icon}</div>
              <h4 className="font-bold text-white text-sm mb-1">{b.title}</h4>
              <p className="text-slate-400 text-xs">{b.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
