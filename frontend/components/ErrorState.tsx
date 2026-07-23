import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { GlowButton } from './ui/GlowButton';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'We could not submit your answers or load the quiz. Please try again.',
  onRetry,
}) => {
  return (
    <GlassCard className="max-w-lg mx-auto text-center my-8 border-red-500/20">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-400">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Something Went Wrong</h3>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed">{message}</p>

      {onRetry && (
        <GlowButton variant="emerald" size="md" onClick={onRetry}>
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </GlowButton>
      )}
    </GlassCard>
  );
};
