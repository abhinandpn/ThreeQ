import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto py-16 text-center">
      <GlassCard glow="emerald" className="border-white/10">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <Compass className="w-8 h-8" />
        </div>

        <h1 className="text-6xl font-black text-white font-mono mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-200 mb-2">Page Not Found</h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          The page or quiz date you are searching for doesn't exist or has moved.
        </p>

        <Link href="/">
          <GlowButton variant="emerald" size="md">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to ThreeQ Home</span>
          </GlowButton>
        </Link>
      </GlassCard>
    </div>
  );
}
