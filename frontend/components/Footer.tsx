import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-bg border-t border-white/[0.08] text-slate-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black text-sm flex items-center justify-center shadow-neon-emerald">
                3Q
              </div>
              <span className="font-black text-xl text-white tracking-tight">ThreeQ</span>
              <Sparkles className="w-4 h-4 text-saffron-400" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-4">
              3 Questions. 1 Minute. Every Day. Futuristic daily current affairs learning micro-platform focused on Kerala and India.
            </p>
            <p className="text-xs text-slate-500 font-mono">
              © {new Date().getFullYear()} ThreeQ. Built with Next.js & Go.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-3 text-xs tracking-widest uppercase">Navigation</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/quiz/today" className="hover:text-emerald-400 transition-colors">Today's Quiz</Link>
              </li>
              <li>
                <Link href="/previous" className="hover:text-emerald-400 transition-colors">Quiz Archive</Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-emerald-400 transition-colors">Leaderboard</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">About & FAQ</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-3 text-xs tracking-widest uppercase">Account & Admin</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/profile" className="hover:text-emerald-400 transition-colors">User Profile</Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-emerald-400 transition-colors">Settings</Link>
              </li>
              <li>
                <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-4">
            <span>Kerala Current Affairs</span>
            <span>•</span>
            <span>India National Affairs</span>
            <span>•</span>
            <span>Science & Technology</span>
          </div>
          <div className="font-mono text-slate-500">
            Asia/Kolkata (IST) UTC+5:30
          </div>
        </div>
      </div>
    </footer>
  );
};
