import React from 'react';
import { QuizStatus } from '@/types';
import { Badge } from './ui/Badge';
import { Clock, CheckCircle, Globe } from 'lucide-react';

interface StatusBadgeProps {
  status: QuizStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status.toLowerCase()) {
    case 'published':
      return (
        <Badge variant="emerald">
          <Globe className="w-3.5 h-3.5" />
          <span>Published</span>
        </Badge>
      );
    case 'approved':
      return (
        <Badge variant="cyan">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Approved</span>
        </Badge>
      );
    case 'draft':
    default:
      return (
        <Badge variant="saffron">
          <Clock className="w-3.5 h-3.5" />
          <span>Draft</span>
        </Badge>
      );
  }
};
