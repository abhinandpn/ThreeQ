'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { PublicQuiz } from '@/types';
import { QuizCard } from '@/components/QuizCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { Badge } from '@/components/ui/Badge';
import { getOrCreateGuestID, saveDraftAnswers, getDraftAnswers, clearDraftAnswers } from '@/lib/storage';
import { ChevronLeft, ChevronRight, Send, CheckCircle2, AlertCircle, History } from 'lucide-react';
import { formatDateKolkata } from '@/lib/utils';

export function QuizByDateClient() {
  const params = useParams();
  const router = useRouter();
  const dateParam = params.date as string;

  const [quiz, setQuiz] = useState<PublicQuiz | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (dateParam) {
      fetchQuizByDate(dateParam);
    }
  }, [dateParam]);

  const fetchQuizByDate = async (date: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getQuizByDate(date);
      setQuiz(data);

      if (data && data.id) {
        const savedDraft = getDraftAnswers(data.id);
        if (savedDraft) {
          setSelectedAnswers(savedDraft);
        }
      }
    } catch (err: any) {
      console.error('Error fetching quiz by date:', err);
      setError(err.message || 'No published quiz found for this date.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    if (!quiz || !quiz.questions[currentIndex]) return;
    const currentQ = quiz.questions[currentIndex];

    const updated = {
      ...selectedAnswers,
      [currentQ.id]: option,
    };
    setSelectedAnswers(updated);
    saveDraftAnswers(quiz.id, updated);
  };

  const isCurrentAnswered = quiz && quiz.questions[currentIndex] && !!selectedAnswers[quiz.questions[currentIndex].id];
  const allAnswered = quiz && quiz.questions.length === 3 && quiz.questions.every((q) => !!selectedAnswers[q.id]);

  const handleNext = () => {
    if (currentIndex < (quiz?.questions.length || 3) - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (allAnswered) {
      setShowSummary(true);
    }
  };

  const handlePrev = () => {
    if (showSummary) {
      setShowSummary(false);
    } else if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz || !allAnswered || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const guestId = getOrCreateGuestID();
    const payload = {
      guest_id: guestId,
      answers: quiz.questions.map((q) => ({
        question_id: q.id,
        selected_option: selectedAnswers[q.id],
      })),
    };

    try {
      const result = await api.submitQuiz(quiz.id, payload);
      clearDraftAnswers(quiz.id);
      router.push(`/result/${result.attempt_id}`);
    } catch (err: any) {
      console.error('Failed to submit quiz answers:', err);
      setSubmitError(err.message || 'We could not submit your answers. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !quiz) {
    return (
      <EmptyState
        title="Quiz Not Found"
        message={`We could not find a published quiz for ${dateParam}. Please try choosing another date.`}
      />
    );
  }

  const currentQuestion = quiz.questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <Badge variant="saffron" className="mb-2">
          <History className="w-3.5 h-3.5" />
          <span>Archive Quiz • {formatDateKolkata(quiz.quiz_date)}</span>
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-white">{quiz.title}</h1>
      </div>

      {showSummary ? (
        <GlassCard glow="emerald" className="max-w-2xl mx-auto border-white/10 animate-fadeIn">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold mx-auto mb-4 shadow-neon-emerald">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-center text-white mb-2">
            Ready to Submit?
          </h2>
          <p className="text-slate-400 text-sm text-center mb-6">
            Review your selected answers for the {formatDateKolkata(quiz.quiz_date)} quiz.
          </p>

          <div className="space-y-3 mb-6">
            {quiz.questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
              >
                <div className="pr-4">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    Q{idx + 1} • {q.category}
                  </span>
                  <p className="text-sm font-semibold text-slate-100 line-clamp-1">{q.question_text}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-neon-emerald">
                  {selectedAnswers[q.id]}
                </div>
              </div>
            ))}
          </div>

          {submitError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
            <GlowButton variant="ghost" size="md" onClick={handlePrev} disabled={isSubmitting}>
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Quiz</span>
            </GlowButton>

            <GlowButton variant="saffron" size="lg" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Answers</span>
                </>
              )}
            </GlowButton>
          </div>
        </GlassCard>
      ) : (
        <>
          <QuizCard
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={3}
            selectedOption={selectedAnswers[currentQuestion.id]}
            onSelectOption={handleSelectOption}
          />

          <div className="flex items-center justify-between mt-6 max-w-2xl mx-auto px-1">
            <GlowButton
              variant="glass"
              size="md"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </GlowButton>

            {currentIndex === 2 ? (
              <GlowButton
                variant="saffron"
                size="md"
                onClick={handleNext}
                disabled={!allAnswered}
              >
                <span>Review & Submit</span>
                <ChevronRight className="w-4 h-4" />
              </GlowButton>
            ) : (
              <GlowButton
                variant="emerald"
                size="md"
                onClick={handleNext}
                disabled={!isCurrentAnswered}
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </GlowButton>
            )}
          </div>
        </>
      )}
    </div>
  );
}
