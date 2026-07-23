import { AdminQuizReviewClient } from './ClientPage';

export function generateStaticParams() {
  return [{ id: 'sample' }];
}

export default function AdminQuizReviewPage() {
  return <AdminQuizReviewClient />;
}
