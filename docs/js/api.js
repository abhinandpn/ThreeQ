const API = {
  async fetch(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const token = Storage.getAdminToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'An API error occurred');
    }

    return json.data;
  },

  // Public Endpoints
  getTodayQuiz() {
    return this.fetch('/api/v1/quizzes/today');
  },

  getQuizByDate(date) {
    return this.fetch(`/api/v1/quizzes/date/${date}`);
  },

  getPublishedQuizzes(page = 1, limit = 10) {
    return this.fetch(`/api/v1/quizzes?page=${page}&limit=${limit}`);
  },

  submitQuiz(quizId, payload) {
    return this.fetch(`/api/v1/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getAttemptResult(attemptId) {
    return this.fetch(`/api/v1/attempts/${attemptId}`);
  },

  // Admin Endpoints
  adminLogin(credentials) {
    return this.fetch('/api/v1/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getAdminDashboard() {
    return this.fetch('/api/v1/admin/dashboard');
  },

  getAdminQuizzes(status = '', page = 1, limit = 15) {
    return this.fetch(`/api/v1/admin/quizzes?status=${status}&page=${page}&limit=${limit}`);
  },

  getAdminQuiz(id) {
    return this.fetch(`/api/v1/admin/quizzes/${id}`);
  },

  createManualQuiz(data) {
    return this.fetch('/api/v1/admin/quizzes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateAdminQuiz(id, data) {
    return this.fetch(`/api/v1/admin/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteDraftQuiz(id) {
    return this.fetch(`/api/v1/admin/quizzes/${id}`, {
      method: 'DELETE',
    });
  },

  approveQuiz(id) {
    return this.fetch(`/api/v1/admin/quizzes/${id}/approve`, {
      method: 'POST',
    });
  },

  publishQuiz(id) {
    return this.fetch(`/api/v1/admin/quizzes/${id}/publish`, {
      method: 'POST',
    });
  },

  unpublishQuiz(id) {
    return this.fetch(`/api/v1/admin/quizzes/${id}/unpublish`, {
      method: 'POST',
    });
  },

  generateDailyQuiz(date) {
    return this.fetch('/api/v1/admin/quizzes/generate', {
      method: 'POST',
      body: JSON.stringify({ date }),
    });
  }
};
