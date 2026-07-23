'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Quiz } from '@/types';
import { formatDateKolkata } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { Badge } from '@/components/ui/Badge';
import { Calendar, ArrowRight, BookOpen, Layers } from 'lucide-react';

export default function PreviousQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchQuizzes(page);
  }, [page]);

  const fetchQuizzes = async (p: number) => {
    setIsLoading(true);
    try {
      const res = await api.getPublishedQuizzes(p, 10);
      setQuizzes(res.quizzes || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Failed to fetch previous quizzes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center sm:text-left">
        <Badge variant="emerald" className="mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Quiz Archive</span>
        </Badge>
        <h1 className="text-3xl font-black text-white">Previous Daily Quizzes</h1>
        <p className="text-slate-400 text-sm mt-1">
          Practice previous 3-question current affairs quizzes from our daily archives.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-white/5 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <GlassCard className="text-center p-10 border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base mb-1">No Archive Quizzes Found</h3>
          <p className="text-slate-400 text-sm">Check back tomorrow for new daily quizzes!</p>
        </GlassCard>
      ) : (
        <div className="space-y-3.5 mb-8">
          {quizzes.map((quiz) => (
            <Link key={quiz.id} href={`/quiz/${quiz.quiz_date}`}>
              <GlassCard interactive className="p-5 border-white/10 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-neon-emerald">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-emerald-300 text-base mb-0.5 transition-colors">
                      {quiz.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span>{formatDateKolkata(quiz.quiz_date)}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">3 Questions</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 group-hover:bg-emerald-500/20 text-slate-300 group-hover:text-emerald-300 text-xs font-bold transition-colors border border-white/5">
                  <span>Start</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <GlowButton
            variant="glass"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous Page
          </GlowButton>
          <span className="text-xs text-slate-400 font-semibold font-mono">
            Page {page} of {totalPages}
          </span>
          <GlowButton
            variant="glass"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next Page
          </GlowButton>
        </div>
      )}
    </div>
  );
}
