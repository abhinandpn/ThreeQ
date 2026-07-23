'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getTodayDateString } from '@/lib/utils';
import { AdminSidebar } from '@/components/AdminSidebar';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

export default function NewManualQuizPage() {
  const router = useRouter();
  const [quizDate, setQuizDate] = useState<string>(getTodayDateString());
  const [title, setTitle] = useState<string>(`Daily Current Affairs Quiz - ${getTodayDateString()}`);

  const [questions, setQuestions] = useState([
    {
      display_order: 1,
      category: 'Kerala Current Affairs',
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'A' as 'A' | 'B' | 'C' | 'D',
      explanation: '',
      source_name: 'Press Information Bureau',
      source_url: 'https://pib.gov.in',
      source_date: getTodayDateString(),
    },
    {
      display_order: 2,
      category: 'India Current Affairs',
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'B' as 'A' | 'B' | 'C' | 'D',
      explanation: '',
      source_name: 'The Hindu',
      source_url: 'https://www.thehindu.com',
      source_date: getTodayDateString(),
    },
    {
      display_order: 3,
      category: 'Science & Technology',
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'C' as 'A' | 'B' | 'C' | 'D',
      explanation: '',
      source_name: 'ISRO Official Portal',
      source_url: 'https://www.isro.gov.in',
      source_date: getTodayDateString(),
    },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        quiz_date: quizDate,
        title: title,
        questions: questions,
      };

      const created = await api.createManualQuiz(payload);
      router.push(`/admin/quizzes/${created.id}`);
    } catch (err: any) {
      console.error('Failed to create manual quiz:', err);
      setError(err.message || 'Failed to save draft quiz');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[600px] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Create Manual Quiz</h1>
            <p className="text-xs text-slate-500">Draft exactly 3 questions for a daily current affairs quiz</p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Metadata Section */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Quiz Date (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={quizDate}
                onChange={(e) => {
                  setQuizDate(e.target.value);
                  setTitle(`Daily Current Affairs Quiz - ${e.target.value}`);
                }}
                required
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
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-kerala-500 bg-white"
              />
            </div>
          </div>

          {/* 3 Questions Forms */}
          {questions.map((q, idx) => (
            <div key={idx} className="p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-extrabold text-slate-900 text-base">
                  Question {idx + 1} of 3
                </span>
                <div className="w-48">
                  <select
                    value={q.category}
                    onChange={(e) => handleQuestionChange(idx, 'category', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none"
                  >
                    <option value="Kerala Current Affairs">Kerala Current Affairs</option>
                    <option value="India Current Affairs">India Current Affairs</option>
                    <option value="Science & Technology">Science & Technology</option>
                    <option value="Sports">Sports</option>
                    <option value="Environment">Environment</option>
                    <option value="Economy">Economy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Text</label>
                <textarea
                  value={q.question_text}
                  onChange={(e) => handleQuestionChange(idx, 'question_text', e.target.value)}
                  required
                  rows={2}
                  placeholder="Enter the competitive exam question text..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-kerala-500"
                />
              </div>

              {/* 4 Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                  <div key={opt}>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Option {opt}</label>
                    <input
                      type="text"
                      value={(q as any)[`option_${opt.toLowerCase()}`]}
                      onChange={(e) => handleQuestionChange(idx, `option_${opt.toLowerCase()}`, e.target.value)}
                      required
                      placeholder={`Option ${opt} text`}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-kerala-500"
                    />
                  </div>
                ))}
              </div>

              {/* Correct Option Selector & Explanation */}
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
                    required
                    placeholder="Short factual explanation..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-kerala-500"
                  />
                </div>
              </div>

              {/* Citation Source Info */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Source Name</label>
                  <input
                    type="text"
                    value={q.source_name}
                    onChange={(e) => handleQuestionChange(idx, 'source_name', e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Source URL</label>
                  <input
                    type="url"
                    value={q.source_url}
                    onChange={(e) => handleQuestionChange(idx, 'source_url', e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Source Date</label>
                  <input
                    type="date"
                    value={q.source_date}
                    onChange={(e) => handleQuestionChange(idx, 'source_date', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-kerala-800 hover:bg-kerala-700 text-white font-bold text-sm shadow-md shadow-kerala-800/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save as Draft'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
