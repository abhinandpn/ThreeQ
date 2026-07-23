'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Calendar, BookOpen, Trophy, User, Settings, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/quiz/today', label: "Today's Quiz", icon: Calendar, highlight: true },
    { href: '/previous', label: 'Archive', icon: BookOpen },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-extrabold shadow-neon-emerald group-hover:scale-105 transition-transform border border-emerald-400/30 relative">
            <span className="text-xl tracking-tighter">3Q</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-saffron-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                ThreeQ
              </span>
              <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
              3 Questions • 1 Min
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            if (link.highlight) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs shadow-neon-emerald border border-emerald-400/30 hover:from-emerald-400 hover:to-emerald-500 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{link.label}</span>
                  <span className="sm:hidden">Quiz</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-white/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}

          {/* Admin link */}
          <Link
            href="/admin"
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 ml-1"
            title="Admin Portal"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
};
