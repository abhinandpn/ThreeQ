export type QuizStatus = 'draft' | 'approved' | 'published';
export type GeneratedBy = 'manual' | 'ai';

export interface PublicQuestion {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  category: string;
  display_order: number;
}

export interface PublicQuiz {
  id: string;
  quiz_date: string;
  title: string;
  questions: PublicQuestion[];
}

export interface Question {
  id?: string;
  quiz_id?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  category: string;
  source_name: string;
  source_url: string;
  source_date?: string;
  display_order: number;
}

export interface Quiz {
  id: string;
  quiz_date: string;
  title: string;
  status: QuizStatus;
  generated_by: GeneratedBy;
  published_at?: string;
  created_at: string;
  updated_at: string;
  questions?: Question[];
}

export interface QuestionAnswer {
  question_id: string;
  selected_option: 'A' | 'B' | 'C' | 'D';
}

export interface QuizSubmissionRequest {
  guest_id: string;
  answers: QuestionAnswer[];
}

export interface DetailedAnswer {
  question_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  selected_option: 'A' | 'B' | 'C' | 'D';
  correct_option: 'A' | 'B' | 'C' | 'D';
  is_correct: boolean;
  explanation: string;
  category: string;
  source_name: string;
  source_url: string;
  source_date?: string;
  display_order: number;
}

export interface QuizAttemptResult {
  attempt_id: string;
  quiz_id: string;
  quiz_date: string;
  title: string;
  score: number;
  total: number;
  result_message: string;
  answers: DetailedAnswer[];
}

export interface AdminDashboardStats {
  today_quiz_status: string;
  total_published: number;
  total_attempts: number;
  average_score: number;
  recent_quizzes: Quiz[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
}
