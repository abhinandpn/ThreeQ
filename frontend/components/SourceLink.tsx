import React from 'react';
import { ExternalLink, Newspaper, Calendar } from 'lucide-react';
import { formatDateKolkata } from '@/lib/utils';

interface SourceLinkProps {
  sourceName: string;
  sourceUrl: string;
  sourceDate?: string;
}

export const SourceLink: React.FC<SourceLinkProps> = ({
  sourceName,
  sourceUrl,
  sourceDate,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-3 pt-3 border-t border-white/10">
      <span className="font-semibold text-slate-300 flex items-center gap-1">
        <Newspaper className="w-3.5 h-3.5 text-emerald-400" />
        Verified Source:
      </span>

      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
      >
        <span>{sourceName}</span>
        <ExternalLink className="w-3 h-3" />
      </a>

      {sourceDate && (
        <span className="inline-flex items-center gap-1 text-slate-500 border-l border-white/10 pl-2">
          <Calendar className="w-3 h-3" />
          <span>{formatDateKolkata(sourceDate)}</span>
        </span>
      )}
    </div>
  );
};
