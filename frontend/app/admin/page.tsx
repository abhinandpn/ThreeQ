'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AdminDashboardStats } from '@/types';
import { AdminSidebar } from '@/components/AdminSidebar';
import { StatusBadge } from '@/components/StatusBadge';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { Badge } from '@/components/ui/Badge';
import { getTodayDateString } from '@/lib/utils';
import { Sparkles, PlusCircle, BarChart3, Users, Award, Calendar, AlertCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genMessage, setGenMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminDashboard();
      setStats(data);
    } catch (err: any) {
      console.error('Failed to load dashboard stats:', err);
      if (err.message && err.message.toLowerCase().includes('unauthorized')) {
        router.push('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTodayQuiz = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenMessage(null);

    try {
      const todayStr = getTodayDateString();
      const generated = await api.generateDailyQuiz(todayStr);
      setGenMessage(`Draft quiz generated successfully for ${todayStr}!`);
      fetchStats();
      router.push(`/admin/quizzes/${generated.id}`);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setGenMessage(`Generation error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[600px] bg-dark-surface rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <Badge variant="emerald" className="mb-2">Admin Control Center</Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Dashboard</h1>
            <p className="text-xs sm:text-sm text-slate-400">Overview of daily quiz status & analytics</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <GlowButton
              variant="saffron"
              size="sm"
              onClick={handleGenerateTodayQuiz}
              disabled={isGenerating}
            >
              <Sparkles className="w-4 h-4 text-saffron-300" />
              <span>{isGenerating ? 'AI Generating...' : "Generate Today's Quiz"}</span>
            </GlowButton>

            <Link href="/admin/quizzes/new">
              <GlowButton variant="emerald" size="sm">
                <PlusCircle className="w-4 h-4" />
                <span>Create Manually</span>
              </GlowButton>
            </Link>
          </div>
        </div>

        {genMessage && (
          <div className="p-4 rounded-2xl bg-saffron-500/10 border border-saffron-500/30 text-saffron-300 text-sm mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-saffron-400" />
            <span>{genMessage}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-5 border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Today's Quiz</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-1">
              <StatusBadge status={stats?.today_quiz_status || 'Not Generated'} />
            </div>
          </GlassCard>

          <GlassCard className="p-5 border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Published Quizzes</span>
              <BarChart3 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">{stats?.total_published || 0}</div>
          </GlassCard>

          <GlassCard className="p-5 border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Total Attempts</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">{stats?.total_attempts || 0}</div>
          </GlassCard>

          <GlassCard className="p-5 border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Average Score</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {stats?.average_score ? stats.average_score.toFixed(1) : '0.0'} <span className="text-xs font-normal text-slate-500">/ 3</span>
            </div>
          </GlassCard>
        </div>

        {/* Recent Quizzes List */}
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Recent Quizzes</h3>
            <Link href="/admin/quizzes" className="text-xs font-bold text-emerald-400 hover:underline">
              View All Quizzes →
            </Link>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-slate-500 text-sm animate-pulse">Loading quizzes...</div>
          ) : !stats?.recent_quizzes || stats.recent_quizzes.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">No quizzes found. Click "Generate Today's Quiz" to start!</div>
          ) : (
            <div className="divide-y divide-white/5">
              {stats.recent_quizzes.map((q) => (
                <div key={q.id} className="p-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors">
                  <div>
                    <Link href={`/admin/quizzes/${q.id}`} className="font-bold text-white hover:text-emerald-400 text-sm block">
                      {q.title}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>Date: {q.quiz_date}</span>
                      <span>•</span>
                      <span>Source: {q.generated_by === 'ai' ? 'Gemini AI' : 'Manual'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={q.status} />
                    <Link href={`/admin/quizzes/${q.id}`}>
                      <GlowButton variant="glass" size="sm">
                        Review & Edit
                      </GlowButton>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
