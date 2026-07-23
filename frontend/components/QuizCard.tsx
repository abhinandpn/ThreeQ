'use client';

import React from 'react';
import { PublicQuestion } from '@/types';
import { OptionButton } from './OptionButton';
import { QuestionProgress } from './QuestionProgress';
import { GlassCard } from './ui/GlassCard';

interface QuizCardProps {
  question: PublicQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
}) => {
  const options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[] = [
    { label: 'A', text: question.option_a },
    { label: 'B', text: question.option_b },
    { label: 'C', text: question.option_c },
    { label: 'D', text: question.option_d },
  ];

  return (
    <GlassCard className="max-w-2xl mx-auto border-white/10">
      <QuestionProgress
        currentIndex={currentIndex}
        total={totalQuestions}
        category={question.category}
      />

      <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug mb-6 tracking-tight">
        {question.question_text}
      </h2>

      <div className="space-y-3.5">
        {options.map((opt) => (
          <OptionButton
            key={opt.label}
            label={opt.label}
            text={opt.text}
            isSelected={selectedOption === opt.label}
            onSelect={() => onSelectOption(opt.label)}
          />
        ))}
      </div>
    </GlassCard>
  );
};
