'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './ui/Badge';

interface QuestionProgressProps {
  currentIndex: number; // 0, 1, 2
  total: number; // 3
  category: string;
}

export const QuestionProgress: React.FC<QuestionProgressProps> = ({
  currentIndex,
  total = 3,
  category,
}) => {
  const percentage = ((currentIndex + 1) / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
        <Badge variant="emerald">
          {category}
        </Badge>

        <span className="text-slate-300 font-medium">
          Question <span className="text-emerald-400 font-black text-sm">{currentIndex + 1}</span> of {total}
        </span>
      </div>

      {/* Glowing Neon Progress Bar */}
      <div className="w-full h-2.5 bg-dark-bg/80 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-saffron-400 rounded-full shadow-neon-emerald"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};
