'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Quiz, Question } from '@/types';
import { AdminSidebar } from '@/components/AdminSidebar';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ArrowLeft, Save, CheckCircle, Globe, Eye, Trash2, AlertCircle, RefreshCcw } from 'lucide-react';

export function AdminQuizReviewClient() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [quizDate, setQuizDate] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (quizId) {
      fetchQuiz(quizId);
    }
  }, [quizId]);

  const fetchQuiz = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getAdminQuiz(id);
      setQuiz(data);
      setQuizDate(data.quiz_date);
      setTitle(data.title);
      setQuestions(data.questions || []);
    } catch (err: any) {
      console.error('Failed fetching quiz details:', err);
      setError(err.message || 'Failed to load quiz details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleSaveUpdate = async () => {
    if (isSaving) return;
    setError(null);
    setSuccessMsg(null);
    setIsSaving(true);

    try {
      const payload = {
        quiz_date: quizDate,
        title: title,
        questions: questions,
      };

      const updated = await api.updateAdminQuiz(quizId, payload);
      setQuiz(updated);
      setSuccessMsg('Quiz changes saved successfully!');
    } catch (err: any) {
      console.error('Failed updating quiz:', err);
      setError(err.message || 'Failed to update quiz');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = async () => {
    setError(null);
    try {
      await api.approveQuiz(quizId);
      setSuccessMsg('Quiz approved successfully!');
      fetchQuiz(quizId);
    } catch (err: any) {
      setError(err.message || 'Failed to approve quiz');
    }
  };

  const handlePublish = async () => {
    setError(null);
    try {
      await api.publishQuiz(quizId);
      setSuccessMsg('Quiz published successfully! Users can now attempt it live.');
      fetchQuiz(quizId);
    } catch (err: any) {
      setError(err.message || 'Failed to publish quiz');
    }
  };

  const handleUnpublish = async () => {
    setError(null);
    try {
      await api.unpublishQuiz(quizId);
      setSuccessMsg('Quiz unpublished back to approved status.');
      fetchQuiz(quizId);
    } catch (err: any) {
      setError(err.message || 'Failed to unpublish quiz');
    }
  };

  const handleDeleteDraft = async () => {
    setError(null);
    try {
      await api.deleteDraftQuiz(quizId);
      router.push('/admin/quizzes');
    } catch (err: any) {
      setError(err.message || 'Failed to delete draft quiz');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-6 min-h-[600px] bg-white rounded-3xl border border-slate-200 p-8">
        <AdminSidebar />
        <div className="flex-1 p-8 text-center text-slate-400 animate-pulse">Loading quiz details...</div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="flex flex-col md:flex-row gap-6 min-h-[600px] bg-white rounded-3xl border border-slate-200 p-8">
        <AdminSidebar />
        <div className="flex-1 p-8 text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[600px] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/quizzes')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">Quiz Review & Edit</h1>
                <StatusBadge status={quiz?.status || 'draft'} />
              </div>
              <p className="text-xs text-slate-500">Review AI or manual quiz draft before publishing live</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSaveUpdate}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>

            {quiz?.status === 'draft' && (
              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Approve Quiz</span>
              </button>
            )}

            {quiz?.status !== 'published' && (
              <button
                type="button"
                onClick={handlePublish}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Publish Live</span>
              </button>
            )}

            {quiz?.status === 'published' && (
              <button
                type="button"
                onClick={() => setShowUnpublishConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Unpublish</span>
              </button>
            )}

            {quiz?.status !== 'published' && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                title="Delete Draft"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm mb-6 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Quiz Date (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={quizDate}
              onChange={(e) => setQuizDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-kerala-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Quiz Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-kerala-500 bg-white"
            />
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={idx} className="p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-extrabold text-slate-900 text-base">
                  Question {idx + 1} of 3
                </span>
                <div className="w-48">
                  <input
                    type="text"
                    value={q.category}
                    onChange={(e) => handleQuestionChange(idx, 'category', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Text</label>
                <textarea
                  value={q.question_text}
                  onChange={(e) => handleQuestionChange(idx, 'question_text', e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-kerala-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                  <div key={opt}>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Option {opt}</label>
                    <input
                      type="text"
                      value={(q as any)[`option_${opt.toLowerCase()}`]}
                      onChange={(e) => handleQuestionChange(idx, `option_${opt.toLowerCase()}`, e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-kerala-500"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-emerald-800 mb-1">
                    Correct Option
                  </label>
                  <select
                    value={q.correct_option}
                    onChange={(e) => handleQuestionChange(idx, 'correct_option', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-sm font-bold text-emerald-900 bg-emerald-50 focus:outline-none"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Factual Explanation (&lt; 80 words)
                  </label>
                  <input
                    type="text"
                    value={q.explanation}
                    onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-kerala-500"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Source Name</label>
                  <input
                    type="text"
                    value={q.source_name}
                    onChange={(e) => handleQuestionChange(idx, 'source_name', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Source URL</label>
                  <input
                    type="url"
                    value={q.source_url}
                    onChange={(e) => handleQuestionChange(idx, 'source_url', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Source Date</label>
                  <input
                    type="date"
                    value={q.source_date || ''}
                    onChange={(e) => handleQuestionChange(idx, 'source_date', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <ConfirmDialog
        isOpen={showUnpublishConfirm}
        title="Unpublish Quiz?"
        message="Are you sure you want to unpublish this quiz? It will revert back to approved status and will no longer be visible to public users."
        confirmText="Unpublish Quiz"
        onConfirm={handleUnpublish}
        onClose={() => setShowUnpublishConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Draft Quiz?"
        message="Are you sure you want to permanently delete this draft quiz?"
        confirmText="Delete Draft"
        isDangerous={true}
        onConfirm={handleDeleteDraft}
        onClose={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
