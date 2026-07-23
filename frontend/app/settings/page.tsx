'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { Badge } from '@/components/ui/Badge';
import { Settings, Moon, Bell, Volume2, Trash2, Check } from 'lucide-react';

export default function SettingsPage() {
  const [reminders, setReminders] = useState(true);
  const [soundFx, setSoundFx] = useState(true);
  const [cleared, setCleared] = useState(false);

  const handleClearData = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Badge variant="emerald" className="mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>App Preferences</span>
        </Badge>
        <h1 className="text-3xl font-black text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your ThreeQ quiz experience</p>
      </div>

      <div className="space-y-4">
        <GlassCard className="p-5 border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Appearance Theme</h4>
              <p className="text-xs text-slate-400">Dark Obsidian (Exclusive)</p>
            </div>
          </div>
          <Badge variant="emerald">Dark Mode Only</Badge>
        </GlassCard>

        <GlassCard className="p-5 border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-saffron-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Daily Quiz Reminders</h4>
              <p className="text-xs text-slate-400">Notify at 07:00 AM IST daily</p>
            </div>
          </div>
          <button
            onClick={() => setReminders(!reminders)}
            className={`w-12 h-6 rounded-full transition-colors p-1 ${
              reminders ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                reminders ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </GlassCard>

        <GlassCard className="p-5 border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Sound Effects</h4>
              <p className="text-xs text-slate-400">Confetti and button interaction audio</p>
            </div>
          </div>
          <button
            onClick={() => setSoundFx(!soundFx)}
            className={`w-12 h-6 rounded-full transition-colors p-1 ${
              soundFx ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                soundFx ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </GlassCard>

        <GlassCard className="p-5 border-red-500/20 flex items-center justify-between mt-8">
          <div>
            <h4 className="font-bold text-red-400 text-sm">Clear Local Quiz Data</h4>
            <p className="text-xs text-slate-400">Reset saved draft answers and guest ID</p>
          </div>
          <GlowButton variant="danger" size="sm" onClick={handleClearData}>
            {cleared ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
            <span>{cleared ? 'Cleared' : 'Reset Data'}</span>
          </GlowButton>
        </GlassCard>
      </div>
    </div>
  );
}
