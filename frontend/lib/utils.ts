import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateKolkata(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch (e) {
    return dateStr;
  }
}

export function getTodayDateString(): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const formatter = new Intl.DateTimeFormat('en-CA', options);
  return formatter.format(new Date());
}

export function generateWhatsAppShareUrl(score: number, quizUrl: string): string {
  const shareText = `I scored ${score}/3 in today's Quiz Keralam current-affairs quiz! 🌴✨\nCan you beat my score?\n\nTake the 1-minute daily quiz here:\n${quizUrl}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
}
