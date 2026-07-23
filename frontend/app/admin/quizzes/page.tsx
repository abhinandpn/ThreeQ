'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Quiz } from '@/types';
import { AdminSidebar } from '@/components/AdminSidebar';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { GlowButton } from '@/components/ui/GlowButton';
import { Badge } from '@/components/ui/Badge';
import { PlusCircle, Search, Filter, Trash2, Edit3, Eye, AlertCircle } from 'lucide-react';

export default function AdminQuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchDate, setSearchDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, [statusFilter]);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const res = await api.getAdminQuizzes(statusFilter);
      setQuizzes(res.quizzes || []);
      setTotal(res.total || 0);
    } catch (err: any) {
      console.error('Failed fetching admin quizzes:', err);
      setActionError(err.message || 'Failed to fetch quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDraft = async () => {
    if (!deleteId) return;
    try {
      await api.deleteDraftQuiz(deleteId);
      setQuizzes((prev) => prev.filter((q) => q.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete draft quiz');
    }
  };

  const filteredQuizzes = quizzes.filter((q) => {
    if (!searchDate) return true;
    return q.quiz_date.includes(searchDate);
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[600px] bg-dark-surface rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <Badge variant="emerald" className="mb-2">Quiz Repository</Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Quiz Management</h1>
            <p className="text-xs sm:text-sm text-slate-400">Filter, edit, approve, and publish daily quizzes</p>
          </div>

          <Link href="/admin/quizzes/new">
            <GlowButton variant="emerald" size="sm">
              <PlusCircle className="w-4 h-4" />
              <span>Create Manual Quiz</span>
            </GlowButton>
          </Link>
        </div>

        {actionError && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 bg-white/[0.03] p-3 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10 flex-1">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by date (YYYY-MM-DD)..."
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full text-xs sm:text-sm border-none focus:outline-none bg-transparent text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 ml-1" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none"
            >
              <option value="" className="bg-dark-surface">All Statuses</option>
              <option value="draft" className="bg-dark-surface">Draft Only</option>
              <option value="approved" className="bg-dark-surface">Approved Only</option>
              <option value="published" className="bg-dark-surface">Published Only</option>
            </select>
          </div>
        </div>

        {/* Quizzes Table */}
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 text-sm animate-pulse">Loading quizzes list...</div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No quizzes matching criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Quiz Date</th>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Source</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredQuizzes.map((q) => (
                    <tr key={q.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">{q.quiz_date}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-200 max-w-xs truncate">{q.title}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                        {q.generated_by === 'ai' ? 'Gemini AI' : 'Manual'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={q.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/quizzes/${q.id}`}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-emerald-400 transition-colors"
                            title="Edit / Review"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          {q.status === 'published' && (
                            <Link
                              href={`/quiz/${q.quiz_date}`}
                              target="_blank"
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-emerald-400 transition-colors"
                              title="Preview Live"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}

                          {q.status !== 'published' && (
                            <button
                              type="button"
                              onClick={() => setDeleteId(q.id)}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                              title="Delete Draft"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Draft Quiz?"
        message="Are you sure you want to permanently delete this draft quiz?"
        confirmText="Delete Draft"
        isDangerous={true}
        onConfirm={handleDeleteDraft}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
