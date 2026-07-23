'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { removeAdminToken } from '@/lib/storage';
import { LayoutDashboard, ListFilter, PlusCircle, BarChart2, LogOut, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    removeAdminToken();
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Quizzes List', href: '/admin/quizzes', icon: ListFilter },
    { label: 'Create Quiz', href: '/admin/quizzes/new', icon: PlusCircle },
    { label: 'Analytics & Logs', href: '/admin/stats', icon: BarChart2 },
  ];

  return (
    <aside className="w-full md:w-64 bg-dark-surface/60 border-b md:border-b-0 md:border-r border-white/10 p-4 sm:p-6 shrink-0">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-neon-emerald">
          A
        </div>
        <div>
          <h2 className="font-extrabold text-white text-base leading-none">Admin Portal</h2>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">ThreeQ Engine</span>
        </div>
      </div>

      <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 mb-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all',
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-neon-emerald'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-emerald-400' : 'text-slate-400')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-white/10 mt-auto flex flex-col gap-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
          <span>View Live App →</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
