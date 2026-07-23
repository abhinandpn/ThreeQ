'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { QuizAttemptResult } from '@/types';
import { ResultCard } from '@/components/ResultCard';
import { ExplanationCard } from '@/components/ExplanationCard';
import { ShareButtons } from '@/components/ShareButtons';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState } from '@/components/ErrorState';

export function ResultClient() {
  const params = useParams();
  const attemptId = params.attemptId as string;

  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (attemptId) {
      fetchResult(attemptId);
    }
  }, [attemptId]);

  const fetchResult = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getAttemptResult(id);
      setResult(data);
    } catch (err: any) {
      console.error('Failed to load quiz result:', err);
      setError(err.message || 'Attempt result not found.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !result) {
    return <ErrorState message={error || 'Result not found.'} onRetry={() => fetchResult(attemptId)} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ResultCard
        score={result.score}
        total={result.total || 3}
        message={result.result_message}
        quizDate={result.quiz_date}
      />

      <ShareButtons score={result.score} />

      <div className="mb-8">
        <h3 className="text-xl font-extrabold text-slate-900 mb-4 px-1">
          Detailed Answers & Explanations
        </h3>
        <div className="space-y-4">
          {result.answers?.map((ans, idx) => (
            <ExplanationCard key={ans.question_id || idx} answer={ans} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
