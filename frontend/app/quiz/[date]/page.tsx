import { QuizByDateClient } from './ClientPage';

export function generateStaticParams() {
  return [{ date: '2026-07-24' }];
}

export default function QuizByDatePage() {
  return <QuizByDateClient />;
}
