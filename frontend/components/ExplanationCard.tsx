import React from 'react';
import { DetailedAnswer } from '@/types';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { SourceLink } from './SourceLink';
import { GlassCard } from './ui/GlassCard';
import { Badge } from './ui/Badge';
import { cn } from '@/lib/utils';

interface ExplanationCardProps {
  answer: DetailedAnswer;
  index: number;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({ answer, index }) => {
  const getOptionText = (opt: 'A' | 'B' | 'C' | 'D') => {
    switch (opt) {
      case 'A': return answer.option_a;
      case 'B': return answer.option_b;
      case 'C': return answer.option_c;
      case 'D': return answer.option_d;
    }
  };

  return (
    <GlassCard className="mb-6 border-white/10">
      <div className="flex items-center justify-between gap-2 mb-3">
        <Badge variant="emerald">{answer.category}</Badge>
        <span className="text-xs font-semibold text-slate-400">
          Question {index + 1} of 3
        </span>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-4">
        {answer.question_text}
      </h3>

      {/* Answer Options */}
      <div className="space-y-2.5 mb-4">
        {(['A', 'B', 'C', 'D'] as const).map((opt) => {
          const isSelected = answer.selected_option === opt;
          const isCorrect = answer.correct_option === opt;

          let optionStyle = 'bg-white/[0.03] border-white/10 text-slate-300';
          if (isCorrect) {
            optionStyle = 'bg-emerald-500/15 border-emerald-500/80 text-white font-semibold shadow-neon-emerald';
          } else if (isSelected && !isCorrect) {
            optionStyle = 'bg-red-500/15 border-red-500/60 text-red-200 font-medium';
          }

          return (
            <div
              key={opt}
              className={cn(
                'p-3.5 rounded-xl border text-sm flex items-center justify-between transition-colors',
                optionStyle
              )}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center font-bold text-xs shrink-0 text-white">
                  {opt}
                </span>
                <span>{getOptionText(opt)}</span>
              </div>

              {isCorrect && (
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Correct Answer</span>
                </div>
              )}
              {isSelected && !isCorrect && (
                <div className="flex items-center gap-1 text-xs font-bold text-red-400 shrink-0">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Your Answer</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Factual Explanation */}
      <div className="p-4 rounded-2xl bg-saffron-500/10 border border-saffron-500/30 text-saffron-200 text-sm mb-3 backdrop-blur-md">
        <div className="flex items-center gap-2 font-bold text-saffron-400 mb-1">
          <Lightbulb className="w-4 h-4 text-saffron-400 shrink-0" />
          <span>Factual Explanation</span>
        </div>
        <p className="leading-relaxed text-slate-200">{answer.explanation}</p>
      </div>

      <SourceLink
        sourceName={answer.source_name}
        sourceUrl={answer.source_url}
        sourceDate={answer.source_date}
      />
    </GlassCard>
  );
};
