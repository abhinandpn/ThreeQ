const GUEST_ID_KEY = 'quiz_keralam_guest_id';
const DRAFT_ANSWERS_KEY = 'quiz_keralam_draft_answers_';

export function getOrCreateGuestID(): string {
  if (typeof window === 'undefined') return 'guest-ssr';
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  return guestId;
}

export function saveDraftAnswers(quizId: string, answers: Record<string, 'A' | 'B' | 'C' | 'D'>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DRAFT_ANSWERS_KEY + quizId, JSON.stringify(answers));
}

export function getDraftAnswers(quizId: string): Record<string, 'A' | 'B' | 'C' | 'D'> | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(DRAFT_ANSWERS_KEY + quizId);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return null;
  }
}

export function clearDraftAnswers(quizId: string) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DRAFT_ANSWERS_KEY + quizId);
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('quiz_keralam_admin_token');
}

export function setAdminToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('quiz_keralam_admin_token', token);
}

export function removeAdminToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('quiz_keralam_admin_token');
}
