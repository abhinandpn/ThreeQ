'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/HeroSection';
import { getTodayDateString, formatDateKolkata } from '@/lib/utils';
import { api } from '@/lib/api';
import { Quiz } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { Badge } from '@/components/ui/Badge';
import { Calendar, ArrowRight, Zap, CheckCircle2, Share2, BookOpen, Flame, Trophy } from 'lucide-react';

export default function HomePage() {
  const [todayDate, setTodayDate] = useState<string>('');
  const [recentQuizzes, setRecentQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const todayStr = getTodayDateString();
    setTodayDate(todayStr);

    api
      .getPublishedQuizzes(1, 5)
      .then((res) => {
        setRecentQuizzes(res.quizzes || []);
      })
      .catch((err) => {
        console.error('Error fetching recent quizzes:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection todayDateStr={todayDate} />

      {/* Habit Streak / Motivational Dark Banner */}
      <GlassCard glow="saffron" className="mb-10 p-5 sm:p-6 border-saffron-500/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-neon-saffron border border-saffron-400/30">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg leading-tight">
                Build Your Daily 1-Minute Habit
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                3 questions a day = 90+ verified current-affairs facts learned every month!
              </p>
            </div>
          </div>
          <Link href="/quiz/today">
            <GlowButton variant="saffron" size="md" className="shrink-0 w-full sm:w-auto">
              <span>Take Quiz Now</span>
              <ArrowRight className="w-4 h-4" />
            </GlowButton>
          </Link>
        </div>
      </GlassCard>

      {/* 3 Core Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <GlassCard interactive className="border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold mb-4 shadow-neon-emerald">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">3 Daily Questions</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Curated daily: Q1 on Kerala Current Affairs, Q2 on India Affairs, and Q3 on Science, Sports, or Economy.
          </p>
        </GlassCard>

        <GlassCard interactive className="border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-saffron-500/10 border border-saffron-500/20 flex items-center justify-center text-saffron-400 font-bold mb-4 shadow-neon-saffron">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Instant Explanations</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Every question features factual explanations under 80 words linked to verified news source citations.
          </p>
        </GlassCard>

        <GlassCard interactive className="border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold mb-4 shadow-sm shadow-cyan-500/10">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">WhatsApp Group Share</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Share your score with study groups and WhatsApp friends instantly with a single tap after completing.
          </p>
        </GlassCard>
      </div>

      {/* Recent Quiz Archive Preview */}
      <GlassCard className="border-white/10 mb-8 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-white">Recent Daily Quizzes</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Catch up on quizzes you missed from previous days</p>
          </div>
          <Link href="/previous">
            <GlowButton variant="ghost" size="sm">
              <span>View Archive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </GlowButton>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : recentQuizzes.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
            No previous quizzes available yet. Check back soon!
          </div>
        ) : (
          <div className="space-y-3">
            {recentQuizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/quiz/${quiz.quiz_date}`}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 group-hover:text-emerald-300 transition-colors text-sm sm:text-base">
                      {quiz.title}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium">
                      {formatDateKolkata(quiz.quiz_date)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span className="hidden sm:inline">Attempt Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
