import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { Badge } from '@/components/ui/Badge';
import { Info, Target, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <Badge variant="emerald" className="mb-2">
          <Info className="w-3.5 h-3.5" />
          <span>About ThreeQ</span>
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-3">
          3 Questions. 1 Minute. Every Day.
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          Empowering Kerala PSC aspirants and students with structured daily current affairs knowledge in less than 60 seconds.
        </p>
      </div>

      <div className="space-y-6 mb-10">
        <GlassCard className="border-white/10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold shrink-0 shadow-neon-emerald">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Our Mission</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Traditional competitive exam prep is overwhelming. ThreeQ breaks current affairs down into digestible daily 3-question micro-quizzes, ensuring consistent retention without cognitive burnout.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="border-white/10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-saffron-500/10 border border-saffron-500/20 flex items-center justify-center text-saffron-400 font-bold shrink-0 shadow-neon-saffron">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Daily Question Structure</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Every single day, exactly three multiple-choice questions are prepared following a strict exam-oriented distribution:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Question 1:</strong> Kerala Current Affairs (Governance, State Policy, Awards, Infrastructure)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Question 2:</strong> India National Current Affairs (Union Government, Supreme Court, Economy)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Question 3:</strong> Rotating Special Topic (Sports, Science & Tech, Environment, International)</span>
              </li>
            </ul>
          </div>
        </GlassCard>

        <GlassCard className="border-white/10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Accuracy & Editorial Review</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Questions are initially drafted using Gemini AI from reputable sources (The Hindu, PIB, Press Trust of India). Before publication, every quiz undergoes manual editorial review by human administrators.
            </p>
          </div>
        </GlassCard>
      </div>

      <GlassCard glow="emerald" className="text-center p-8 border-white/10">
        <h3 className="text-2xl font-black text-white mb-2">Ready to test your knowledge?</h3>
        <p className="text-slate-300 text-sm mb-6">Start today's 1-minute daily current affairs challenge now.</p>
        <Link href="/quiz/today">
          <GlowButton variant="emerald" size="lg">
            <span>Start Today's Quiz</span>
          </GlowButton>
        </Link>
      </GlassCard>
    </div>
  );
}
