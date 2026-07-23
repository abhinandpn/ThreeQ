const Storage = {
  GUEST_KEY: 'threeq_guest_id',
  DRAFT_KEY_PREFIX: 'threeq_draft_',
  TOKEN_KEY: 'threeq_admin_token',

  getOrCreateGuestId() {
    let id = localStorage.getItem(this.GUEST_KEY);
    if (!id) {
      id = 'guest_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem(this.GUEST_KEY, id);
    }
    return id;
  },

  saveDraftAnswers(quizId, answers) {
    localStorage.setItem(this.DRAFT_KEY_PREFIX + quizId, JSON.stringify(answers));
  },

  getDraftAnswers(quizId) {
    const data = localStorage.getItem(this.DRAFT_KEY_PREFIX + quizId);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  },

  clearDraftAnswers(quizId) {
    localStorage.removeItem(this.DRAFT_KEY_PREFIX + quizId);
  },

  getAdminToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  setAdminToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  },

  removeAdminToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }
};
