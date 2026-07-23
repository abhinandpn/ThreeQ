import { ApiResponse, PublicQuiz, Quiz, QuizAttemptResult, QuizSubmissionRequest, AdminDashboardStats } from '@/types';
import { getAdminToken } from './storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const adminToken = getAdminToken();
  if (adminToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'An error occurred while fetching data');
  }

  return json.data as T;
}

export const api = {
  // Public APIs
  getTodayQuiz: () => fetchAPI<PublicQuiz>('/api/v1/quizzes/today'),
  getQuizByDate: (date: string) => fetchAPI<PublicQuiz>(`/api/v1/quizzes/date/${date}`),
  getPublishedQuizzes: (page = 1, limit = 10) =>
    fetchAPI<{ quizzes: Quiz[]; total: number; page: number; limit: number }>(
      `/api/v1/quizzes?page=${page}&limit=${limit}`
    ),
  submitQuiz: (quizId: string, payload: QuizSubmissionRequest) =>
    fetchAPI<QuizAttemptResult>(`/api/v1/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getAttemptResult: (attemptId: string) =>
    fetchAPI<QuizAttemptResult>(`/api/v1/attempts/${attemptId}`),

  // Admin Auth API
  adminLogin: (credentials: { email: string; password: string }) =>
    fetchAPI<{ token: string; admin: any }>('/api/v1/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  // Admin APIs
  getAdminDashboard: () => fetchAPI<AdminDashboardStats>('/api/v1/admin/dashboard'),
  getAdminQuizzes: (status = '', page = 1, limit = 15) =>
    fetchAPI<{ quizzes: Quiz[]; total: number; page: number; limit: number }>(
      `/api/v1/admin/quizzes?status=${status}&page=${page}&limit=${limit}`
    ),
  getAdminQuiz: (id: string) => fetchAPI<Quiz>(`/api/v1/admin/quizzes/${id}`),
  createManualQuiz: (quizData: any) =>
    fetchAPI<Quiz>('/api/v1/admin/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData),
    }),
  updateAdminQuiz: (id: string, quizData: any) =>
    fetchAPI<Quiz>(`/api/v1/admin/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quizData),
    }),
  deleteDraftQuiz: (id: string) =>
    fetchAPI<void>(`/api/v1/admin/quizzes/${id}`, {
      method: 'DELETE',
    }),
  approveQuiz: (id: string) =>
    fetchAPI<void>(`/api/v1/admin/quizzes/${id}/approve`, {
      method: 'POST',
    }),
  publishQuiz: (id: string) =>
    fetchAPI<void>(`/api/v1/admin/quizzes/${id}/publish`, {
      method: 'POST',
    }),
  unpublishQuiz: (id: string) =>
    fetchAPI<void>(`/api/v1/admin/quizzes/${id}/unpublish`, {
      method: 'POST',
    }),
  generateDailyQuiz: (date?: string) =>
    fetchAPI<Quiz>('/api/v1/admin/quizzes/generate', {
      method: 'POST',
      body: JSON.stringify({ date }),
    }),
};
