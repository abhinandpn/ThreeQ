'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Trophy, Award, Flame, Star, ShieldCheck, Zap } from 'lucide-react';

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'daily' | 'streak'>('daily');

  const leaderboardData = [
    { rank: 1, name: 'Anandu K.', score: '3/3 (28s)', streak: '42 Days', avatar: '🥇' },
    { rank: 2, name: 'Meera Nair', score: '3/3 (31s)', streak: '38 Days', avatar: '🥈' },
    { rank: 3, name: 'Rahul V.', score: '3/3 (34s)', streak: '31 Days', avatar: '🥉' },
    { rank: 4, name: 'Siddharth M.', score: '3/3 (39s)', streak: '27 Days', avatar: '⚡' },
    { rank: 5, name: 'Divya P.', score: '3/3 (42s)', streak: '24 Days', avatar: '🌟' },
    { rank: 6, name: 'Arjun Swamy', score: '3/3 (45s)', streak: '19 Days', avatar: '🔥' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 mb-2">
          <Badge variant="saffron">
            <Trophy className="w-3.5 h-3.5" />
            <span>Community Leaderboard</span>
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
          Daily High Performers
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          See who completed today's 3-question quiz fastest with 100% accuracy.
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <Tabs
          items={[
            { id: 'daily', label: 'Daily Speed Ranks', icon: <Zap className="w-3.5 h-3.5" /> },
            { id: 'streak', label: 'Top Streaks', icon: <Flame className="w-3.5 h-3.5" /> },
          ]}
          activeId={tab}
          onChange={(id) => setTab(id as any)}
        />
      </div>

      {/* Top 3 Podium Card */}
      <GlassCard glow="emerald" className="mb-6 p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Rank 2 */}
          <div className="pt-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mx-auto mb-2">
              🥈
            </div>
            <h4 className="font-bold text-white text-sm truncate">Meera Nair</h4>
            <span className="text-xs text-emerald-400 font-mono font-semibold">38 Days</span>
          </div>

          {/* Rank 1 */}
          <div className="-mt-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center text-3xl mx-auto mb-2 shadow-neon-saffron border border-saffron-400/40">
              🥇
            </div>
            <h4 className="font-extrabold text-white text-base truncate">Anandu K.</h4>
            <span className="text-xs text-saffron-400 font-mono font-bold">42 Days Streak</span>
          </div>

          {/* Rank 3 */}
          <div className="pt-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mx-auto mb-2">
              🥉
            </div>
            <h4 className="font-bold text-white text-sm truncate">Rahul V.</h4>
            <span className="text-xs text-emerald-400 font-mono font-semibold">31 Days</span>
          </div>
        </div>
      </GlassCard>

      {/* Full Leaderboard List */}
      <GlassCard className="p-0 border-white/10 overflow-hidden">
        <div className="divide-y divide-white/5">
          {leaderboardData.map((item) => (
            <div
              key={item.rank}
              className="p-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="w-7 text-center font-mono font-bold text-sm text-slate-500">
                  #{item.rank}
                </span>
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0">
                  {item.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{item.name}</h4>
                  <span className="text-xs text-slate-400">Score: {item.score}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono">
                  <Flame className="w-3.5 h-3.5 text-saffron-400" />
                  <span>{item.streak}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
