import { ResultClient } from './ClientPage';

export function generateStaticParams() {
  return [{ attemptId: 'sample' }];
}

export default function ResultPage() {
  return <ResultClient />;
}
