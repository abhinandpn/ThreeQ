import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Quiz Keralam - 3 Questions. 1 Minute. Every Day.',
  description:
    'Test your Kerala and India current-affairs knowledge with a quick 3-question daily quiz. Prepared for Kerala PSC and competitive exams.',
  openGraph: {
    title: 'Quiz Keralam - Daily Current Affairs Quiz',
    description: '3 Questions. 1 Minute. Every Day. Kerala and India current affairs.',
    url: 'https://quizkeralam.com',
    siteName: 'Quiz Keralam',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-surface-bg text-slate-800 antialiased font-sans">
        <Header />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
