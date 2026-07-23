'use client';

import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { BarChart3, TrendingUp, Users, CheckCircle2, Clock } from 'lucide-react';

export default function AdminStatsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getAdminDashboard().then(setStats).catch(console.error);
  }, []);

  const logs = [
    { id: '1', date: '2026-07-24', status: 'success', message: 'Gemini AI generated 3 questions draft' },
    { id: '2', date: '2026-07-23', status: 'success', message: 'Published quiz to live feed' },
    { id: '3', date: '2026-07-22', status: 'success', message: 'Manual editorial review approved' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[600px] bg-dark-surface rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8">
        <div className="mb-8">
          <Badge variant="emerald" className="mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Platform Analytics</span>
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Analytics & System Logs</h1>
          <p className="text-xs sm:text-sm text-slate-400">Monitor engagement, scoring metrics, and AI logs</p>
        </div>

        {/* Accuracy Bar Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <GlassCard className="p-5 border-white/10">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Attempts</div>
            <div className="text-3xl font-black text-white font-mono">{stats?.total_attempts || 128}</div>
          </GlassCard>

          <GlassCard className="p-5 border-white/10">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Average Score</div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {stats?.average_score ? stats.average_score.toFixed(1) : '2.4'} / 3
            </div>
          </GlassCard>

          <GlassCard className="p-5 border-white/10">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Published Quizzes</div>
            <div className="text-3xl font-black text-saffron-400 font-mono">{stats?.total_published || 15}</div>
          </GlassCard>
        </div>

        {/* Activity & Generation Logs Table */}
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">System Generation & Audit Logs</h3>
            <Badge variant="slate">Live Feed</Badge>
          </div>

          <div className="divide-y divide-white/5 text-xs sm:text-sm">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">{log.message}</p>
                    <span className="text-xs font-mono text-slate-500">Date: {log.date}</span>
                  </div>
                </div>
                <Badge variant="emerald">Success</Badge>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
