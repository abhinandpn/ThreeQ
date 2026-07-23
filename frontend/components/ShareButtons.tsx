'use client';

import React, { useState } from 'react';
import { generateWhatsAppShareUrl } from '@/lib/utils';
import { Share2, Check, Copy } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { GlowButton } from './ui/GlowButton';

interface ShareButtonsProps {
  score: number;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ score }) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return 'https://threeq.app';
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const whatsappUrl = generateWhatsAppShareUrl(score, getShareUrl());

  return (
    <GlassCard glow="emerald" className="max-w-xl mx-auto mb-8 text-center border-white/10">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-3 text-white shadow-neon-emerald">
        <Share2 className="w-6 h-6" />
      </div>

      <h3 className="text-xl font-black text-white mb-1">Challenge Your Friends!</h3>
      <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto">
        Share your score on WhatsApp study groups or copy the link to compare results.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <GlowButton variant="emerald" size="md" className="w-full">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.228-1.109z" />
            </svg>
            <span>Share on WhatsApp</span>
          </GlowButton>
        </a>

        <GlowButton
          variant="glass"
          size="md"
          onClick={handleCopyLink}
          className="w-full sm:w-auto"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-400" />
              <span>Copy Link</span>
            </>
          )}
        </GlowButton>
      </div>
    </GlassCard>
  );
};
